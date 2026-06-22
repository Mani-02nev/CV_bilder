import { useParams, useNavigate, useSearchParams } from "react-router-dom"
import { useState, useEffect, useRef, useMemo } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Save, Download, Trash2, Plus, Sparkles, Eye, ChevronLeft, Search, Loader2, Upload } from 'lucide-react'
import { ATSAnalyser } from './components/ATSAnalyser'
import { useResume, useUpdateResumeContent } from "@/hooks/useResume"
import type { ResumeContent, PersonalInfo, Experience, Education, Project } from "@/types/resume"
import { aiService } from "@/services/ai"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ResumeTemplate } from "@/components/templates/ResumeTemplate"


export default function ResumeBuilderPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const { data: resume, isLoading } = useResume(id!)
    const updateContent = useUpdateResumeContent()


    const [content, setContent] = useState<ResumeContent>({})
    const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "bio")
    const [showAIDialog, setShowAIDialog] = useState(false)
    const [showMobilePreview, setShowMobilePreview] = useState(false)
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200)
    const [aiParams, setAiParams] = useState({
        jobTitle: "",
        industry: "",
        experienceLevel: "mid"
    })
    const [isGenerating, setIsGenerating] = useState(false)
    const [isDownloading, setIsDownloading] = useState(false)
    const resumeRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth)
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    useEffect(() => {
        if (resume?.content) {
            setContent(resume.content)
        }
    }, [resume])

    const atsScore = useMemo(() => {
        let contactInfo = 0
        if (content.personalInfo?.fullName) contactInfo += 20
        if (content.personalInfo?.email) contactInfo += 20
        if (content.personalInfo?.phone) contactInfo += 20
        if (content.personalInfo?.location) contactInfo += 20
        if (content.personalInfo?.linkedin) contactInfo += 20

        let summary = 0
        if (content.summary && content.summary.length > 50) {
            summary = 100
        } else if (content.summary) {
            summary = 50
        }

        const skillCount = content.skills?.length || 0
        const skills = Math.min(100, skillCount * 10)

        const expCount = content.experience?.length || 0
        const experience = Math.min(100, expCount * 30)

        const education = (content.education && content.education.length > 0) ? 100 : 0

        return Math.round(
            (contactInfo * 0.15) +
            (summary * 0.15) +
            (skills * 0.25) +
            (experience * 0.35) +
            (education * 0.10)
        )
    }, [content])

    const handleSave = async () => {
        if (!id) return
        try {
            await updateContent.mutateAsync({ id, content })
            toast.success("Resume saved!")
        } catch (error) {
            console.error('Failed to save:', error)
            toast.error("Failed to save")
        }
    }

    const handleDownload = async () => {
        setIsDownloading(true)
        try {
            const element = resumeRef.current
            if (!element) return

            const html2pdf = (await import('html2pdf.js')).default

            const opt = {
                margin: 0,
                filename: `${resume?.title || 'resume'}.pdf`,
                image: { type: 'jpeg' as const, quality: 1 },
                html2canvas: {
                    scale: 3,
                    useCORS: true,
                    logging: false,
                    letterRendering: true,
                    windowWidth: 794,
                    scrollY: 0,
                    scrollX: 0
                },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const },
                pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
            }

            await (html2pdf() as any).set(opt).from(element).save()
            toast.success('Resume downloaded successfully!')
        } catch (error) {
            console.error('Failed to download:', error)
            toast.error('Failed to download PDF. Please try again.')
        } finally {
            setIsDownloading(false)
        }
    }

    const handleAIGenerate = async () => {
        if (!aiParams.jobTitle || !aiParams.industry) return
        setIsGenerating(true)
        try {
            const generated = await aiService.generateResume(aiParams)
            setContent(prev => ({
                ...prev,
                summary: generated.professionalSummary,
                skills: generated.skills,
                experience: generated.experience.map((exp, idx) => ({
                    id: `exp-${Date.now()}-${idx}`,
                    title: exp.title,
                    company: exp.company,
                    location: "",
                    startDate: "",
                    endDate: exp.period,
                    current: false,
                    description: exp.description
                })),
                projects: generated.projects.map((proj, idx) => ({
                    id: `proj-${Date.now()}-${idx}`,
                    name: proj.name,
                    description: proj.description,
                    technologies: []
                }))
            }))
            setShowAIDialog(false)
            setActiveTab("bio")
            toast.success("Content generated!")
        } catch (error) {
            console.error('AI generation failed:', error)
            toast.error('Failed to generate content.')
        } finally {
            setIsGenerating(false)
        }
    }

    const updatePersonalInfo = (field: keyof PersonalInfo, value: string) => {
        setContent(prev => ({
            ...prev,
            personalInfo: {
                ...prev.personalInfo,
                [field]: value
            } as PersonalInfo
        }))
    }

    const addExperience = () => {
        const newExp: Experience = {
            id: `exp-${Date.now()}`,
            title: "",
            company: "",
            location: "",
            startDate: "",
            endDate: "",
            current: false,
            description: []
        }
        setContent(prev => ({
            ...prev,
            experience: [...(prev.experience || []), newExp]
        }))
    }

    const updateExperience = (id: string, field: keyof Experience, value: any) => {
        setContent(prev => ({
            ...prev,
            experience: prev.experience?.map(exp =>
                exp.id === id ? { ...exp, [field]: value } : exp
            )
        }))
    }

    const removeExperience = (id: string) => {
        setContent(prev => ({
            ...prev,
            experience: prev.experience?.filter(exp => exp.id !== id)
        }))
    }

    const addEducation = () => {
        const newEdu: Education = {
            id: `edu-${Date.now()}`,
            degree: "",
            institution: "",
            location: "",
            startDate: "",
            endDate: "",
            gpa: ""
        }
        setContent(prev => ({
            ...prev,
            education: [...(prev.education || []), newEdu]
        }))
    }

    const updateEducation = (id: string, field: keyof Education, value: string) => {
        setContent(prev => ({
            ...prev,
            education: prev.education?.map(edu =>
                edu.id === id ? { ...edu, [field]: value } : edu
            )
        }))
    }

    const removeEducation = (id: string) => {
        setContent(prev => ({
            ...prev,
            education: prev.education?.filter(edu => edu.id !== id)
        }))
    }

    const addProject = () => {
        const newProject: Project = {
            id: `proj-${Date.now()}`,
            name: "",
            description: "",
            technologies: [],
            link: ""
        }
        setContent(prev => ({
            ...prev,
            projects: [...(prev.projects || []), newProject]
        }))
    }

    const updateProject = (id: string, field: keyof Project, value: any) => {
        setContent(prev => ({
            ...prev,
            projects: prev.projects?.map(proj =>
                proj.id === id ? { ...proj, [field]: value } : proj
            )
        }))
    }

    const removeProject = (id: string) => {
        setContent(prev => ({
            ...prev,
            projects: prev.projects?.filter(proj => proj.id !== id)
        }))
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!resume) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p>Resume not found</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-screen bg-[#030712] text-white">
            <header className="h-16 border-b border-slate-900 flex items-center justify-between px-4 sm:px-6 bg-[#030712] shrink-0">
                <div className="flex items-center gap-2 sm:gap-4">
                    <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')} className="h-8 px-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl">
                        <ChevronLeft className="h-4 w-4 sm:mr-2" />
                        <span className="hidden sm:inline">Back</span>
                    </Button>
                    <Separator orientation="vertical" className="h-6 hidden sm:block bg-slate-900" />
                    <h1 className="text-sm sm:text-base font-bold truncate max-w-[100px] sm:max-w-xs text-white">{resume.title}</h1>
                    
                    <Separator orientation="vertical" className="h-6 hidden sm:block bg-slate-900" />
                    
                    {/* Live ATS Score Badge Pill */}
                    <button
                        onClick={() => setActiveTab("ats")}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all border ${
                            atsScore >= 80
                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                                : atsScore >= 60
                                ? 'bg-amber-500/10 border-amber-500/20 text-amber-500 hover:bg-amber-500/20'
                                : 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20 animate-pulse'
                        }`}
                        title="Click to open ATS optimization report"
                    >
                        <span className="relative flex h-2 w-2 shrink-0">
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                                atsScore >= 80 ? 'bg-emerald-400' : atsScore >= 60 ? 'bg-amber-400' : 'bg-red-400'
                            }`} />
                            <span className={`relative inline-flex rounded-full h-2 w-2 ${
                                atsScore >= 80 ? 'bg-emerald-500' : atsScore >= 60 ? 'bg-amber-500' : 'bg-red-500'
                            }`} />
                        </span>
                        <span>ATS: {atsScore}%</span>
                        {atsScore < 80 && (
                            <span className="hidden md:inline text-[9px] opacity-75 font-medium border-l border-current/25 pl-1.5">
                                Improve ⚠️
                            </span>
                        )}
                    </button>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setShowAIDialog(true)} className="h-8 px-2 sm:px-4 border-slate-800 bg-transparent text-slate-350 hover:bg-slate-900 hover:text-white rounded-xl">
                        <Sparkles className="h-4 w-4 sm:mr-2 text-indigo-400" />
                        <span className="hidden sm:inline">AI Generate</span>
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleDownload} disabled={isDownloading} className="h-8 px-2 sm:px-4 border-slate-800 bg-transparent text-slate-350 hover:bg-slate-900 hover:text-white rounded-xl">
                        {isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4 sm:mr-2" />}
                        <span className="hidden sm:inline">Download</span>
                    </Button>
                    <Button size="sm" onClick={handleSave} disabled={updateContent.isPending} className="h-8 px-2 sm:px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl">
                        {updateContent.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 sm:mr-2" />}
                        <span className="hidden sm:inline">Save</span>
                    </Button>
                </div>
            </header>

            <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
                <div className="w-full md:w-1/2 h-full overflow-y-auto p-4 md:p-6 md:border-r border-slate-900 bg-slate-950/20">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="h-auto">
                        <TabsList className="grid grid-cols-5 gap-1 bg-slate-950 border border-slate-900 p-1 mb-6 rounded-xl">
                            <TabsTrigger value="bio" className="text-xs sm:text-sm py-2 text-slate-400 data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-lg transition-all font-semibold">Bio</TabsTrigger>
                            <TabsTrigger value="jobs" className="text-xs sm:text-sm py-2 text-slate-400 data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-lg transition-all font-semibold">Jobs</TabsTrigger>
                            <TabsTrigger value="edu" className="text-xs sm:text-sm py-2 text-slate-400 data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-lg transition-all font-semibold">Edu</TabsTrigger>
                            <TabsTrigger value="projects" className="text-xs sm:text-sm py-2 text-slate-400 data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-lg transition-all font-semibold">Proj</TabsTrigger>
                            <TabsTrigger value="ats" className="text-xs sm:text-sm py-2 text-slate-400 data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-lg transition-all font-semibold flex items-center justify-center gap-1">
                                <Search className="w-3.5 h-3.5" />
                                ATS
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="bio" className="space-y-4 text-left">
                            <Card className="bg-slate-950/40 border-slate-900 shadow-xl rounded-2xl overflow-hidden">
                                <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b border-slate-900 bg-slate-900/10">
                                    <CardTitle className="text-base font-bold text-white">Personal Info</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 text-sm p-5">
                                    <div className="flex flex-col sm:flex-row gap-6 pb-5 border-b border-slate-900">
                                        <div className="flex-shrink-0 relative group">
                                            <div className="w-24 h-24 rounded-full bg-slate-900/60 flex items-center justify-center overflow-hidden border-2 border-dashed border-slate-800">
                                                {content.personalInfo?.profilePicture ? (
                                                    <img src={content.personalInfo.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                                                ) : (
                                                    <Upload className="w-8 h-8 text-slate-600" />
                                                )}
                                            </div>
                                            <Label htmlFor="photo-upload" className="absolute bottom-0 right-0 p-1.5 bg-indigo-600 text-white rounded-full cursor-pointer shadow-lg hover:bg-indigo-500 transition-colors">
                                                <Plus className="w-4 h-4" />
                                                <Input
                                                    id="photo-upload"
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0]
                                                        if (file) {
                                                            const reader = new FileReader()
                                                            reader.onloadend = () => {
                                                                updatePersonalInfo('profilePicture', reader.result as string)
                                                            }
                                                            reader.readAsDataURL(file)
                                                        }
                                                    }}
                                                />
                                            </Label>
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-extrabold text-white text-sm">Profile Picture</h4>
                                            </div>
                                            <p className="text-xs text-slate-400">
                                                Upload a professional photo to stand out. Max 2MB.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5"><Label className="text-xs font-semibold text-slate-400">Full Name</Label><Input value={content.personalInfo?.fullName || ""} onChange={(e) => updatePersonalInfo('fullName', e.target.value)} className="bg-slate-900/60 border-slate-850 text-white placeholder-slate-600 focus:border-indigo-500 focus:ring-indigo-500/50 rounded-xl h-10" /></div>
                                        <div className="space-y-1.5"><Label className="text-xs font-semibold text-slate-400">Email</Label><Input value={content.personalInfo?.email || ""} onChange={(e) => updatePersonalInfo('email', e.target.value)} className="bg-slate-900/60 border-slate-850 text-white placeholder-slate-600 focus:border-indigo-500 focus:ring-indigo-500/50 rounded-xl h-10" /></div>
                                        <div className="space-y-1.5"><Label className="text-xs font-semibold text-slate-400">Phone</Label><Input value={content.personalInfo?.phone || ""} onChange={(e) => updatePersonalInfo('phone', e.target.value)} className="bg-slate-900/60 border-slate-850 text-white placeholder-slate-600 focus:border-indigo-500 focus:ring-indigo-500/50 rounded-xl h-10" /></div>
                                        <div className="space-y-1.5"><Label className="text-xs font-semibold text-slate-400">Location</Label><Input value={content.personalInfo?.location || ""} onChange={(e) => updatePersonalInfo('location', e.target.value)} className="bg-slate-900/60 border-slate-850 text-white placeholder-slate-600 focus:border-indigo-500 focus:ring-indigo-500/50 rounded-xl h-10" /></div>
                                    </div>
                                    <div className="space-y-1.5 pt-4 border-t border-slate-900">
                                        <Label className="text-xs font-semibold text-slate-400">Professional Summary</Label>
                                        <Textarea value={content.summary || ""} onChange={(e) => setContent(prev => ({ ...prev, summary: e.target.value }))} className="min-h-[120px] bg-slate-900/60 border-slate-850 text-white placeholder-slate-600 focus:border-indigo-500 focus:ring-indigo-500/50 rounded-xl" />
                                    </div>
                                    <div className="space-y-1.5 pt-4 border-t border-slate-900">
                                        <Label className="text-xs font-semibold text-slate-400">Skills (Comma separated)</Label>
                                        <Input value={content.skills?.join(', ') || ""} onChange={(e) => setContent(prev => ({ ...prev, skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))} className="bg-slate-900/60 border-slate-850 text-white placeholder-slate-600 focus:border-indigo-500 focus:ring-indigo-500/50 rounded-xl h-10" />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="jobs" className="space-y-4 text-left">
                            <div className="flex justify-between items-center"><h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest">WORK HISTORY</h3><Button onClick={addExperience} size="sm" variant="outline" className="border-slate-800 bg-transparent text-slate-350 hover:bg-slate-900 hover:text-white rounded-xl h-8 px-3"><Plus className="h-3.5 w-3.5 mr-1" /> Add</Button></div>
                            {content.experience?.map((exp) => (
                                <Card key={exp.id} className="relative bg-slate-950/40 border-slate-900 shadow-lg rounded-2xl overflow-hidden">
                                    <CardContent className="pt-8 px-5 pb-5 space-y-4">
                                        <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7 text-slate-400 hover:text-red-400 hover:bg-slate-900 rounded-lg" onClick={() => removeExperience(exp.id)}><Trash2 className="h-4 w-4" /></Button>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-1.5"><Label className="text-xs font-semibold text-slate-400">Job Title</Label><Input value={exp.title} onChange={(e) => updateExperience(exp.id, "title", e.target.value)} className="bg-slate-900/60 border-slate-850 text-white focus:border-indigo-500 focus:ring-indigo-500/50 rounded-xl h-10" /></div>
                                            <div className="space-y-1.5"><Label className="text-xs font-semibold text-slate-400">Company</Label><Input value={exp.company} onChange={(e) => updateExperience(exp.id, "company", e.target.value)} className="bg-slate-900/60 border-slate-850 text-white focus:border-indigo-500 focus:ring-indigo-500/50 rounded-xl h-10" /></div>
                                            <div className="space-y-1.5"><Label className="text-xs font-semibold text-slate-400">Start Date</Label><Input value={exp.startDate} onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)} className="bg-slate-900/60 border-slate-850 text-white focus:border-indigo-500 focus:ring-indigo-500/50 rounded-xl h-10" /></div>
                                            <div className="space-y-1.5"><Label className="text-xs font-semibold text-slate-400">End Date</Label><Input value={exp.endDate} onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)} className="bg-slate-900/60 border-slate-850 text-white focus:border-indigo-500 focus:ring-indigo-500/50 rounded-xl h-10" /></div>
                                        </div>
                                        <div className="space-y-1.5"><Label className="text-xs font-semibold text-slate-400">Responsibilities (one per line)</Label><Textarea value={exp.description.join("\n")} onChange={(e) => updateExperience(exp.id, "description", e.target.value.split("\n"))} rows={4} className="bg-slate-900/60 border-slate-850 text-white focus:border-indigo-500 focus:ring-indigo-500/50 rounded-xl" /></div>
                                    </CardContent>
                                </Card>
                            ))}
                        </TabsContent>

                        <TabsContent value="edu" className="space-y-4 text-left">
                            <div className="flex justify-between items-center"><h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest">EDUCATION</h3><Button onClick={addEducation} size="sm" variant="outline" className="border-slate-800 bg-transparent text-slate-350 hover:bg-slate-900 hover:text-white rounded-xl h-8 px-3"><Plus className="h-3.5 w-3.5 mr-1" /> Add</Button></div>
                            {content.education?.map((edu) => (
                                <Card key={edu.id} className="relative bg-slate-950/40 border-slate-900 shadow-lg rounded-2xl overflow-hidden">
                                    <CardContent className="pt-8 px-5 pb-5 space-y-4">
                                        <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7 text-slate-400 hover:text-red-400 hover:bg-slate-900 rounded-lg" onClick={() => removeEducation(edu.id)}><Trash2 className="h-4 w-4" /></Button>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-1.5"><Label className="text-xs font-semibold text-slate-400">Degree</Label><Input value={edu.degree} onChange={(e) => updateEducation(edu.id, "degree", e.target.value)} className="bg-slate-900/60 border-slate-850 text-white focus:border-indigo-500 focus:ring-indigo-500/50 rounded-xl h-10" /></div>
                                            <div className="space-y-1.5"><Label className="text-xs font-semibold text-slate-400">Institution</Label><Input value={edu.institution} onChange={(e) => updateEducation(edu.id, "institution", e.target.value)} className="bg-slate-900/60 border-slate-850 text-white focus:border-indigo-500 focus:ring-indigo-500/50 rounded-xl h-10" /></div>
                                            <div className="space-y-1.5"><Label className="text-xs font-semibold text-slate-400">Start Date</Label><Input value={edu.startDate} onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)} className="bg-slate-900/60 border-slate-850 text-white focus:border-indigo-500 focus:ring-indigo-500/50 rounded-xl h-10" /></div>
                                            <div className="space-y-1.5"><Label className="text-xs font-semibold text-slate-400">End Date</Label><Input value={edu.endDate} onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)} className="bg-slate-900/60 border-slate-850 text-white focus:border-indigo-500 focus:ring-indigo-500/50 rounded-xl h-10" /></div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </TabsContent>

                        <TabsContent value="projects" className="space-y-4 text-left">
                            <div className="flex justify-between items-center"><h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest">PROJECTS</h3><Button onClick={addProject} size="sm" variant="outline" className="border-slate-800 bg-transparent text-slate-350 hover:bg-slate-900 hover:text-white rounded-xl h-8 px-3"><Plus className="h-3.5 w-3.5 mr-1" /> Add</Button></div>
                            {content.projects?.map((proj) => (
                                <Card key={proj.id} className="relative bg-slate-950/40 border-slate-900 shadow-lg rounded-2xl overflow-hidden">
                                    <CardContent className="pt-8 px-5 pb-5 space-y-4">
                                        <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7 text-slate-400 hover:text-red-400 hover:bg-slate-900 rounded-lg" onClick={() => removeProject(proj.id)}><Trash2 className="h-4 w-4" /></Button>
                                        <div className="space-y-1.5"><Label className="text-xs font-semibold text-slate-400">Project Name</Label><Input value={proj.name} onChange={(e) => updateProject(proj.id, "name", e.target.value)} className="bg-slate-900/60 border-slate-850 text-white focus:border-indigo-500 focus:ring-indigo-500/50 rounded-xl h-10" /></div>
                                        <div className="space-y-1.5"><Label className="text-xs font-semibold text-slate-400">Description</Label><Textarea value={proj.description} onChange={(e) => updateProject(proj.id, "description", e.target.value)} rows={3} className="bg-slate-900/60 border-slate-850 text-white focus:border-indigo-500 focus:ring-indigo-500/50 rounded-xl" /></div>
                                        <div className="space-y-1.5"><Label className="text-xs font-semibold text-slate-400">Tech Stack (Comma separated)</Label><Input value={proj.technologies?.join(', ') || ""} onChange={(e) => updateProject(proj.id, "technologies", e.target.value.split(',').map(s => s.trim()).filter(Boolean))} className="bg-slate-900/60 border-slate-850 text-white focus:border-indigo-500 focus:ring-indigo-500/50 rounded-xl h-10" /></div>
                                    </CardContent>
                                </Card>
                            ))}
                        </TabsContent>

                        <TabsContent value="ats" className="m-0 focus-visible:outline-none">
                            <ATSAnalyser content={content} onUpdateContent={setContent} />
                        </TabsContent>
                    </Tabs>
                </div>

                <div className="hidden md:flex w-1/2 bg-[#020617] overflow-auto flex-col items-center py-10 px-4 border-l border-slate-900">
                    <div className="sticky top-0 mb-4 bg-slate-950/80 backdrop-blur-sm px-4 py-1.5 rounded-full border border-slate-900 shadow-xl z-10 flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">A4 Live Preview</span>
                    </div>
                    <div className="w-full flex justify-center py-4">
                        <div className="w-[calc(210mm*0.72)] h-[calc(297mm*0.72)] overflow-hidden shadow-2xl bg-white rounded-lg relative">
                            <div className="w-[210mm] h-[297mm] origin-top-left" style={{ transform: 'scale(0.72)', transformOrigin: 'top left' }}>
                                <div ref={resumeRef} className="w-full text-black min-h-[297mm]">
                                    <ResumeTemplate content={content} templateId={resume?.template_id || 'modern-blue'} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Dialog open={showAIDialog} onOpenChange={setShowAIDialog}>
                <DialogContent className="bg-slate-950 border-slate-900 text-white">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl font-bold"><Sparkles className="h-5 w-5 text-indigo-400" /> AI Content Generator</DialogTitle>
                        <DialogDescription className="text-slate-450 text-sm">Generate tailored resume content using AI.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4 text-left">
                        <div className="space-y-2"><Label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Job Title</Label><Input value={aiParams.jobTitle} onChange={(e) => setAiParams(p => ({ ...p, jobTitle: e.target.value }))} placeholder="e.g. Frontend Engineer" className="bg-slate-900/60 border-slate-800 text-white placeholder-slate-600 focus:border-indigo-500 focus:ring-indigo-500/50 rounded-xl h-10" /></div>
                        <div className="space-y-2"><Label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Industry</Label><Input value={aiParams.industry} onChange={(e) => setAiParams(p => ({ ...p, industry: e.target.value }))} placeholder="e.g. Technology" className="bg-slate-900/60 border-slate-800 text-white placeholder-slate-600 focus:border-indigo-500 focus:ring-indigo-500/50 rounded-xl h-10" /></div>
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Experience Level</Label>
                            <Select value={aiParams.experienceLevel} onValueChange={(v) => setAiParams(p => ({ ...p, experienceLevel: v }))}>
                                <SelectTrigger className="bg-slate-900/60 border-slate-800 text-white focus:ring-indigo-500/50 focus:border-indigo-500 rounded-xl h-10"><SelectValue /></SelectTrigger>
                                <SelectContent className="bg-slate-950 border-slate-900 text-white">
                                    <SelectItem value="entry" className="hover:bg-slate-900 cursor-pointer">Entry</SelectItem>
                                    <SelectItem value="mid" className="hover:bg-slate-900 cursor-pointer">Mid</SelectItem>
                                    <SelectItem value="senior" className="hover:bg-slate-900 cursor-pointer">Senior</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowAIDialog(false)} className="border-slate-800 bg-transparent text-slate-400 hover:bg-slate-900 hover:text-white rounded-xl">Cancel</Button>
                        <Button onClick={handleAIGenerate} disabled={isGenerating} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl">{isGenerating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />} Generate</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showMobilePreview} onOpenChange={setShowMobilePreview}>
                <DialogContent className="max-w-[100vw] w-screen h-[100vh] p-0 border-none m-0 rounded-none overflow-hidden bg-[#030712]">
                    <div className="flex flex-col h-full bg-[#030712] text-white">
                        <div className="h-14 border-b border-slate-900 bg-[#030712] flex items-center justify-between px-4 shrink-0">
                            <span className="font-extrabold text-sm text-white">A4 PDF Preview</span>
                            <Button variant="ghost" size="sm" onClick={() => setShowMobilePreview(false)} className="text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg">Close</Button>
                        </div>
                        <div className="flex-1 overflow-auto p-4 bg-slate-950/40">
                            <div className="w-full flex justify-center">
                                {(() => {
                                    const mobileScale = (windowWidth - 32) / 794;
                                    return (
                                        <div 
                                            style={{ width: `${210 * mobileScale}mm`, height: `${297 * mobileScale}mm` }} 
                                            className="overflow-hidden bg-white text-black shadow-2xl rounded-lg relative"
                                        >
                                            <div 
                                                style={{ width: '210mm', height: '297mm', transform: `scale(${mobileScale})`, transformOrigin: 'top left' }}
                                                className="origin-top-left"
                                            >
                                                <ResumeTemplate content={content} templateId={resume?.template_id || 'modern-blue'} />
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                        <div className="h-20 border-t border-slate-900 bg-[#030712] flex items-center p-4">
                            <Button className="w-full gap-2 h-12 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20" onClick={handleDownload} disabled={isDownloading}>{isDownloading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Download className="h-5 w-5" />} Download PDF</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {windowWidth < 768 && !showMobilePreview && (
                <Button className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl z-50 p-0 bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30" onClick={() => setShowMobilePreview(true)}>
                    <Eye className="h-6 w-6" />
                </Button>
            )}
        </div>
    )
}
