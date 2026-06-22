import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  CheckCircle2,
  Star,
  Layers,
  Search,
  Zap,
  FileText,
  ShieldCheck,
  Download,
  Plus,
  Minus,
  Sparkles,
  ArrowUpRight
} from "lucide-react"
import { AIResumeDemo } from "@/components/AIResumeDemo"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [resumesCounter, setResumesCounter] = useState(1842910)
  
  // Typing Effect
  const words = ["AI Resumes", "ATS-Friendly CVs", "Resume Scores", "Resume Layouts"]
  const [wordIdx, setWordIdx] = useState(0)
  const [subIndex, setSubIndex] = useState(0)
  const [reverse, setReverse] = useState(false)
  const [typeText, setTypeText] = useState("")

  // Increment counter to simulate live traffic
  useEffect(() => {
    const counterTimer = setInterval(() => {
      setResumesCounter(prev => prev + Math.floor(Math.random() * 3) + 1)
    }, 4500)
    return () => clearInterval(counterTimer)
  }, [])

  // Typing effect loop
  useEffect(() => {
    if (subIndex === words[wordIdx].length + 1 && !reverse) {
      const timeout = setTimeout(() => setReverse(true), 1500)
      return () => clearTimeout(timeout)
    }

    if (subIndex === 0 && reverse) {
      setReverse(false)
      setWordIdx((prev) => (prev + 1) % words.length)
      return
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1))
    }, reverse ? 60 : 100)

    return () => clearTimeout(timeout)
  }, [subIndex, reverse, wordIdx])

  useEffect(() => {
    setTypeText(words[wordIdx].substring(0, subIndex))
  }, [subIndex, wordIdx])

  const faqItems = [
    {
      q: "Is the resume ATS-compatible?",
      a: "Yes, all our templates are built using standard fonts and layouts that are 100% readable by Applicant Tracking Systems (ATS) used by top Fortune 500 companies."
    },
    {
      q: "How does the AI generation work?",
      a: "Our AI analysis engine parses your background, optimizes action verbs, and aligns your metrics with specific job descriptions to highlight quantifiable achievements."
    },
    {
      q: "Can I test my resume score for free?",
      a: "Absolutely. You can import any existing resume and receive an instant scoring report, ATS breakdown, and style issues without making any payments."
    },
    {
      q: "Who owns my resume after I download it?",
      a: "You retain 100% ownership of your resume and all generated career assets. We do not sell or share your professional profile with third parties."
    },
    {
      q: "What is the MR K AI Ecosystem?",
      a: "Founded by Karuppasamy M, MR K AI Ecosystem is an integrated suite of intelligence-driven career, document, and automation tools engineered to maximize human potential."
    }
  ]

  const trustCompanies = [
    "Google", "Amazon", "Meta", "Microsoft", "Stripe", "Netflix", "Deloitte", "Accenture", "TCS", "Infosys"
  ]

  return (
    <div className="min-h-screen bg-[#030712] text-white font-sans selection:bg-indigo-500/20 selection:text-indigo-400 overflow-x-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute top-[20%] right-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[140px] -z-10 pointer-events-none" />
      <div className="absolute top-[50%] left-10 w-[400px] h-[400px] bg-indigo-900/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

      {/* Navigation */}
      <Navbar />

      <main className="relative z-10">
        
        {/* HERO SECTION */}
        <section className="pt-32 pb-20 md:pt-48 md:pb-32 px-6">
          <div className="container mx-auto max-w-6xl text-center">
            
            {/* Live Counter Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-semibold tracking-wide text-indigo-400 mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{resumesCounter.toLocaleString()} Resumes Generated Today</span>
            </motion.div>

            {/* Title & Typing Animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight text-white leading-[1.15]">
                Build Professional <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400">
                  {typeText}
                </span>
                <span className="text-indigo-400 animate-pulse">|</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                Create recruiter-approved, ATS-optimized resumes in minutes using the world's most advanced AI-powered career generator.
              </p>
              
              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                <Link to="/auth/signup">
                  <Button size="lg" className="h-14 px-10 text-base rounded-full bg-indigo-600 hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 gap-2 font-bold border-none">
                    Build My Resume <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <a href="#templates">
                  <Button size="lg" variant="outline" className="h-14 px-10 text-base rounded-full border-slate-800 hover:bg-slate-900 bg-transparent text-white font-bold transition-all">
                    View Templates
                  </Button>
                </a>
              </div>
            </motion.div>

            {/* Interactive Demo Layout */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-20 relative max-w-4xl mx-auto border border-slate-800 bg-slate-950/45 rounded-3xl p-3 backdrop-blur-md shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 rounded-3xl -z-10 blur-xl" />
              <div className="h-[480px] rounded-2xl overflow-hidden border border-slate-900 bg-slate-950">
                <AIResumeDemo />
              </div>
            </motion.div>
          </div>
        </section>

        {/* TRUSTED BY / LOGO SLIDER */}
        <section className="py-12 border-y border-slate-900 bg-slate-950/20 relative overflow-hidden">
          <div className="container mx-auto px-6 text-center">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500 font-semibold mb-6">
              Accelerating Careers at the World's Leading Companies
            </p>
            <div className="w-full relative flex overflow-x-hidden">
              <div className="animate-marquee flex gap-12 whitespace-nowrap text-lg font-bold text-slate-600 tracking-wider">
                {trustCompanies.map((c, i) => (
                  <span key={i} className="hover:text-slate-400 transition-colors cursor-default">
                    {c}
                  </span>
                ))}
                {trustCompanies.map((c, i) => (
                  <span key={`dup-${i}`} className="hover:text-slate-400 transition-colors cursor-default">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-28 px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-20 max-w-2xl mx-auto space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">Streamlined Journey</span>
              <h2 className="text-3xl md:text-5xl font-black text-white">Three Steps to Land Your Dream Interview</h2>
              <p className="text-slate-400">A structured workflow optimized for engineers, managers, and designers.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Paste Job Link or Bio",
                  desc: "Connect your LinkedIn profile or paste the target job description to match skills.",
                  icon: <FileText className="w-10 h-10 text-indigo-400" />
                },
                {
                  step: "02",
                  title: "AI Optimizes Bullet Points",
                  desc: "Our engine optimizes action verbs, formats tables, and scores impact levels.",
                  icon: <Zap className="w-10 h-10 text-purple-400" />
                },
                {
                  step: "03",
                  title: "Download High-Res PDF",
                  desc: "Export 100% crawlable, ATS-optimized files with pixel-perfect margins.",
                  icon: <Download className="w-10 h-10 text-indigo-400" />
                }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -5 }}
                  className="relative group p-8 rounded-3xl bg-slate-950/40 border border-slate-900 hover:border-slate-800 shadow-xl transition-all duration-300 backdrop-blur-md"
                >
                  <div className="mb-6 w-16 h-16 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <div className="absolute top-8 right-8 text-6xl font-black text-slate-800/20 group-hover:text-indigo-500/10 transition-colors select-none">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-slate-400 leading-relaxed text-sm">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section id="features" className="py-28 bg-slate-950/60 border-y border-slate-900 relative">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
              <div className="space-y-4 max-w-2xl">
                <div className="text-indigo-400 font-bold tracking-widest uppercase text-xs">Unfair Advantage</div>
                <h2 className="text-3xl md:text-5xl font-black">Engineered for Technical Career Acceleration</h2>
              </div>
              <Link to="/auth/signup">
                <Button className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full px-8 h-12 font-bold border-none transition-all">
                  Start Building Free
                </Button>
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: "ATS Optimization Engine", desc: "Proprietary parser matching the exact requirements of Workday, Taleo, and Greenhouse systems.", icon: Search },
                { title: "AI Bullet Point Generation", desc: "Converts passive tasks into high-impact, metrics-driven accomplishments automatically.", icon: Sparkles },
                { title: "Dynamic Template Selector", desc: "Choose from professional resume templates, switching styles instantly without losing content.", icon: Layers },
                { title: "Resume Score Checker", desc: "Receive immediate detailed checklist reports grading margins, structures, and words.", icon: Zap },
                { title: "Deep Resume Analyzer", desc: "Detailed diagnostic checklists scanning formatting inconsistencies, syntax errors, and margins.", icon: FileText },
                { title: "Private & Secure Cloud", desc: "Enterprise-grade encryption protecting your data and profiles from public indices.", icon: ShieldCheck }
              ].map((feature, i) => {
                const Icon = feature.icon
                return (
                  <div key={i} className="p-8 rounded-3xl bg-slate-900/30 border border-slate-900 hover:border-slate-800 hover:bg-slate-900/50 transition-all backdrop-blur-md">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6 text-indigo-400">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-white">{feature.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* TEMPLATES */}
        <section id="templates" className="py-28 px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-20 space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">Proven Formats</span>
              <h2 className="text-3xl md:text-5xl font-black">Recruiter-Approved Resume Templates</h2>
              <p className="text-slate-400 max-w-xl mx-auto">Battle-tested layouts built using standard layouts readable by ATS parsers.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { name: "Modern Executive", tag: "Most Popular", color: "from-blue-600/35 to-indigo-900/20" },
                { name: "The Minimalist", tag: "ATS-Friendly Standard", color: "from-slate-800/30 to-slate-900/10" },
                { name: "Creative Edge", tag: "Best for Designers", color: "from-purple-600/35 to-pink-900/20" },
                { name: "Classic Corporate", tag: "MNC Standard", color: "from-slate-900 to-slate-950" },
                { name: "Clean Slate", tag: "Universal Layout", color: "from-emerald-600/35 to-teal-900/20" },
                { name: "Tech Pro", tag: "Developer Favorite", color: "from-indigo-600/35 to-slate-900/20" }
              ].map((tmpl, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -8 }}
                  className="group relative rounded-3xl overflow-hidden border border-slate-900 bg-slate-950/40 shadow-sm transition-all"
                >
                  <div className={`h-64 bg-gradient-to-br ${tmpl.color} relative overflow-hidden flex items-center justify-center text-slate-800 select-none border-b border-slate-900`}>
                    <FileText className="w-24 h-24 text-slate-700 opacity-40 group-hover:scale-105 transition-transform" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/80 backdrop-blur-xs gap-4">
                      <Button variant="secondary" className="rounded-full px-5 py-2.5 bg-slate-900 border border-slate-800 text-white hover:bg-slate-800">Preview</Button>
                      <Link to="/auth/signup">
                        <Button className="rounded-full px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white border-none">Use This</Button>
                      </Link>
                    </div>
                  </div>
                  <div className="p-6 flex justify-between items-center bg-slate-950/50 backdrop-blur-md">
                    <div>
                      <h4 className="font-bold text-white group-hover:text-indigo-400 transition-colors">{tmpl.name}</h4>
                      <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-1 block">{tmpl.tag}</span>
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-slate-600 group-hover:text-indigo-400 transition-colors" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* COMPARISON */}
        <section className="py-28 px-6 bg-slate-950/30 border-y border-slate-900">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-16 space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">Head-to-head Comparison</span>
              <h2 className="text-3xl md:text-5xl font-black">Why KS Resume Builder Stands Out</h2>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="p-6 text-xs font-bold uppercase tracking-widest text-slate-500">Core Features</th>
                    <th className="p-6 text-sm font-bold bg-indigo-950/40 text-indigo-400 border-x border-slate-800/80">KS Resume Builder</th>
                    <th className="p-6 text-xs font-bold uppercase tracking-widest text-slate-500">Generic Builders</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { f: "ATS Keywords Matching", ks: true, gen: false },
                    { f: "Interactive Score Checks", ks: true, gen: "Basic" },
                    { f: "Structured JSON-LD Export", ks: true, gen: false },
                    { f: "100% Vector Print PDFs", ks: true, gen: true },
                    { f: "Encrypted Data Vault", ks: true, gen: "No" },
                    { f: "AI Bullet Optimization", ks: true, gen: false }
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-slate-900 hover:bg-slate-900/20 transition-colors">
                      <td className="p-6 text-sm text-slate-300 font-medium">{row.f}</td>
                      <td className="p-6 bg-indigo-950/10 text-emerald-400 font-bold border-x border-slate-900">
                        {row.ks === true ? <CheckCircle2 className="text-emerald-400 w-5 h-5" /> : row.ks}
                      </td>
                      <td className="p-6 text-slate-500 text-sm">
                        {row.gen === true ? <CheckCircle2 className="text-slate-600 w-5 h-5" /> : (row.gen === false ? "No" : row.gen)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* TRUST SIGNALS / TESTIMONIALS */}
        <section className="py-28 px-6 bg-slate-950/10 relative overflow-hidden">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-20 space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">Success Stories</span>
              <h2 className="text-3xl md:text-5xl font-black">Trusted by Professionals Globally</h2>
              <p className="text-slate-400 max-w-xl mx-auto">See how engineering leaders and designers optimized their resumes to land roles.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { name: "Ankit Sharma", role: "SDE-2 @ Google", text: "KS Resume Builder played a crucial role in my Google application. The AI keywords optimizer matches descriptions instantly." },
                { name: "Priya Venkat", role: "Senior UX Designer", text: "I loved the minimalist template. It passed the ATS checks and recruiter reviews perfectly. Saved me days of formatting." },
                { name: "Mark Wilson", role: "Product Manager @ Stripe", text: "Structured scoring checklists showed formatting bugs I had ignored for years. Highly recommend this builder." }
              ].map((test, i) => (
                <div
                  key={i}
                  className="p-8 rounded-3xl bg-slate-950/60 border border-slate-900 shadow-xl space-y-6 hover:border-slate-800 transition-colors backdrop-blur-md"
                >
                  <div className="flex gap-1 text-yellow-500">
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 fill-yellow-500 text-yellow-500" />)}
                  </div>
                  <p className="text-slate-300 italic text-sm leading-relaxed">"{test.text}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-indigo-400">
                      {test.name.charAt(0)}
                    </div>
                    <div>
                      <h5 className="font-bold text-white text-sm">{test.name}</h5>
                      <p className="text-xs text-slate-500">{test.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Quick Metrics Wall */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-16 mt-16 border-t border-slate-900 text-center">
              <div>
                <h4 className="text-3xl md:text-4xl font-extrabold text-white">1.8M+</h4>
                <p className="text-xs text-slate-500 mt-2 uppercase tracking-wider font-semibold">Resumes Created</p>
              </div>
              <div>
                <h4 className="text-3xl md:text-4xl font-extrabold text-white">420K+</h4>
                <p className="text-xs text-slate-500 mt-2 uppercase tracking-wider font-semibold">Jobs Landed</p>
              </div>
              <div>
                <h4 className="text-3xl md:text-4xl font-extrabold text-white">99.2%</h4>
                <p className="text-xs text-slate-500 mt-2 uppercase tracking-wider font-semibold">ATS Pass Rate</p>
              </div>
              <div>
                <h4 className="text-3xl md:text-4xl font-extrabold text-white">4.9/5</h4>
                <p className="text-xs text-slate-500 mt-2 uppercase tracking-wider font-semibold">Recruiter Grade</p>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING SECTION */}
        <section id="pricing" className="py-28 bg-slate-950/40 border-y border-slate-900">
          <div className="container mx-auto max-w-5xl px-6">
            <div className="text-center mb-16 space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">Transparent Pricing</span>
              <h2 className="text-3xl md:text-5xl font-black">Simple Plans, Absolute Value</h2>
              <p className="text-slate-400">Get hired faster. Upgrade anytime. Cancel with a click.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center max-w-4xl mx-auto">
              
              {/* Free Plan */}
              <div className="p-8 sm:p-10 rounded-[32px] bg-slate-950/60 border border-slate-900 relative hover:border-slate-800 transition-all backdrop-blur-md">
                <h3 className="text-lg font-bold text-slate-400 mb-2">Free Starter</h3>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-extrabold text-white">₹0</span>
                  <span className="text-slate-500 text-sm ml-2">/ forever</span>
                </div>
                <ul className="space-y-4 mb-8 text-sm text-slate-400">
                  <li className="flex gap-2 items-center"><CheckCircle2 className="w-4.5 h-4.5 text-indigo-400" /> 1 Basic ATS Template</li>
                  <li className="flex gap-2 items-center"><CheckCircle2 className="w-4.5 h-4.5 text-indigo-400" /> Resume Score Checker</li>
                  <li className="flex gap-2 items-center"><CheckCircle2 className="w-4.5 h-4.5 text-indigo-400" /> Instant PDF Downloads</li>
                  <li className="flex gap-2 items-center text-slate-600"><CheckCircle2 className="w-4.5 h-4.5" /> Unlimited AI Generates (Restricted)</li>
                </ul>
                <Link to="/auth/signup" className="block w-full">
                  <Button variant="outline" className="w-full rounded-2xl h-12 border-slate-800 hover:bg-slate-900 bg-transparent text-white font-semibold">
                    Get Started Free
                  </Button>
                </Link>
              </div>

              {/* Premium Plan */}
              <div className="p-8 sm:p-10 rounded-[32px] bg-slate-900/60 border-2 border-indigo-500/80 relative hover:border-indigo-400 transition-all shadow-2xl shadow-indigo-500/5 backdrop-blur-md">
                <div className="absolute top-0 right-0 py-1.5 px-4.5 bg-indigo-500 rounded-bl-2xl text-[10px] font-bold uppercase tracking-widest text-white">
                  Best Offer
                </div>
                <h3 className="text-lg font-bold text-indigo-400 mb-2">Pro Advantage</h3>
                <div className="flex items-baseline mb-1">
                  <span className="text-4xl font-extrabold text-white">₹39</span>
                  <span className="text-slate-400 text-sm ml-2">/ first month</span>
                </div>
                <p className="text-xs text-slate-400 mb-6">Then ₹59/month. Cancel anytime.</p>
                <ul className="space-y-4 mb-8 text-sm text-slate-300">
                  <li className="flex gap-2 items-center"><CheckCircle2 className="w-4.5 h-4.5 text-indigo-400 font-bold" /> Unlimited AI Bullets & Resumes</li>
                  <li className="flex gap-2 items-center"><CheckCircle2 className="w-4.5 h-4.5 text-indigo-400 font-bold" /> All Premium Vector Layouts</li>
                  <li className="flex gap-2 items-center"><CheckCircle2 className="w-4.5 h-4.5 text-indigo-400 font-bold" /> Interactive ATS Scanner & Sandbox</li>
                  <li className="flex gap-2 items-center"><CheckCircle2 className="w-4.5 h-4.5 text-indigo-400 font-bold" /> Deep Margin & Style Analysis</li>
                </ul>
                <Link to="/auth/signup" className="block w-full">
                  <Button className="w-full rounded-2xl h-12 bg-indigo-600 hover:bg-indigo-500 text-white font-bold border-none transition-all shadow-lg shadow-indigo-600/25">
                    Upgrade Now
                  </Button>
                </Link>
              </div>

            </div>
          </div>
        </section>

        {/* FAQs */}
        <section id="faq" className="py-28 px-6">
          <div className="container mx-auto max-w-3xl">
            <div className="text-center mb-16 space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">Questions & Answers</span>
              <h2 className="text-3xl md:text-5xl font-black">Frequently Asked Questions</h2>
            </div>
            
            <div className="space-y-4">
              {faqItems.map((item, i) => (
                <div key={i} className="rounded-2xl border border-slate-900 bg-slate-950/40 backdrop-blur-md overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full p-6 text-left flex justify-between items-center transition-colors hover:bg-slate-900/30 focus:outline-none"
                  >
                    <span className="font-bold text-white text-base">{item.q}</span>
                    {openFaq === i ? <Minus className="w-5 h-5 text-indigo-400" /> : <Plus className="w-5 h-5 text-indigo-400" />}
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35 }}
                      >
                        <div className="px-6 pb-6 text-slate-400 text-sm leading-relaxed border-t border-slate-900/30 pt-4">
                          {item.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CALL TO ACTION */}
        <section className="py-28 px-6 relative overflow-hidden">
          <div className="container mx-auto max-w-5xl rounded-[40px] bg-gradient-to-br from-indigo-950/60 to-purple-950/40 p-12 md:p-24 text-center border border-indigo-900/30 backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 blur-[100px] pointer-events-none" />

            <div className="relative z-10 space-y-8">
              <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
                Supercharge Your Career Search Today
              </h2>
              <p className="text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
                Join high-performing tech professionals landing interviews at Google, Stripe, and Microsoft.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link to="/auth/signup">
                  <Button size="lg" className="h-14 px-10 text-base rounded-full bg-white text-black hover:bg-slate-200 transition-all font-bold border-none">
                    Build My Resume
                  </Button>
                </Link>
                <Link to="/auth/login">
                  <Button size="lg" variant="outline" className="h-14 px-10 text-base rounded-full border-slate-800 hover:bg-slate-900 bg-transparent text-white font-bold transition-all">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
