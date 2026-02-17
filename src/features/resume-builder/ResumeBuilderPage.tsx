import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
    ArrowLeft,
    Save,
    Download,
    Sparkles,
    Plus,
    Trash2,
    Loader2,
    Eye,
    Maximize2
} from "lucide-react"
import { useResume, useUpdateResumeContent } from "@/hooks/useResume"
import type { ResumeContent, PersonalInfo, Experience, Education } from "@/types/resume"
import { aiService } from "@/services/ai"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ResumeTemplate } from "@/components/templates/ResumeTemplate"

export default function ResumeBuilderPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { data: resume, isLoading } = useResume(id!)
    const updateContent = useUpdateResumeContent()

    const [content, setContent] = useState<ResumeContent>({})
    const [activeTab, setActiveTab] = useState("personal")
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
        } catch (error) {
            console.error('Failed to save:', error)
        }
    }

    const handleDownload = async () => {
        setIsDownloading(true)
        try {
            const element = resumeRef.current
            if (!element) return

            const html2pdf = (await import('html2pdf.js')).default

            // Optimized PDF configuration based on production requirements
            const opt = {
                margin: 0,
                filename: `${resume?.title || 'resume'}.pdf`,
                image: { type: 'jpeg' as const, quality: 1 },
                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    logging: false,
                    letterRendering: true,
                    windowWidth: 794, // 210mm at 96 DPI
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
            setActiveTab("summary")
        } catch (error) {
            console.error('AI generation failed:', error)
            toast.error('Failed to generate content. Please check your API configuration.')
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
            {/* Header */}
            <header className="h-16 border-b flex items-center justify-between px-4 sm:px-6 bg-background shrink-0">
                <div className="flex items-center gap-2 sm:gap-4">
                    <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')} className="h-8 px-2">
                        <ArrowLeft className="h-4 w-4 sm:mr-2" />
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
                        {isDownloading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Download className="h-4 w-4 sm:mr-2" />
                        )}
                        <span className="hidden sm:inline">Download PDF</span>
                    </Button>
                    <Button size="sm" onClick={handleSave} disabled={updateContent.isPending} className="h-8 px-2 sm:px-4">
                        {updateContent.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="h-4 w-4 sm:mr-2" />
                        )}
                        <span className="hidden sm:inline">Save</span>
                    </Button>
                </div>
            </header>

            <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
                {/* Editor Panel - Full height on mobile, split on desktop */}
                <div className="w-full md:w-1/2 h-full overflow-y-auto p-4 md:p-6 md:border-r bg-muted/5">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="h-auto">
                        <TabsList className="grid w-full grid-cols-4 sm:grid-cols-4 h-9 p-1">
                            <TabsTrigger value="personal" className="text-[10px] sm:text-xs">BIO</TabsTrigger>
                            <TabsTrigger value="experience" className="text-[10px] sm:text-xs">JOBS</TabsTrigger>
                            <TabsTrigger value="education" className="text-[10px] sm:text-xs">EDU</TabsTrigger>
                            <TabsTrigger value="projects" className="text-[10px] sm:text-xs">PROJ</TabsTrigger>
                        </TabsList>

                        <TabsContent value="personal" className="space-y-4 mt-4">
                            <Card className="shadow-sm border-none sm:border">
                                <CardHeader className="py-3 px-4">
                                    <CardTitle className="text-base">Personal Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 text-sm px-4 pb-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label className="text-xs">Full Name</Label>
                                            <Input
                                                value={content.personalInfo?.fullName || ""}
                                                onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                                                placeholder="John Doe"
                                                className="h-9 text-sm"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs">Email</Label>
                                            <Input
                                                value={content.personalInfo?.email || ""}
                                                onChange={(e) => updatePersonalInfo('email', e.target.value)}
                                                placeholder="john@example.com"
                                                className="h-9 text-sm"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs">Phone</Label>
                                            <Input
                                                value={content.personalInfo?.phone || ""}
                                                onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                                                placeholder="+1 234 567 890"
                                                className="h-9 text-sm"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs">Location</Label>
                                            <Input
                                                value={content.personalInfo?.location || ""}
                                                onChange={(e) => updatePersonalInfo('location', e.target.value)}
                                                placeholder="City, Country"
                                                className="h-9 text-sm"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5 pt-2 border-t">
                                        <Label className="text-xs font-semibold">Professional Summary</Label>
                                        <Textarea
                                            value={content.summary || ""}
                                            onChange={(e) => setContent(prev => ({ ...prev, summary: e.target.value }))}
                                            placeholder="Write a brief professional summary..."
                                            className="min-h-[120px] text-sm resize-none leading-relaxed"
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="experience" className="space-y-4 mt-4">
                            <div className="flex justify-between items-center px-1">
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Work History</h3>
                                <Button onClick={addExperience} size="sm" variant="outline" className="h-8 gap-1 text-xs">
                                    <Plus className="h-3 w-3" /> Add New
                                </Button>
                            </div>
                            <div className="space-y-4 pb-10">
                                {content.experience?.map((exp) => (
                                    <Card key={exp.id} className="shadow-sm relative group">
                                        <CardContent className="pt-6 pb-4 space-y-4 px-4">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="absolute top-2 right-2 h-7 w-7 text-muted-foreground hover:text-destructive transition-colors"
                                                onClick={() => removeExperience(exp.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="space-y-1.5">
                                                    <Label className="text-xs">Role / Job Title</Label>
                                                    <Input
                                                        value={exp.title}
                                                        onChange={(e) => updateExperience(exp.id, "title", e.target.value)}
                                                        placeholder="Software Engineer"
                                                        className="h-8 text-sm"
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <Label className="text-xs">Company Name</Label>
                                                    <Input
                                                        value={exp.company}
                                                        onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                                                        placeholder="Google Inc."
                                                        className="h-8 text-sm"
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <Label className="text-xs">Start Date</Label>
                                                    <Input
                                                        value={exp.startDate}
                                                        onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                                                        placeholder="Jan 2020"
                                                        className="h-8 text-sm"
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <Label className="text-xs">End Date</Label>
                                                    <Input
                                                        value={exp.endDate}
                                                        onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                                                        placeholder="Present"
                                                        className="h-8 text-sm"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label className="text-xs">Responsibilities (one per line)</Label>
                                                <Textarea
                                                    value={exp.description.join("\n")}
                                                    onChange={(e) => updateExperience(exp.id, "description", e.target.value.split("\n"))}
                                                    placeholder="• List your key achievements..."
                                                    className="min-h-[100px] text-sm resize-none"
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="education" className="space-y-4 mt-4">
                            <div className="flex justify-between items-center px-1">
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Education</h3>
                                <Button onClick={addEducation} size="sm" variant="outline" className="h-8 gap-1 text-xs">
                                    <Plus className="h-3 w-3" /> Add New
                                </Button>
                            </div>
                            <div className="space-y-4">
                                {content.education?.map((edu) => (
                                    <Card key={edu.id} className="shadow-sm relative">
                                        <CardContent className="pt-6 pb-4 space-y-4 px-4">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="absolute top-2 right-2 h-7 w-7 text-muted-foreground hover:text-destructive"
                                                onClick={() => removeEducation(edu.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="space-y-1.5">
                                                    <Label className="text-xs">Degree / Field of Study</Label>
                                                    <Input
                                                        value={edu.degree}
                                                        onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                                                        placeholder="B.S. Computer Science"
                                                        className="h-8 text-sm"
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <Label className="text-xs">University / School</Label>
                                                    <Input
                                                        value={edu.institution}
                                                        onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                                                        placeholder="MIT"
                                                        className="h-8 text-sm"
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <Label className="text-xs">Start Date</Label>
                                                    <Input
                                                        value={edu.startDate}
                                                        onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)}
                                                        placeholder="Sep 2015"
                                                        className="h-8 text-sm"
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <Label className="text-xs">End Date</Label>
                                                    <Input
                                                        value={edu.endDate}
                                                        onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)}
                                                        placeholder="Jun 2019"
                                                        className="h-8 text-sm"
                                                    />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="projects" className="space-y-4 mt-4">
                            <Card className="shadow-sm border-dashed text-center p-8 bg-muted/20">
                                <Sparkles className="h-10 w-10 mx-auto mb-4 text-primary/40" />
                                <CardTitle className="text-base mb-2">Projects & More</CardTitle>
                                <p className="text-xs text-muted-foreground max-w-[240px] mx-auto">
                                    We're adding new sections very soon!
                                    Use the AI Generate button to automatically pre-fill your summary and skills.
                                </p>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Preview Panel - Hidden on Mobile, Right on Desktop */}
                <div className="hidden md:flex w-full md:w-1/2 bg-muted/20 overflow-auto flex-col items-center py-4 md:py-10 px-4">
                    <div className="sticky top-0 mb-4 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full border shadow-sm z-10 flex items-center gap-2">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">A4 Preview</span>
                    </div>

                    {/* Responsive Container for Scaling */}
                    <div className="w-full flex justify-center preview-container min-h-[600px] py-4 md:cursor-default group relative">
                        <div
                            className="w-[210mm] shadow-[0_20px_50px_rgba(0,0,0,0.15)] bg-white origin-top transition-all duration-300 group-hover:shadow-[0_30px_60px_rgba(0,0,0,0.2)]"
                            style={{
                                transform: 'scale(0.75)',
                                transformOrigin: 'top center'
                            }}
                        >
                            <div ref={resumeRef} className="w-full bg-white">
                                <ResumeTemplate
                                    content={content}
                                    templateId={resume?.template_id || 'modern-blue'}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="h-64 md:h-20 shrink-0" /> {/* Extra spacer for mobile scroll room */}
                </div>
            </div>

            {/* AI Generate Dialog */}
            <Dialog open={showAIDialog} onOpenChange={setShowAIDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-primary" />
                            AI Content Generator
                        </DialogTitle>
                        <DialogDescription>
                            Enter your job title to generate a professional summary and tailored skills.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Target Job Title</Label>
                            <Input
                                value={aiParams.jobTitle}
                                onChange={(e) => setAiParams(prev => ({ ...prev, jobTitle: e.target.value }))}
                                placeholder="e.g., Senior Frontend Developer"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Industry</Label>
                            <Input
                                value={aiParams.industry}
                                onChange={(e) => setAiParams(prev => ({ ...prev, industry: e.target.value }))}
                                placeholder="e.g., Software Technology"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Experience Level</Label>
                            <Select
                                value={aiParams.experienceLevel}
                                onValueChange={(value) => setAiParams(prev => ({ ...prev, experienceLevel: value }))}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="entry">Entry Level</SelectItem>
                                    <SelectItem value="mid">Mid Level</SelectItem>
                                    <SelectItem value="senior">Senior Level</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowAIDialog(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAIGenerate}
                            disabled={!aiParams.jobTitle || !aiParams.industry || isGenerating}
                            className="gap-2"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="h-4 w-4" />
                                    Generate
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Mobile Fullscreen Preview */}
            <Dialog open={showMobilePreview} onOpenChange={setShowMobilePreview}>
                <DialogContent className="max-w-[100vw] w-screen h-[100vh] p-0 border-none m-0 rounded-none bg-muted/10 flex flex-col overflow-hidden">
                    <DialogHeader className="sr-only">
                        <DialogTitle>Resume Preview</DialogTitle>
                        <DialogDescription>Full screen preview of your resume</DialogDescription>
                    </DialogHeader>

                    <div className="flex-1 flex flex-col h-full overflow-hidden">
                        <div className="h-14 border-b bg-background flex items-center justify-between px-4 shrink-0 z-10">
                            <span className="font-bold">Resume Preview</span>
                            <Button variant="ghost" size="sm" onClick={() => setShowMobilePreview(false)}>
                                Close
                            </Button>
                        </div>
                        <div className="flex-1 overflow-auto p-4 bg-muted/30">
                            <div className="w-full flex justify-center">
                                <div
                                    className="bg-white shadow-2xl origin-top transition-transform duration-300 mb-20"
                                    style={{
                                        width: '210mm',
                                        transform: `scale(${(windowWidth - 32) / 794})`,
                                        transformOrigin: 'top center'
                                    }}
                                >
                                    <ResumeTemplate
                                        content={content}
                                        templateId={resume?.template_id || 'modern-blue'}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="h-20 border-t bg-background flex items-center justify-center p-4 shrink-0 z-10">
                            <Button className="w-full gap-2 h-12 text-base font-semibold" onClick={handleDownload} disabled={isDownloading}>
                                {isDownloading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Download className="h-5 w-5" />}
                                Download PDF
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Mobile Fixed Preview Button */}
            {windowWidth < 768 && !showMobilePreview && (
                <Button
                    className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl z-50 p-0"
                    onClick={() => setShowMobilePreview(true)}
                >
                    <Eye className="h-6 w-6" />
                </Button>
            )}
        </div>
    )
}
