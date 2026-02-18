import { useParams, useNavigate, Link } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Save, Download, Trash2, Plus, Sparkles, Eye, ChevronLeft, Search, Loader2, Upload, Crown } from 'lucide-react'
import { ATSAnalyser } from './components/ATSAnalyser'
import { useResume, useUpdateResumeContent } from "@/hooks/useResume"
import type { ResumeContent, PersonalInfo, Experience, Education, Project } from "@/types/resume"
import { aiService } from "@/services/ai"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ResumeTemplate } from "@/components/templates/ResumeTemplate"
import { useProfile } from "@/hooks/useProfile"
import { Badge } from "@/components/ui/badge"

export default function ResumeBuilderPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { data: resume, isLoading } = useResume(id!)
    const updateContent = useUpdateResumeContent()
    const { data: profile } = useProfile()

    const [content, setContent] = useState<ResumeContent>({})
    const [activeTab, setActiveTab] = useState("bio")
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
                    scale: 2,
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

            await html2pdf().set(opt).from(element).save()
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
        <div className="flex flex-col h-screen bg-background">
            <header className="h-16 border-b flex items-center justify-between px-4 sm:px-6 bg-background shrink-0">
                <div className="flex items-center gap-2 sm:gap-4">
                    <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')} className="h-8 px-2">
                        <ChevronLeft className="h-4 w-4 sm:mr-2" />
                        <span className="hidden sm:inline">Back</span>
                    </Button>
                    <Separator orientation="vertical" className="h-6 hidden sm:block" />
                    <h1 className="text-sm sm:text-lg font-semibold truncate max-w-[150px] sm:max-w-none">{resume.title}</h1>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setShowAIDialog(true)} className="h-8 px-2 sm:px-4">
                        <Sparkles className="h-4 w-4 sm:mr-2 text-primary" />
                        <span className="hidden sm:inline">AI Generate</span>
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleDownload} disabled={isDownloading} className="h-8 px-2 sm:px-4">
                        {isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4 sm:mr-2" />}
                        <span className="hidden sm:inline">Download</span>
                    </Button>
                    <Button size="sm" onClick={handleSave} disabled={updateContent.isPending} className="h-8 px-2 sm:px-4">
                        {updateContent.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 sm:mr-2" />}
                        <span className="hidden sm:inline">Save</span>
                    </Button>
                </div>
            </header>

            <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
                <div className="w-full md:w-1/2 h-full overflow-y-auto p-4 md:p-6 md:border-r bg-muted/5">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="h-auto">
                        <TabsList className="grid grid-cols-5 gap-1 bg-muted/50 p-1 mb-6">
                            <TabsTrigger value="bio" className="text-xs sm:text-sm py-2">Bio</TabsTrigger>
                            <TabsTrigger value="jobs" className="text-xs sm:text-sm py-2">Jobs</TabsTrigger>
                            <TabsTrigger value="edu" className="text-xs sm:text-sm py-2">Edu</TabsTrigger>
                            <TabsTrigger value="projects" className="text-xs sm:text-sm py-2">Proj</TabsTrigger>
                            <TabsTrigger value="ats" className="text-xs sm:text-sm py-2 flex items-center gap-1">
                                <Search className="w-3 h-3" />
                                ATS
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="bio" className="space-y-4">
                            <Card className="shadow-sm">
                                <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
                                    <CardTitle className="text-base">Personal Info</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 text-sm px-4 pb-4">
                                    <div className="flex flex-col sm:flex-row gap-6 pb-4 border-b">
                                        <div className="flex-shrink-0 relative group">
                                            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-dashed border-muted-foreground/20">
                                                {content.personalInfo?.profilePicture ? (
                                                    <img src={content.personalInfo.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                                                ) : (
                                                    <Upload className="w-8 h-8 text-muted-foreground/40" />
                                                )}
                                                {!profile?.is_pro && (
                                                    <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px] flex items-center justify-center cursor-not-allowed">
                                                        <Crown className="w-6 h-6 text-yellow-500" />
                                                    </div>
                                                )}
                                            </div>
                                            {profile?.is_pro && (
                                                <Label htmlFor="photo-upload" className="absolute bottom-0 right-0 p-1 bg-primary text-primary-foreground rounded-full cursor-pointer shadow-lg hover:bg-primary/90 transition-colors">
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
                                            )}
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-bold">Profile Picture</h4>
                                                {!profile?.is_pro && <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">Pro Feature</Badge>}
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                {profile?.is_pro ? "Upload a professional photo to stand out. Max 2MB." : "Upgrade to Pro to add a professional photo to your resume."}
                                            </p>
                                            {!profile?.is_pro && (
                                                <Link to="/auth/signup">
                                                    <Button variant="link" size="sm" className="p-0 h-auto text-xs text-blue-600">Upgrade to Pro</Button>
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5"><Label>Full Name</Label><Input value={content.personalInfo?.fullName || ""} onChange={(e) => updatePersonalInfo('fullName', e.target.value)} /></div>
                                        <div className="space-y-1.5"><Label>Email</Label><Input value={content.personalInfo?.email || ""} onChange={(e) => updatePersonalInfo('email', e.target.value)} /></div>
                                        <div className="space-y-1.5"><Label>Phone</Label><Input value={content.personalInfo?.phone || ""} onChange={(e) => updatePersonalInfo('phone', e.target.value)} /></div>
                                        <div className="space-y-1.5"><Label>Location</Label><Input value={content.personalInfo?.location || ""} onChange={(e) => updatePersonalInfo('location', e.target.value)} /></div>
                                    </div>
                                    <div className="space-y-1.5 pt-2 border-t">
                                        <Label>Professional Summary</Label>
                                        <Textarea value={content.summary || ""} onChange={(e) => setContent(prev => ({ ...prev, summary: e.target.value }))} className="min-h-[120px]" />
                                    </div>
                                    <div className="space-y-1.5 pt-2 border-t">
                                        <Label>Skills (Comma separated)</Label>
                                        <Input value={content.skills?.join(', ') || ""} onChange={(e) => setContent(prev => ({ ...prev, skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))} />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="jobs" className="space-y-4">
                            <div className="flex justify-between items-center"><h3 className="text-sm font-bold opacity-60">WORK HISTORY</h3><Button onClick={addExperience} size="sm" variant="outline"><Plus className="h-3 w-3 mr-1" /> Add</Button></div>
                            {content.experience?.map((exp) => (
                                <Card key={exp.id} className="relative">
                                    <CardContent className="pt-8 px-4 pb-4 space-y-4">
                                        <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => removeExperience(exp.id)}><Trash2 className="h-4 w-4" /></Button>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-1.5"><Label>Job Title</Label><Input value={exp.title} onChange={(e) => updateExperience(exp.id, "title", e.target.value)} /></div>
                                            <div className="space-y-1.5"><Label>Company</Label><Input value={exp.company} onChange={(e) => updateExperience(exp.id, "company", e.target.value)} /></div>
                                            <div className="space-y-1.5"><Label>Start Date</Label><Input value={exp.startDate} onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)} /></div>
                                            <div className="space-y-1.5"><Label>End Date</Label><Input value={exp.endDate} onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)} /></div>
                                        </div>
                                        <div className="space-y-1.5"><Label>Responsibilities (one per line)</Label><Textarea value={exp.description.join("\n")} onChange={(e) => updateExperience(exp.id, "description", e.target.value.split("\n"))} /></div>
                                    </CardContent>
                                </Card>
                            ))}
                        </TabsContent>

                        <TabsContent value="edu" className="space-y-4">
                            <div className="flex justify-between items-center"><h3 className="text-sm font-bold opacity-60">EDUCATION</h3><Button onClick={addEducation} size="sm" variant="outline"><Plus className="h-3 w-3 mr-1" /> Add</Button></div>
                            {content.education?.map((edu) => (
                                <Card key={edu.id} className="relative">
                                    <CardContent className="pt-8 px-4 pb-4 space-y-4">
                                        <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => removeEducation(edu.id)}><Trash2 className="h-4 w-4" /></Button>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-1.5"><Label>Degree</Label><Input value={edu.degree} onChange={(e) => updateEducation(edu.id, "degree", e.target.value)} /></div>
                                            <div className="space-y-1.5"><Label>Institution</Label><Input value={edu.institution} onChange={(e) => updateEducation(edu.id, "institution", e.target.value)} /></div>
                                            <div className="space-y-1.5"><Label>Start Date</Label><Input value={edu.startDate} onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)} /></div>
                                            <div className="space-y-1.5"><Label>End Date</Label><Input value={edu.endDate} onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)} /></div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </TabsContent>

                        <TabsContent value="projects" className="space-y-4">
                            <div className="flex justify-between items-center"><h3 className="text-sm font-bold opacity-60">PROJECTS</h3><Button onClick={addProject} size="sm" variant="outline"><Plus className="h-3 w-3 mr-1" /> Add</Button></div>
                            {content.projects?.map((proj) => (
                                <Card key={proj.id} className="relative">
                                    <CardContent className="pt-8 px-4 pb-4 space-y-4">
                                        <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => removeProject(proj.id)}><Trash2 className="h-4 w-4" /></Button>
                                        <div className="space-y-1.5"><Label>Project Name</Label><Input value={proj.name} onChange={(e) => updateProject(proj.id, "name", e.target.value)} /></div>
                                        <div className="space-y-1.5"><Label>Description</Label><Textarea value={proj.description} onChange={(e) => updateProject(proj.id, "description", e.target.value)} /></div>
                                        <div className="space-y-1.5"><Label>Tech Stack (Comma separated)</Label><Input value={proj.technologies?.join(', ') || ""} onChange={(e) => updateProject(proj.id, "technologies", e.target.value.split(',').map(s => s.trim()).filter(Boolean))} /></div>
                                    </CardContent>
                                </Card>
                            ))}
                        </TabsContent>

                        <TabsContent value="ats" className="m-0 focus-visible:outline-none">
                            <ATSAnalyser content={content} />
                        </TabsContent>
                    </Tabs>
                </div>

                <div className="hidden md:flex w-1/2 bg-muted/20 overflow-auto flex-col items-center py-10 px-4">
                    <div className="sticky top-0 mb-4 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full border shadow-sm z-10 flex items-center gap-2">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">A4 Preview</span>
                    </div>
                    <div className="w-full flex justify-center py-4">
                        <div className="w-[210mm] shadow-2xl bg-white origin-top" style={{ transform: 'scale(0.75)', transformOrigin: 'top center' }}>
                            <div ref={resumeRef} className="w-full">
                                <ResumeTemplate content={content} templateId={resume?.template_id || 'modern-blue'} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Dialog open={showAIDialog} onOpenChange={setShowAIDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" /> AI Content Generator</DialogTitle>
                        <DialogDescription>Generate tailored resume content using AI.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2"><Label>Job Title</Label><Input value={aiParams.jobTitle} onChange={(e) => setAiParams(p => ({ ...p, jobTitle: e.target.value }))} placeholder="e.g. Frontend Engineer" /></div>
                        <div className="space-y-2"><Label>Industry</Label><Input value={aiParams.industry} onChange={(e) => setAiParams(p => ({ ...p, industry: e.target.value }))} placeholder="e.g. Technology" /></div>
                        <div className="space-y-2">
                            <Label>Experience Level</Label>
                            <Select value={aiParams.experienceLevel} onValueChange={(v) => setAiParams(p => ({ ...p, experienceLevel: v }))}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent><SelectItem value="entry">Entry</SelectItem><SelectItem value="mid">Mid</SelectItem><SelectItem value="senior">Senior</SelectItem></SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowAIDialog(false)}>Cancel</Button>
                        <Button onClick={handleAIGenerate} disabled={isGenerating}>{isGenerating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />} Generate</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showMobilePreview} onOpenChange={setShowMobilePreview}>
                <DialogContent className="max-w-[100vw] w-screen h-[100vh] p-0 border-none m-0 rounded-none overflow-hidden">
                    <div className="flex flex-col h-full bg-muted/10">
                        <div className="h-14 border-b bg-background flex items-center justify-between px-4 shrink-0">
                            <span className="font-bold">Preview</span>
                            <Button variant="ghost" size="sm" onClick={() => setShowMobilePreview(false)}>Close</Button>
                        </div>
                        <div className="flex-1 overflow-auto p-4">
                            <div className="w-full flex justify-center">
                                <div className="bg-white shadow-2xl origin-top" style={{ width: '210mm', transform: `scale(${(windowWidth - 32) / 794})`, transformOrigin: 'top center' }}>
                                    <ResumeTemplate content={content} templateId={resume?.template_id || 'modern-blue'} />
                                </div>
                            </div>
                        </div>
                        <div className="h-20 border-t bg-background flex items-center p-4">
                            <Button className="w-full gap-2 h-12" onClick={handleDownload} disabled={isDownloading}>{isDownloading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Download className="h-5 w-5" />} Download PDF</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {windowWidth < 768 && !showMobilePreview && (
                <Button className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl z-50 p-0" onClick={() => setShowMobilePreview(true)}>
                    <Eye className="h-6 w-6" />
                </Button>
            )}
        </div>
    )
}
