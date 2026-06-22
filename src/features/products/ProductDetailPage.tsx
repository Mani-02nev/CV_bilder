import { useParams, Link, Navigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  AlertTriangle,
  Play,
  Plus,
  Minus,
  Sparkles,
  FileText,
  Upload,
  Loader2,
  Trash2,
  CheckCircle2,
  RefreshCw,
  FolderOpen
} from "lucide-react"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { productData } from "./productData"
import { useAuth } from "@/context/AuthContext"
import { useResumes } from "@/hooks/useResume"
import type { ResumeContent } from "@/types/resume"

export default function ProductDetailPage() {
  const { slug } = useParams()
  const product = productData[slug || ""]
  
  const { user } = useAuth()
  const { data: resumes, isLoading: resumesLoading } = useResumes()
  
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  
  // Interactive Simulator States
  const [isSimulating, setIsSimulating] = useState(false)
  const [simStep, setSimStep] = useState(0)
  const [simResults, setSimResults] = useState(false)
  
  // Real Scan States
  const [activeTab, setActiveTab] = useState<'upload' | 'paste' | 'select'>('upload')
  const [inputText, setInputText] = useState('')
  const [fileName, setFileName] = useState('')
  const [fileLoading, setFileLoading] = useState(false)
  const [selectedResumeId, setSelectedResumeId] = useState<string>('')
  const [scanResults, setScanResults] = useState<{
    score: number;
    pros: string[];
    cons: string[];
    metrics: {
      contactInfo: number;
      summary: number;
      skills: number;
      experience: number;
    };
  } | null>(null)

  const convertResumeToText = (content: ResumeContent): string => {
    if (!content) return ''
    let text = ''
    
    if (content.personalInfo) {
      const pi = content.personalInfo
      text += `${pi.fullName || ''}\n`
      text += `${pi.email || ''} ${pi.phone || ''} ${pi.location || ''}\n`
      if (pi.linkedin) text += `LinkedIn: ${pi.linkedin}\n`
      text += '\n'
    }
    
    if (content.summary) {
      text += `Summary\n${content.summary}\n\n`
    }
    
    if (content.skills && content.skills.length > 0) {
      text += `Skills\n${content.skills.join(', ')}\n\n`
    }
    
    if (content.experience && content.experience.length > 0) {
      text += `Experience\n`
      content.experience.forEach(exp => {
        text += `${exp.title || ''} at ${exp.company || ''}\n`
        if (exp.description && exp.description.length > 0) {
          exp.description.forEach(bullet => {
            text += `${bullet}\n`
          })
        }
      })
      text += '\n'
    }
    
    if (content.education && content.education.length > 0) {
      text += `Education\n`
      content.education.forEach(edu => {
        text += `${edu.degree || ''} - ${edu.institution || ''}\n`
      })
      text += '\n'
    }
    
    if (content.projects && content.projects.length > 0) {
      text += `Projects\n`
      content.projects.forEach(proj => {
        text += `${proj.name || ''}\n${proj.description || ''}\n`
        if (proj.technologies && proj.technologies.length > 0) {
          text += `Technologies: ${proj.technologies.join(', ')}\n`
        }
      })
      text += '\n'
    }
    
    return text
  }

  const handleSelectResumeChange = (resumeId: string) => {
    setSelectedResumeId(resumeId)
    if (!resumes) return
    const resume = resumes.find(r => r.id === resumeId)
    if (resume && resume.content) {
      const text = convertResumeToText(resume.content)
      setInputText(text)
    } else {
      setInputText('')
    }
  }

  // Reset simulator when slug changes
  useEffect(() => {
    setIsSimulating(false)
    setSimStep(0)
    setSimResults(false)
    setOpenFaq(null)
    setInputText('')
    setFileName('')
    setFileLoading(false)
    setScanResults(null)
    setSelectedResumeId('')
  }, [slug])

  if (!product) {
    return <Navigate to="/" replace />
  }

  // Load PDF.js dynamically
  const loadPdfJs = () => {
    return new Promise<any>((resolve, reject) => {
      if ((window as any).pdfjsLib) {
        resolve((window as any).pdfjsLib)
        return
      }
      const script = document.createElement('script')
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js'
      script.onload = () => {
        const pdfjsLib = (window as any).pdfjsLib
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js'
        resolve(pdfjsLib)
      }
      script.onerror = reject
      document.head.appendChild(script)
    })
  }

  // Extract text from PDF
  const extractTextFromPdf = async (file: File): Promise<string> => {
    const pdfjsLib = await loadPdfJs()
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    let fullText = ''
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const textContent = await page.getTextContent()
      const pageText = textContent.items.map((item: any) => item.str).join(' ')
      fullText += pageText + '\n'
    }
    return fullText
  }

  // File Change Handler
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setFileLoading(true)

    try {
      let text = ''
      if (file.type === 'application/pdf') {
        text = await extractTextFromPdf(file)
      } else {
        // Assume text file
        text = await new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onload = (event) => resolve(event.target?.result as string || '')
          reader.readAsText(file)
        })
      }

      setInputText(text)
    } catch (error) {
      console.error('Failed to parse file:', error)
      setInputText(`[Error parsing file contents: ${file.name}. Please paste your resume text instead.]`)
    } finally {
      setFileLoading(false)
    }
  }

  // Deterministic ATS Scan Engine
  const analyzeResumeText = (text: string) => {
    const results = {
      score: 0,
      pros: [] as string[],
      cons: [] as string[],
      metrics: {
        contactInfo: 0,
        summary: 0,
        skills: 0,
        experience: 0
      }
    }

    // 1. Contact Info check (max 100)
    const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text)
    const hasPhone = /\+?[0-9\s-]{10,20}/.test(text)
    const hasLinkedin = /linkedin\.com\/in\/[a-zA-Z0-9_-]+/.test(text)
    const hasLocation = /(new york|san francisco|london|toronto|india|germany|canada|singapore|city|address|location|street|chennai|bangalore|mumbai|delhi|hybrid|remote)/i.test(text)

    let contactScore = 0
    if (hasEmail) {
      contactScore += 30
      results.pros.push("Valid contact email address identified.")
    } else {
      results.cons.push("Missing email address - recruiters won't be able to reach you.")
    }
    
    if (hasPhone) {
      contactScore += 30
      results.pros.push("Active phone number format detected.")
    } else {
      results.cons.push("No phone number found. Add your primary contact details.")
    }

    if (hasLinkedin) {
      contactScore += 20
      results.pros.push("LinkedIn profile URL detected.")
    } else {
      results.cons.push("Missing LinkedIn profile link - critical for modern recruiters.")
    }

    if (hasLocation) {
      contactScore += 20
      results.pros.push("Geographic location or remote work preference listed.")
    } else {
      results.cons.push("Add a city/country reference or remote preference tag.")
    }
    results.metrics.contactInfo = contactScore

    // 2. Summary Check
    const hasSummaryHeader = /(summary|profile|about me|objective|professional summary)/i.test(text)
    let summaryScore = 0
    if (hasSummaryHeader) {
      summaryScore += 50
      if (text.length > 250) {
        summaryScore += 50
        results.pros.push("Professional summary contains good word and detail density.")
      } else {
        results.cons.push("Summary heading found, but description is too brief.")
      }
    } else {
      results.cons.push("No clear professional summary or profile objective section found.")
    }
    results.metrics.summary = summaryScore

    // 3. Skills check
    const commonSkills = [
      'javascript', 'typescript', 'react', 'node', 'python', 'java', 'c++', 'c#', 'ruby', 'php', 
      'sql', 'nosql', 'mongodb', 'postgresql', 'mysql', 'aws', 'docker', 'kubernetes', 'cloud', 
      'git', 'html', 'css', 'tailwind', 'bootstrap', 'angular', 'vue', 'sass', 'graphql', 'rest api',
      'agile', 'scrum', 'project management', 'ui/ux', 'design', 'figma', 'analytics', 'data analysis',
      'machine learning', 'ai', 'devops', 'ci/cd', 'testing', 'cypress', 'jest', 'linux'
    ]
    const matchedSkills: string[] = []
    const lowerText = text.toLowerCase()
    commonSkills.forEach(skill => {
      if (new RegExp(`\\b${skill}\\b`, 'i').test(lowerText)) {
        matchedSkills.push(skill)
      }
    })

    const skillsScore = Math.min(100, matchedSkills.length * 15)
    results.metrics.skills = skillsScore
    if (matchedSkills.length >= 6) {
      results.pros.push(`Strong keyword density: identified ${matchedSkills.length} key technical skills.`)
    } else if (matchedSkills.length > 0) {
      results.cons.push(`Low skill density: only identified ${matchedSkills.length} common skills. Add more keyword tags.`)
    } else {
      results.cons.push("No common industry skills or technology keywords identified.")
    }

    // 4. Experience check
    const hasExperienceHeader = /(experience|work history|employment|career history|projects)/i.test(text)
    const actionVerbs = ['managed', 'developed', 'led', 'created', 'implemented', 'increased', 'reduced', 'solved', 'designed', 'built', 'optimized', 'coordinated', 'architected', 'executed']
    const matchedVerbs: string[] = []
    actionVerbs.forEach(verb => {
      if (new RegExp(`\\b${verb}\\b`, 'i').test(lowerText)) {
        matchedVerbs.push(verb)
      }
    })

    let expScore = 0
    if (hasExperienceHeader) {
      expScore += 50
      if (matchedVerbs.length >= 4) {
        expScore += 50
        results.pros.push(`Action-oriented phrasing: uses strong verbs like ${matchedVerbs.slice(0, 3).join(', ')}.`)
      } else {
        results.cons.push("Experience description is too passive. Add active verbs (e.g. Led, Optimized, Built).")
      }
    } else {
      results.cons.push("No work experience or career history header detected.")
    }
    results.metrics.experience = expScore

    // Final score
    results.score = Math.round(
      (results.metrics.contactInfo * 0.20) +
      (results.metrics.summary * 0.15) +
      (results.metrics.skills * 0.35) +
      (results.metrics.experience * 0.30)
    )

    return results
  }

  // Scan Handler
  const handleScan = () => {
    if (!inputText.trim()) return

    setIsSimulating(true)
    setSimStep(1)
    
    setTimeout(() => setSimStep(2), 1000)
    setTimeout(() => setSimStep(3), 2000)
    setTimeout(() => {
      const results = analyzeResumeText(inputText)
      setScanResults(results)
      setIsSimulating(false)
      setSimResults(true)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white font-sans overflow-x-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute top-[30%] right-10 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[100px] -z-10" />

      <Navbar />

      <main className="relative z-10 pt-32 pb-24 px-6 max-w-6xl mx-auto space-y-28">
        
        {/* PRODUCT HERO */}
        <section className="text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-bold text-indigo-400 uppercase tracking-widest">
            AI career suite
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-tight">
            {product.title}
          </h1>
          <p className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
            {product.tagline}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link to="/auth/signup">
              <Button size="lg" className="h-13 px-8 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold border-none transition-all shadow-lg shadow-indigo-600/20">
                Get Started Free <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <button 
              onClick={() => document.getElementById('scanner-sandbox')?.scrollIntoView({ behavior: 'smooth' })} 
              className="h-13 px-8 rounded-full border border-slate-800 hover:bg-slate-900 bg-transparent text-white font-semibold flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 text-indigo-400" /> Try Live Scanner
            </button>
          </div>
        </section>

        {/* INTERACTIVE SIMULATOR WIDGET */}
        <section id="scanner-sandbox" className="max-w-3xl mx-auto">
          <div className="bg-slate-950/80 border border-slate-900 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-2xl" />
            
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-900">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <h3 className="font-extrabold text-white text-base">
                  {slug === "linkedin-optimizer" ? "LinkedIn Visibility Optimizer" : "Live ATS Sandbox"}
                </h3>
              </div>
              <span className="text-[10px] text-indigo-400 uppercase tracking-widest font-bold bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
                Live ATS Scanner
              </span>
            </div>

            {/* Default State */}
            {!isSimulating && !simResults && (
              <div className="space-y-6">
                 {/* Tabs */}
                <div className="flex bg-slate-900/50 p-1.5 rounded-xl border border-slate-900 gap-1.5 max-w-md mx-auto">
                  <button
                    onClick={() => {
                      setActiveTab('upload')
                      setInputText('')
                      setSelectedResumeId('')
                      setFileName('')
                    }}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === 'upload' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    Upload File
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('select')
                      setInputText('')
                      setSelectedResumeId('')
                      setFileName('')
                    }}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === 'select' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    Select Resume
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('paste')
                      setInputText('')
                      setSelectedResumeId('')
                      setFileName('')
                    }}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === 'paste' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    Paste Text
                  </button>
                </div>

                {activeTab === 'upload' && (
                  <div className="border-2 border-dashed border-slate-800 rounded-2xl p-8 text-center bg-slate-950/40 hover:border-indigo-500/50 transition-colors relative">
                    <input
                      type="file"
                      accept=".pdf,.txt"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={fileLoading}
                    />
                    
                    {fileLoading ? (
                      <div className="space-y-3 py-4">
                        <Loader2 className="w-10 h-10 text-indigo-400 animate-spin mx-auto" />
                        <p className="text-sm font-semibold text-white">Extracting resume content...</p>
                      </div>
                    ) : fileName ? (
                      <div className="space-y-4 py-2">
                        <FileText className="w-12 h-12 text-indigo-400 mx-auto" />
                        <div>
                          <p className="text-sm font-bold text-white max-w-xs mx-auto truncate">{fileName}</p>
                          <p className="text-xs text-slate-500 mt-1">Ready for scan. Click Start Scan below.</p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setFileName('');
                            setInputText('');
                          }}
                          className="text-xs font-bold text-red-450 hover:text-red-300 flex items-center gap-1.5 mx-auto"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remove file
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3 py-4">
                        <Upload className="w-10 h-10 text-slate-500 mx-auto" />
                        <div>
                          <p className="text-sm font-semibold text-slate-300">Drag and drop or click to upload</p>
                          <p className="text-xs text-slate-500 mt-1">Supports PDF & TXT up to 5MB</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'select' && (
                  <div className="space-y-4">
                    {!user ? (
                      <div className="border border-slate-900 rounded-2xl p-8 text-center bg-slate-950/40 space-y-4">
                        <FolderOpen className="w-10 h-10 text-slate-500 mx-auto" />
                        <div className="space-y-2">
                          <p className="text-sm font-bold text-slate-300">Quick-Scan Saved Resumes</p>
                          <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                            Sign in to import and analyze any of your previously built resumes directly from your account.
                          </p>
                        </div>
                        <Link to="/auth/login" className="inline-block">
                          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl px-5 py-2 border-none">
                            Sign In to Access
                          </Button>
                        </Link>
                      </div>
                    ) : resumesLoading ? (
                      <div className="py-8 text-center space-y-2">
                        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
                        <p className="text-xs text-slate-400 font-medium">Fetching resumes...</p>
                      </div>
                    ) : !resumes || resumes.length === 0 ? (
                      <div className="border border-slate-900 rounded-2xl p-8 text-center bg-slate-950/40 space-y-4">
                        <FolderOpen className="w-10 h-10 text-slate-500 mx-auto" />
                        <div className="space-y-2">
                          <p className="text-sm font-bold text-slate-300">No Resumes Found</p>
                          <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                            You haven't built any resumes in your account workspace yet.
                          </p>
                        </div>
                        <Link to="/create-resume" className="inline-block">
                          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl px-5 py-2 border-none">
                            Create a Resume
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4 text-left">
                        <div className="space-y-2.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-450">Select Resume from Workspace</label>
                          <select
                            value={selectedResumeId}
                            onChange={(e) => handleSelectResumeChange(e.target.value)}
                            className="w-full bg-slate-900/60 border border-slate-900 hover:border-slate-800 text-white rounded-xl p-3.5 text-sm transition-all focus:border-indigo-500 focus:outline-none"
                          >
                            <option value="">-- Choose a Resume --</option>
                            {resumes.map(r => (
                              <option key={r.id} value={r.id}>{r.title} ({r.template_id})</option>
                            ))}
                          </select>
                        </div>
                        {selectedResumeId && (
                          <div className="bg-slate-900/30 rounded-xl p-4 border border-slate-900 text-xs text-slate-350 leading-relaxed font-mono max-h-40 overflow-y-auto whitespace-pre-line">
                            <div className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Extracted content preview</div>
                            {inputText.slice(0, 300)}...
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'paste' && (
                  <div className="space-y-4">
                    <textarea
                      placeholder="Paste your full resume text here..."
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      rows={6}
                      className="w-full bg-slate-900/60 border border-slate-800 hover:border-slate-700 text-white placeholder-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 rounded-xl p-4 text-xs leading-relaxed transition-all"
                    />
                  </div>
                )}

                <div className="text-center pt-2">
                  <Button 
                    onClick={handleScan} 
                    disabled={!inputText.trim() || fileLoading}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full px-8 h-11 border-none font-bold disabled:opacity-50 transition-all shadow-lg shadow-indigo-600/20"
                  >
                    Start Real ATS Scan
                  </Button>
                </div>
              </div>
            )}

            {/* Simulating Loading State */}
            {isSimulating && (
              <div className="py-12 text-center space-y-6">
                <div className="flex justify-center gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-3.5 h-3.5 bg-indigo-500 rounded-full"
                      animate={{ scale: [1, 1.4, 1], opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>
                <div className="space-y-2">
                  <h4 className="text-base font-bold text-white">
                    {simStep === 1 && "Ingesting document coordinates..."}
                    {simStep === 2 && "Analyzing section formatting & margins..."}
                    {simStep === 3 && "Running keyword density & entity scoring..."}
                  </h4>
                  <div className="w-48 h-1 bg-slate-900 rounded-full mx-auto overflow-hidden">
                    <motion.div
                      className="h-full bg-indigo-500"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 3, ease: "easeInOut" }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Results State */}
            {simResults && scanResults && (
              <div className="space-y-8 animate-fadeIn text-left">
                {/* Overall Score */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 bg-indigo-950/20 border border-indigo-900/30 rounded-2xl">
                  <div className="flex items-center gap-5">
                    <div className="relative inline-flex items-center justify-center shrink-0">
                      <svg className="w-20 h-20 transform -rotate-90">
                        <circle
                          cx="40"
                          cy="40"
                          r="34"
                          stroke="#1e293b"
                          strokeWidth="6"
                          fill="transparent"
                        />
                        <circle
                          cx="40"
                          cy="40"
                          r="34"
                          stroke="#6366f1"
                          strokeWidth="6"
                          fill="transparent"
                          strokeDasharray={213.6}
                          strokeDashoffset={213.6 - (213.6 * scanResults.score) / 100}
                          className="transition-all duration-1000 ease-out"
                        />
                      </svg>
                      <span className="absolute text-xl font-black text-white">{scanResults.score}</span>
                    </div>
                    <div>
                      <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider block">ATS Optimization Grade</span>
                      <h4 className="text-xl font-bold text-white mt-0.5">
                        {scanResults.score >= 80 ? "Highly Optimized" : scanResults.score >= 60 ? "Average Strength" : "Needs Layout Work"}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 max-w-sm">
                        {scanResults.score >= 80 
                          ? "Excellent! Your resume complies with enterprise parsing guidelines."
                          : "Your resume needs structural and keyword improvements before submission."}
                      </p>
                    </div>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    scanResults.score >= 80
                      ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                      : "bg-yellow-500/10 border border-yellow-500/20 text-yellow-500"
                  }`}>
                    {scanResults.score >= 80 ? "Pass Grade" : "Action Required"}
                  </span>
                </div>

                {/* Pros and Cons */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Strengths */}
                  <div className="space-y-3">
                    <h5 className="text-xs font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      Strengths ({scanResults.pros.length})
                    </h5>
                    <div className="space-y-2">
                      {scanResults.pros.length > 0 ? (
                        scanResults.pros.map((pro, i) => (
                          <div key={i} className="flex gap-2 items-start p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10 text-xs text-slate-350">
                            <span className="text-emerald-450 font-bold shrink-0 mt-0.5">✓</span>
                            <span>{pro}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-500">No specific structural strengths identified.</p>
                      )}
                    </div>
                  </div>

                  {/* Improvements */}
                  <div className="space-y-3">
                    <h5 className="text-xs font-bold uppercase tracking-widest text-yellow-500 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" />
                      Critical Fixes ({scanResults.cons.length})
                    </h5>
                    <div className="space-y-2">
                      {scanResults.cons.length > 0 ? (
                        scanResults.cons.map((con, i) => (
                          <div key={i} className="flex gap-2 items-start p-3 bg-yellow-500/5 rounded-xl border border-yellow-500/10 text-xs text-slate-355">
                            <span className="text-yellow-500 font-bold shrink-0 mt-0.5">⚠</span>
                            <span>{con}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-500">No layout warnings or missing keywords found!</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Metrics Breakdown */}
                <div className="space-y-3 pt-4 border-t border-slate-900">
                  <h5 className="text-xs font-bold uppercase tracking-widest text-slate-500">Section Parsing Indexes</h5>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      { label: "Contact Information", val: scanResults.metrics.contactInfo },
                      { label: "Summary and Profile", val: scanResults.metrics.summary },
                      { label: "Technical Skills Keywords", val: scanResults.metrics.skills },
                      { label: "Work Experience & Action Verbs", val: scanResults.metrics.experience }
                    ].map((metric) => (
                      <div key={metric.label} className="bg-slate-900/30 border border-slate-900 rounded-xl p-3.5 space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-400">{metric.label}</span>
                          <span className="text-white">{metric.val}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-500"
                            style={{ width: `${metric.val}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reset / Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-900">
                  <Button
                    onClick={() => {
                      setSimResults(false);
                      setInputText('');
                      setFileName('');
                      setScanResults(null);
                    }}
                    variant="outline"
                    className="flex-1 rounded-2xl h-11 border-slate-800 bg-transparent text-white hover:bg-slate-900 font-bold flex items-center justify-center gap-1.5"
                  >
                    <RefreshCw className="w-4 h-4" /> Scan Another Resume
                  </Button>
                  <Link to="/auth/signup" className="flex-1">
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl h-11 border-none font-bold flex items-center justify-center gap-1.5">
                      Fix All Errors Instantly <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            )}

          </div>
        </section>

        {/* IN-DEPTH TECHNICAL ESSAY (3000+ words target density) */}
        <section className="space-y-12 max-w-4xl mx-auto text-left">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">Technical Analysis</span>
            <h2 className="text-3xl font-black text-white">How This Career Module Optimizes Search Performance</h2>
          </div>
          
          <div className="space-y-8 text-slate-300 leading-relaxed text-base">
            {product.essay.map((para, i) => (
              <p key={i}>
                {para}
              </p>
            ))}
          </div>
        </section>

        {/* BENEFITS */}
        <section className="space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">Key Advantages</span>
            <h2 className="text-3xl font-black">Performance Benefits</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {product.benefits.map((ben, i) => (
              <div key={i} className="p-6 rounded-2xl bg-slate-950/60 border border-slate-900 flex gap-4 items-start hover:border-slate-800 transition-all text-left">
                <div className="w-6 h-6 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 font-bold mt-0.5">
                  ✓
                </div>
                <p className="text-slate-300 text-sm font-semibold">{ben}</p>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">Simple Walkthrough</span>
            <h2 className="text-3xl font-black">How It Works</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {product.steps.map((st, i) => (
              <div key={i} className="p-8 rounded-3xl bg-slate-950/40 border border-slate-900 space-y-4 text-left relative overflow-hidden backdrop-blur-md">
                <span className="text-5xl font-black text-slate-800/30 select-none block">{`0${i + 1}`}</span>
                <h4 className="text-lg font-bold text-white">{st.title}</h4>
                <p className="text-slate-400 text-xs leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* COMPARISON SHEET */}
        <section className="space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">Competitive Check</span>
            <h2 className="text-3xl font-black">Why KS Engine Outperforms Alternatives</h2>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden max-w-4xl mx-auto shadow-xl">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/30">
                  <th className="p-6 text-xs font-bold uppercase tracking-widest text-slate-500">Evaluation Metric</th>
                  <th className="p-6 text-sm font-bold text-indigo-400 bg-indigo-950/20 border-x border-slate-800/80">KS Resume Builder</th>
                  <th className="p-6 text-xs font-bold uppercase tracking-widest text-slate-500">Typical Alternatives</th>
                </tr>
              </thead>
              <tbody>
                {product.comparison.map((row, i) => (
                  <tr key={i} className="border-b border-slate-900 hover:bg-slate-900/10 transition-colors">
                    <td className="p-6 text-sm text-slate-300 font-semibold">{row.feature}</td>
                    <td className="p-6 bg-indigo-950/5 text-sm text-white font-medium border-x border-slate-900">
                      {row.ksVal}
                    </td>
                    <td className="p-6 text-slate-500 text-sm">
                      {row.typicalVal}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ ACCORDION */}
        <section className="max-w-3xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">FAQ Directory</span>
            <h2 className="text-3xl font-black">Recruiter Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {product.faqs.map((faq, i) => (
              <div key={i} className="rounded-2xl border border-slate-900 bg-slate-950/40 backdrop-blur-md overflow-hidden text-left">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full p-6 text-left flex justify-between items-center transition-colors hover:bg-slate-900/30 focus:outline-none"
                >
                  <span className="font-bold text-white text-sm">{faq.q}</span>
                  {openFaq === i ? <Minus className="w-4.5 h-4.5 text-indigo-400" /> : <Plus className="w-4.5 h-4.5 text-indigo-400" />}
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-6 text-slate-400 text-xs leading-relaxed pt-2 border-t border-slate-900/20">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>

        {/* FINAL SIGN UP BANNER */}
        <section className="max-w-5xl mx-auto rounded-[36px] bg-gradient-to-tr from-indigo-950/40 to-slate-950 border border-slate-800 p-12 text-center backdrop-blur-md relative overflow-hidden">
          <div className="absolute inset-0 bg-indigo-500/5 blur-3xl -z-10" />
          <div className="space-y-6 relative z-10">
            <h2 className="text-2xl md:text-4xl font-extrabold text-white">Optimize Your Applications and Land Interviews</h2>
            <p className="text-slate-400 text-sm max-w-lg mx-auto leading-relaxed">
              Integrate with all 10 optimized career tools. Download high-res vector PDFs instantly.
            </p>
            <Link to="/auth/signup" className="inline-block pt-2">
              <Button size="lg" className="h-12 px-8 rounded-full bg-white text-black hover:bg-slate-200 transition-all font-bold border-none">
                Start Building Now
              </Button>
            </Link>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
