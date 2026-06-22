import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { TemplateSelector } from '@/components/TemplateSelector'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCreateResume, useUpdateResumeContent, useResumes } from '@/hooks/useResume'
import { useProfile } from '@/hooks/useProfile'
import { ArrowLeft, ArrowRight, Sparkles, GraduationCap, Briefcase, Crown, ExternalLink } from 'lucide-react'
import { aiService } from '@/services/ai'
import type { ResumeContent } from '@/types/resume'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from 'sonner'

export function CreateResumePage() {
    const navigate = useNavigate()
    const createResume = useCreateResume()
    const updateContent = useUpdateResumeContent()

    const { data: resumes } = useResumes()
    const { data: profile } = useProfile()
    const isPro = profile?.is_pro || false

    const [step, setStep] = useState(1)
    const [showUpgradeDialog, setShowUpgradeDialog] = useState(false)
    const [selectedTemplate, setSelectedTemplate] = useState<string>('')
    const [isGenerating, setIsGenerating] = useState(false)
    const [isStudent, setIsStudent] = useState(false)
    const [tailorForCompany, setTailorForCompany] = useState(false)
    const [targetCompany, setTargetCompany] = useState('')
    const [targetJobTitle, setTargetJobTitle] = useState('')
    const [targetJobDescription, setTargetJobDescription] = useState('')

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        location: '',
        linkedin: '',
        portfolio: '',
        github: '',

        // Education
        degree: '',
        institution: '',
        educationLocation: '',
        graduationYear: '',
        gpa: '',
        major: '',

        // Professional
        jobTitle: '',
        industry: '',
        experienceLevel: 'entry' as 'entry' | 'mid' | 'senior',

        // Internships
        internship1Title: '',
        internship1Company: '',
        internship1Duration: '',
        internship1Description: '',
        internship2Title: '',
        internship2Company: '',
        internship2Duration: '',
        internship2Description: '',

        // Projects
        project1Name: '',
        project1Description: '',
        project1Technologies: '',
        project2Name: '',
        project2Description: '',
        project2Technologies: '',

        summary: '',
        skills: '',
    })

    const handleNext = () => {
        if (step === 1 && !selectedTemplate) {
            toast.error('Please select a template')
            return
        }
        if (step < 3) setStep(step + 1)
    }

    const handleBack = () => {
        if (step > 1) setStep(step - 1)
    }

    const handleCreateResume = async () => {
        if (!formData.fullName || !formData.email) {
            toast.error('Please fill in your name and email')
            return
        }

        if (!isStudent && (!formData.jobTitle || !formData.industry)) {
            toast.error('Please fill in job title and industry')
            return
        }

        if (tailorForCompany && (!targetCompany.trim() || !targetJobTitle.trim())) {
            toast.error('Please enter the target company name and job title')
            return
        }

        if (!isPro && resumes && resumes.length >= 1) {
            setShowUpgradeDialog(true)
            return
        }

        setIsGenerating(true)

        try {
            let content: ResumeContent

            if (isStudent) {
                const educationEntry = formData.degree ? [{
                    id: 'edu-1',
                    degree: formData.degree,
                    institution: formData.institution || '',
                    location: formData.educationLocation || '',
                    startDate: formData.graduationYear ? (parseInt(formData.graduationYear) - 4).toString() : '',
                    endDate: formData.graduationYear || '',
                    gpa: formData.gpa || ''
                }] : []

                content = {
                    personalInfo: {
                        fullName: formData.fullName,
                        email: formData.email,
                        phone: formData.phone,
                        location: formData.location,
                        linkedin: formData.linkedin,
                        portfolio: formData.portfolio
                    },
                    summary: formData.summary || '',
                    skills: formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
                    education: educationEntry,
                    experience: [],
                    projects: [],
                    certifications: []
                }

                if (formData.internship1Title) {
                    content.experience = content.experience || []
                    content.experience.push({
                        id: 'int-1',
                        title: formData.internship1Title,
                        company: formData.internship1Company || '',
                        location: '',
                        startDate: formData.internship1Duration ? (formData.internship1Duration.split('-')[0]?.trim() || '') : '',
                        endDate: formData.internship1Duration ? (formData.internship1Duration.split('-')[1]?.trim() || '') : '',
                        current: false,
                        description: formData.internship1Description ?
                            formData.internship1Description.split('\n').map(d => d.trim()).filter(Boolean) : []
                    })
                }

                if (formData.internship2Title) {
                    content.experience = content.experience || []
                    content.experience.push({
                        id: 'int-2',
                        title: formData.internship2Title,
                        company: formData.internship2Company || '',
                        location: '',
                        startDate: formData.internship2Duration ? (formData.internship2Duration.split('-')[0]?.trim() || '') : '',
                        endDate: formData.internship2Duration ? (formData.internship2Duration.split('-')[1]?.trim() || '') : '',
                        current: false,
                        description: formData.internship2Description ?
                            formData.internship2Description.split('\n').map(d => d.trim()).filter(Boolean) : []
                    })
                }

                if (formData.project1Name) {
                    content.projects = content.projects || []
                    content.projects.push({
                        id: 'proj-1',
                        name: formData.project1Name,
                        description: formData.project1Description || '',
                        technologies: formData.project1Technologies ? formData.project1Technologies.split(',').map(t => t.trim()).filter(Boolean) : [],
                        link: ''
                    })
                }

                if (formData.project2Name) {
                    content.projects = content.projects || []
                    content.projects.push({
                        id: 'proj-2',
                        name: formData.project2Name,
                        description: formData.project2Description || '',
                        technologies: formData.project2Technologies ? formData.project2Technologies.split(',').map(t => t.trim()).filter(Boolean) : [],
                        link: ''
                    })
                }

            } else {
                const educationEntry = formData.degree ? [{
                    id: 'edu-1',
                    degree: formData.degree,
                    institution: formData.institution || '',
                    location: formData.educationLocation || '',
                    startDate: formData.graduationYear ? (parseInt(formData.graduationYear) - 4).toString() : '',
                    endDate: formData.graduationYear || '',
                    gpa: formData.gpa || ''
                }] : []

                content = {
                    personalInfo: {
                        fullName: formData.fullName,
                        email: formData.email,
                        phone: formData.phone,
                        location: formData.location,
                        linkedin: formData.linkedin,
                        portfolio: formData.portfolio
                    },
                    summary: formData.summary || '',
                    skills: formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
                    experience: [
                        {
                            id: 'exp-1',
                            title: formData.jobTitle,
                            company: 'Previous Company',
                            location: formData.location,
                            startDate: '2022',
                            endDate: 'Present',
                            current: true,
                            description: [
                                `Responsible for core deliverables in ${formData.industry} operations.`,
                                `Collaborated with cross-functional project teams to achieve product targets.`
                            ]
                        }
                    ],
                    education: educationEntry,
                    projects: [],
                    certifications: []
                }
            }

            // Apply target company AI tailoring if requested
            if (tailorForCompany) {
                const optimizedContent = await aiService.optimizeForCompany({
                    companyName: targetCompany,
                    jobTitle: targetJobTitle,
                    jobDescription: targetJobDescription || `Seeking a role as a ${targetJobTitle} at ${targetCompany}`,
                    currentContent: content
                })
                content = optimizedContent
            }

            const newResume = await createResume.mutateAsync({
                title: `${formData.fullName} - ${isStudent ? formData.degree : (tailorForCompany ? targetJobTitle : formData.jobTitle)} (${tailorForCompany ? targetCompany : 'General'})`,
                templateId: selectedTemplate
            })

            await updateContent.mutateAsync({
                id: newResume.id,
                content: content
            })

            navigate(`/builder/${newResume.id}`)
        } catch (error) {
            console.error('Error creating resume:', error)
            toast.error('Failed to create resume. Please try again.')
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#030712] text-white py-12 px-4 relative overflow-hidden">
            {/* Background glowing effects */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-1/3 right-10 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[100px] -z-10" />

            <div className="max-w-5xl mx-auto">
                {/* Progress Steps */}
                <div className="mb-10 max-w-md mx-auto">
                    <div className="flex items-center justify-between relative px-2">
                        {/* Horizontal Line Background */}
                        <div className="absolute top-4 sm:top-5 left-8 right-8 h-[2px] bg-slate-800 -z-10" />
                        {/* Active Line Fill */}
                        <div 
                            className="absolute top-4 sm:top-5 left-8 h-[2px] bg-indigo-600 transition-all duration-500 -z-10" 
                            style={{ width: `${(step - 1) * 44}%` }} 
                        />

                        {[1, 2, 3].map((s) => (
                            <div key={s} className="flex flex-col items-center gap-2">
                                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 border ${
                                    step >= s 
                                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]' 
                                        : 'bg-slate-950 border-slate-800 text-slate-500'
                                }`}>
                                    {s}
                                </div>
                                <span className={`text-[10px] sm:text-xs tracking-wider uppercase font-bold ${
                                    step >= s ? 'text-white' : 'text-slate-500'
                                }`}>
                                    {s === 1 ? 'Template' : s === 2 ? 'Information' : 'Review'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <Card className="bg-slate-950/40 border-slate-900 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 blur-xl pointer-events-none" />

                    {/* Step 1: Template Selection */}
                    {step === 1 && (
                        <TemplateSelector
                            selectedTemplateId={selectedTemplate}
                            onSelect={(templateId) => {
                                setSelectedTemplate(templateId)
                                setStep(2)
                            }}
                        />
                    )}

                    {/* Step 2: Information Form */}
                    {step === 2 && (
                        <div className="space-y-8 text-left">
                            <div className="text-center space-y-2 mb-6">
                                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">Your Information</h2>
                                <p className="text-slate-400 text-xs sm:text-sm">Fill in your details to create your professional resume</p>
                            </div>

                            {/* Student/Professional Toggle */}
                            <div className="flex justify-center gap-4 mb-6">
                                <Button
                                    type="button"
                                    variant={!isStudent ? 'default' : 'outline'}
                                    onClick={() => setIsStudent(false)}
                                    className={`gap-2 font-bold px-6 h-11 rounded-xl transition-all ${
                                        !isStudent 
                                            ? 'bg-indigo-600 hover:bg-indigo-500 text-white' 
                                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                                    }`}
                                >
                                    <Briefcase className="w-4 h-4" />
                                    Professional
                                </Button>
                                <Button
                                    type="button"
                                    variant={isStudent ? 'default' : 'outline'}
                                    onClick={() => setIsStudent(true)}
                                    className={`gap-2 font-bold px-6 h-11 rounded-xl transition-all ${
                                        isStudent 
                                            ? 'bg-indigo-600 hover:bg-indigo-500 text-white' 
                                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                                    }`}
                                >
                                    <GraduationCap className="w-4 h-4" />
                                    Student
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Personal Information */}
                                <div className="space-y-4">
                                    <h3 className="font-extrabold text-lg text-white pb-2 border-b border-slate-900 flex items-center gap-2">
                                        <Sparkles className="w-5 h-5 text-indigo-400" />
                                        Personal Details
                                    </h3>

                                    <div className="space-y-1">
                                        <Label htmlFor="fullName" className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name *</Label>
                                        <Input id="fullName" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} placeholder="John Doe" className="bg-slate-900/60 border-slate-800 text-white placeholder-slate-650 focus:border-indigo-500 focus:ring-indigo-500/50 rounded-xl h-11" />
                                    </div>

                                    <div className="space-y-1">
                                        <Label htmlFor="email" className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email *</Label>
                                        <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="john@example.com" className="bg-slate-900/60 border-slate-800 text-white placeholder-slate-650 focus:border-indigo-500 focus:ring-indigo-500/50 rounded-xl h-11" />
                                    </div>

                                    <div className="space-y-1">
                                        <Label htmlFor="phone" className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phone</Label>
                                        <Input id="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+1 (555) 123-4567" className="bg-slate-900/60 border-slate-800 text-white placeholder-slate-650 focus:border-indigo-500 focus:ring-indigo-500/50 rounded-xl h-11" />
                                    </div>

                                    <div className="space-y-1">
                                        <Label htmlFor="location" className="text-xs font-bold text-slate-400 uppercase tracking-wider">Location</Label>
                                        <Input id="location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="New York, NY" className="bg-slate-900/60 border-slate-800 text-white placeholder-slate-650 focus:border-indigo-500 focus:ring-indigo-500/50 rounded-xl h-11" />
                                    </div>

                                    <div className="space-y-1">
                                        <Label htmlFor="linkedin" className="text-xs font-bold text-slate-400 uppercase tracking-wider">LinkedIn</Label>
                                        <Input id="linkedin" value={formData.linkedin} onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })} placeholder="linkedin.com/in/johndoe" className="bg-slate-900/60 border-slate-800 text-white placeholder-slate-650 focus:border-indigo-500 focus:ring-indigo-500/50 rounded-xl h-11" />
                                    </div>

                                    <div className="space-y-1">
                                        <Label htmlFor="portfolio" className="text-xs font-bold text-slate-400 uppercase tracking-wider">Portfolio/Website</Label>
                                        <Input id="portfolio" value={formData.portfolio} onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })} placeholder="johndoe.com" className="bg-slate-900/60 border-slate-800 text-white placeholder-slate-650 focus:border-indigo-500 focus:ring-indigo-500/50 rounded-xl h-11" />
                                    </div>

                                    {isStudent && (
                                        <div className="space-y-1">
                                            <Label htmlFor="github" className="text-xs font-bold text-slate-400 uppercase tracking-wider">GitHub</Label>
                                            <Input id="github" value={formData.github} onChange={(e) => setFormData({ ...formData, github: e.target.value })} placeholder="github.com/johndoe" className="bg-slate-900/60 border-slate-800 text-white placeholder-slate-650 focus:border-indigo-500 focus:ring-indigo-500/50 rounded-xl h-11" />
                                        </div>
                                    )}
                                </div>

                                {/* Right Column - Different for Student vs Professional */}
                                <div className="space-y-4">
                                    {isStudent ? (
                                        <>
                                            <h3 className="font-extrabold text-lg text-white pb-2 border-b border-slate-900 flex items-center gap-2">
                                                <GraduationCap className="w-5 h-5 text-indigo-400" />
                                                Education Details
                                            </h3>

                                            <div className="space-y-1">
                                                <Label htmlFor="degree" className="text-xs font-bold text-slate-400 uppercase tracking-wider">Degree/Course *</Label>
                                                <Input id="degree" value={formData.degree} onChange={(e) => setFormData({ ...formData, degree: e.target.value })} placeholder="B.Tech in Computer Science" className="bg-slate-900/60 border-slate-800 text-white placeholder-slate-650 focus:border-indigo-500 focus:ring-indigo-500/50 rounded-xl h-11" />
                                            </div>

                                            <div className="space-y-1">
                                                <Label htmlFor="institution" className="text-xs font-bold text-slate-400 uppercase tracking-wider">College/University *</Label>
                                                <Input id="institution" value={formData.institution} onChange={(e) => setFormData({ ...formData, institution: e.target.value })} placeholder="MIT" className="bg-slate-900/60 border-slate-800 text-white placeholder-slate-650 focus:border-indigo-500 focus:ring-indigo-500/50 rounded-xl h-11" />
                                            </div>

                                            <div className="space-y-1">
                                                <Label htmlFor="major" className="text-xs font-bold text-slate-400 uppercase tracking-wider">Major/Specialization</Label>
                                                <Input id="major" value={formData.major} onChange={(e) => setFormData({ ...formData, major: e.target.value })} placeholder="Computer Science" className="bg-slate-900/60 border-slate-800 text-white placeholder-slate-650 focus:border-indigo-500 focus:ring-indigo-500/50 rounded-xl h-11" />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <Label htmlFor="graduationYear" className="text-xs font-bold text-slate-400 uppercase tracking-wider">Graduation Year</Label>
                                                    <Input id="graduationYear" value={formData.graduationYear} onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })} placeholder="2024" className="bg-slate-900/60 border-slate-800 text-white placeholder-slate-650 focus:border-indigo-500 focus:ring-indigo-500/50 rounded-xl h-11" />
                                                </div>
                                                <div className="space-y-1">
                                                    <Label htmlFor="gpa" className="text-xs font-bold text-slate-400 uppercase tracking-wider">GPA/Percentage</Label>
                                                    <Input id="gpa" value={formData.gpa} onChange={(e) => setFormData({ ...formData, gpa: e.target.value })} placeholder="3.8 / 85%" className="bg-slate-900/60 border-slate-800 text-white placeholder-slate-650 focus:border-indigo-500 focus:ring-indigo-500/50 rounded-xl h-11" />
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <Label htmlFor="educationLocation" className="text-xs font-bold text-slate-400 uppercase tracking-wider">Location</Label>
                                                <Input id="educationLocation" value={formData.educationLocation} onChange={(e) => setFormData({ ...formData, educationLocation: e.target.value })} placeholder="Cambridge, MA" className="bg-slate-900/60 border-slate-800 text-white placeholder-slate-650 focus:border-indigo-500 focus:ring-indigo-500/50 rounded-xl h-11" />
                                            </div>

                                            <div className="space-y-1">
                                                <Label htmlFor="skills" className="text-xs font-bold text-slate-400 uppercase tracking-wider">Skills (comma-separated)</Label>
                                                <Textarea id="skills" value={formData.skills} onChange={(e) => setFormData({ ...formData, skills: e.target.value })} placeholder="Python, Java, React, Machine Learning" rows={3} className="bg-slate-900/60 border-slate-800 text-white placeholder-slate-650 focus:border-indigo-500 focus:ring-indigo-500/50 rounded-xl" />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <h3 className="font-extrabold text-lg text-white pb-2 border-b border-slate-900 flex items-center gap-2">
                                                <Sparkles className="w-5 h-5 text-indigo-400" />
                                                Professional Details
                                            </h3>

                                            <div className="space-y-1">
                                                <Label htmlFor="jobTitle" className="text-xs font-bold text-slate-400 uppercase tracking-wider">Job Title *</Label>
                                                <Input id="jobTitle" value={formData.jobTitle} onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })} placeholder="Software Engineer" className="bg-slate-900/60 border-slate-800 text-white placeholder-slate-650 focus:border-indigo-500 focus:ring-indigo-500/50 rounded-xl h-11" />
                                            </div>

                                            <div className="space-y-1">
                                                <Label htmlFor="industry" className="text-xs font-bold text-slate-400 uppercase tracking-wider">Industry *</Label>
                                                <Input id="industry" value={formData.industry} onChange={(e) => setFormData({ ...formData, industry: e.target.value })} placeholder="Technology" className="bg-slate-900/60 border-slate-800 text-white placeholder-slate-650 focus:border-indigo-500 focus:ring-indigo-500/50 rounded-xl h-11" />
                                            </div>

                                            <div className="space-y-1">
                                                <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Experience Level *</Label>
                                                <Select value={formData.experienceLevel} onValueChange={(value: any) => setFormData({ ...formData, experienceLevel: value })}>
                                                    <SelectTrigger className="bg-slate-900/60 border-slate-800 text-white focus:ring-indigo-500/50 focus:border-indigo-500 rounded-xl h-11"><SelectValue /></SelectTrigger>
                                                    <SelectContent className="bg-slate-950 border-slate-900 text-white">
                                                        <SelectItem value="entry" className="hover:bg-slate-905 focus:bg-slate-900 cursor-pointer">Entry Level (0-2 years)</SelectItem>
                                                        <SelectItem value="mid" className="hover:bg-slate-905 focus:bg-slate-900 cursor-pointer">Mid Level (3-5 years)</SelectItem>
                                                        <SelectItem value="senior" className="hover:bg-slate-905 focus:bg-slate-900 cursor-pointer">Senior Level (6+ years)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-1">
                                                <Label htmlFor="summary" className="text-xs font-bold text-slate-400 uppercase tracking-wider">Professional Summary (Optional)</Label>
                                                <Textarea id="summary" value={formData.summary} onChange={(e) => setFormData({ ...formData, summary: e.target.value })} placeholder="Leave blank to auto-generate with AI" rows={4} className="bg-slate-900/60 border-slate-800 text-white placeholder-slate-655 focus:border-indigo-500 focus:ring-indigo-500/50 rounded-xl" />
                                            </div>

                                            <div className="space-y-1">
                                                <Label htmlFor="skills" className="text-xs font-bold text-slate-400 uppercase tracking-wider">Skills (Optional, comma-separated)</Label>
                                                <Textarea id="skills" value={formData.skills} onChange={(e) => setFormData({ ...formData, skills: e.target.value })} placeholder="JavaScript, React, Node.js, Python" rows={3} className="bg-slate-900/60 border-slate-800 text-white placeholder-slate-655 focus:border-indigo-500 focus:ring-indigo-500/50 rounded-xl" />
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Target Company AI Alignment Panel */}
                            <div className="bg-gradient-to-br from-indigo-950/20 to-slate-900/40 border border-slate-900 rounded-3xl p-5 sm:p-6.5 space-y-4">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                                            <Sparkles className="w-5 h-5" />
                                        </div>
                                        <div className="text-left">
                                            <h4 className="font-extrabold text-sm sm:text-base text-white">Target Company AI Alignment</h4>
                                            <p className="text-[10px] sm:text-xs text-slate-450 mt-0.5 leading-relaxed">
                                                Optimize this resume instantly to score near 100% on a specific company's ATS keywords.
                                            </p>
                                        </div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={tailorForCompany}
                                        onChange={(e) => setTailorForCompany(e.target.checked)}
                                        className="w-5 h-5 rounded-lg border-slate-800 bg-slate-950 text-indigo-600 focus:ring-indigo-500/50 cursor-pointer accent-indigo-600"
                                    />
                                </div>

                                <AnimatePresence>
                                    {tailorForCompany && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3 text-left border-t border-slate-900 mt-2">
                                                <div className="space-y-1.5">
                                                    <Label htmlFor="targetCompany" className="text-xs font-bold text-slate-450 uppercase tracking-wider">Target Company Name *</Label>
                                                    <Input
                                                        id="targetCompany"
                                                        value={targetCompany}
                                                        onChange={(e) => setTargetCompany(e.target.value)}
                                                        placeholder="e.g. Google"
                                                        className="bg-slate-900/60 border-slate-800 text-white placeholder-slate-650 focus:border-indigo-500 focus:ring-indigo-500/50 rounded-xl h-11"
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <Label htmlFor="targetJobTitle" className="text-xs font-bold text-slate-450 uppercase tracking-wider">Target Job Title *</Label>
                                                    <Input
                                                        id="targetJobTitle"
                                                        value={targetJobTitle}
                                                        onChange={(e) => setTargetJobTitle(e.target.value)}
                                                        placeholder="e.g. Senior Software Engineer"
                                                        className="bg-slate-900/60 border-slate-800 text-white placeholder-slate-650 focus:border-indigo-500 focus:ring-indigo-500/50 rounded-xl h-11"
                                                    />
                                                </div>
                                                <div className="space-y-1.5 md:col-span-2">
                                                    <Label htmlFor="targetJobDescription" className="text-xs font-bold text-slate-450 uppercase tracking-wider">Target Job Description (Optional)</Label>
                                                    <Textarea
                                                        id="targetJobDescription"
                                                        value={targetJobDescription}
                                                        onChange={(e) => setTargetJobDescription(e.target.value)}
                                                        placeholder="Paste the target job description to match skills and index experience bullets..."
                                                        rows={4}
                                                        className="bg-slate-900/60 border-slate-800 text-white placeholder-slate-655 focus:border-indigo-500 focus:ring-indigo-500/50 rounded-xl leading-relaxed text-xs"
                                                    />
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Internships Section - Only for Students */}
                            {isStudent && (
                                <div className="mt-8 space-y-6 border-t border-slate-900 pt-6">
                                    <h3 className="font-extrabold text-lg text-white">Internships (Optional)</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4 bg-slate-900/20 p-5 rounded-2xl border border-slate-900/50">
                                            <h4 className="font-bold text-sm text-indigo-400">Internship 1</h4>
                                            <div className="space-y-1">
                                                <Label htmlFor="internship1Title" className="text-xs font-semibold text-slate-400">Title</Label>
                                                <Input id="internship1Title" value={formData.internship1Title} onChange={(e) => setFormData({ ...formData, internship1Title: e.target.value })} placeholder="Software Intern" className="bg-slate-900/60 border-slate-800 text-white placeholder-slate-650 focus:border-indigo-500 focus:ring-indigo-500/50 rounded-xl h-10" />
                                            </div>
                                            <div className="space-y-1">
                                                <Label htmlFor="internship1Company" className="text-xs font-semibold text-slate-400">Company</Label>
                                                <Input id="internship1Company" value={formData.internship1Company} onChange={(e) => setFormData({ ...formData, internship1Company: e.target.value })} placeholder="Google" className="bg-slate-900/60 border-slate-800 text-white placeholder-slate-650 focus:border-indigo-500 focus:ring-indigo-500/50 rounded-xl h-10" />
                                            </div>
                                            <div className="space-y-1">
                                                <Label htmlFor="internship1Duration" className="text-xs font-semibold text-slate-400">Duration</Label>
                                                <Input id="internship1Duration" value={formData.internship1Duration} onChange={(e) => setFormData({ ...formData, internship1Duration: e.target.value })} placeholder="Jun 2023 - Aug 2023" className="bg-slate-900/60 border-slate-800 text-white placeholder-slate-650 focus:border-indigo-500 focus:ring-indigo-500/50 rounded-xl h-10" />
                                            </div>
                                            <div className="space-y-1">
                                                <Label htmlFor="internship1Description" className="text-xs font-semibold text-slate-400">Description (one per line)</Label>
                                                <Textarea id="internship1Description" value={formData.internship1Description} onChange={(e) => setFormData({ ...formData, internship1Description: e.target.value })} placeholder="Developed web applications&#10;Collaborated with team" rows={3} className="bg-slate-900/60 border-slate-800 text-white placeholder-slate-650 focus:border-indigo-500 focus:ring-indigo-500/50 rounded-xl" />
                                            </div>
                                        </div>

                                        <div className="space-y-4 bg-slate-900/20 p-5 rounded-2xl border border-slate-900/50">
                                            <h4 className="font-bold text-sm text-indigo-400">Internship 2</h4>
                                            <div className="space-y-1">
                                                <Label htmlFor="internship2Title" className="text-xs font-semibold text-slate-400">Title</Label>
                                                <Input id="internship2Title" value={formData.internship2Title} onChange={(e) => setFormData({ ...formData, internship2Title: e.target.value })} placeholder="Data Science Intern" className="bg-slate-900/60 border-slate-800 text-white placeholder-slate-650 focus:border-indigo-500 focus:ring-indigo-500/50 rounded-xl h-10" />
                                            </div>
                                            <div className="space-y-1">
                                                <Label htmlFor="internship2Company" className="text-xs font-semibold text-slate-400">Company</Label>
                                                <Input id="internship2Company" value={formData.internship2Company} onChange={(e) => setFormData({ ...formData, internship2Company: e.target.value })} placeholder="Microsoft" className="bg-slate-900/60 border-slate-800 text-white placeholder-slate-650 focus:border-indigo-500 focus:ring-indigo-500/50 rounded-xl h-10" />
                                            </div>
                                            <div className="space-y-1">
                                                <Label htmlFor="internship2Duration" className="text-xs font-semibold text-slate-400">Duration</Label>
                                                <Input id="internship2Duration" value={formData.internship2Duration} onChange={(e) => setFormData({ ...formData, internship2Duration: e.target.value })} placeholder="Jan 2023 - May 2023" className="bg-slate-900/60 border-slate-800 text-white placeholder-slate-650 focus:border-indigo-500 focus:ring-indigo-500/50 rounded-xl h-10" />
                                            </div>
                                            <div className="space-y-1">
                                                <Label htmlFor="internship2Description" className="text-xs font-semibold text-slate-400">Description (one per line)</Label>
                                                <Textarea id="internship2Description" value={formData.internship2Description} onChange={(e) => setFormData({ ...formData, internship2Description: e.target.value })} placeholder="Analyzed data&#10;Built ML models" rows={3} className="bg-slate-900/60 border-slate-800 text-white placeholder-slate-650 focus:border-indigo-500 focus:ring-indigo-500/50 rounded-xl" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Projects Section - Only for Students */}
                            {isStudent && (
                                <div className="mt-8 space-y-6 border-t border-slate-900 pt-6">
                                    <h3 className="font-extrabold text-lg text-white">College Projects (Optional)</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4 bg-slate-900/20 p-5 rounded-2xl border border-slate-900/50">
                                            <h4 className="font-bold text-sm text-indigo-400">Project 1</h4>
                                            <div className="space-y-1">
                                                <Label htmlFor="project1Name" className="text-xs font-semibold text-slate-400">Project Name</Label>
                                                <Input id="project1Name" value={formData.project1Name} onChange={(e) => setFormData({ ...formData, project1Name: e.target.value })} placeholder="E-Commerce Website" className="bg-slate-900/60 border-slate-800 text-white placeholder-slate-650 focus:border-indigo-500 focus:ring-indigo-500/50 rounded-xl h-10" />
                                            </div>
                                            <div className="space-y-1">
                                                <Label htmlFor="project1Description" className="text-xs font-semibold text-slate-400">Description</Label>
                                                <Textarea id="project1Description" value={formData.project1Description} onChange={(e) => setFormData({ ...formData, project1Description: e.target.value })} placeholder="Built a full-stack e-commerce platform with payment integration" rows={3} className="bg-slate-900/60 border-slate-800 text-white placeholder-slate-650 focus:border-indigo-500 focus:ring-indigo-500/50 rounded-xl" />
                                            </div>
                                            <div className="space-y-1">
                                                <Label htmlFor="project1Technologies" className="text-xs font-semibold text-slate-400">Technologies (comma-separated)</Label>
                                                <Input id="project1Technologies" value={formData.project1Technologies} onChange={(e) => setFormData({ ...formData, project1Technologies: e.target.value })} placeholder="React, Node.js, MongoDB" className="bg-slate-900/60 border-slate-800 text-white placeholder-slate-650 focus:border-indigo-500 focus:ring-indigo-500/50 rounded-xl h-10" />
                                            </div>
                                        </div>

                                        <div className="space-y-4 bg-slate-900/20 p-5 rounded-2xl border border-slate-900/50">
                                            <h4 className="font-bold text-sm text-indigo-400">Project 2</h4>
                                            <div className="space-y-1">
                                                <Label htmlFor="project2Name" className="text-xs font-semibold text-slate-400">Project Name</Label>
                                                <Input id="project2Name" value={formData.project2Name} onChange={(e) => setFormData({ ...formData, project2Name: e.target.value })} placeholder="Machine Learning Model" className="bg-slate-900/60 border-slate-800 text-white placeholder-slate-650 focus:border-indigo-500 focus:ring-indigo-500/50 rounded-xl h-10" />
                                            </div>
                                            <div className="space-y-1">
                                                <Label htmlFor="project2Description" className="text-xs font-semibold text-slate-400">Description</Label>
                                                <Textarea id="project2Description" value={formData.project2Description} onChange={(e) => setFormData({ ...formData, project2Description: e.target.value })} placeholder="Developed a sentiment analysis model with 92% accuracy" rows={3} className="bg-slate-900/60 border-slate-800 text-white placeholder-slate-650 focus:border-indigo-500 focus:ring-indigo-500/50 rounded-xl" />
                                            </div>
                                            <div className="space-y-1">
                                                <Label htmlFor="project2Technologies" className="text-xs font-semibold text-slate-400">Technologies (comma-separated)</Label>
                                                <Input id="project2Technologies" value={formData.project2Technologies} onChange={(e) => setFormData({ ...formData, project2Technologies: e.target.value })} placeholder="Python, TensorFlow, Pandas" className="bg-slate-900/60 border-slate-800 text-white placeholder-slate-650 focus:border-indigo-500 focus:ring-indigo-500/50 rounded-xl h-10" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 3: Review & Create */}
                    {step === 3 && (
                        <div className="space-y-8 text-left">
                            <div className="text-center space-y-2 mb-6">
                                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">Ready to Create!</h2>
                                <p className="text-slate-400 text-xs sm:text-sm">Review your information and build your professional resume</p>
                            </div>

                            <div className="bg-gradient-to-br from-indigo-950/20 to-slate-900/40 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                                        <Sparkles className="w-6 h-6 animate-pulse" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-white">{isStudent ? 'Student' : 'AI-Powered'} Resume Generation</h3>
                                        <p className="text-xs text-slate-400">
                                            We'll structure a professional CV matching industry standards automatically.
                                        </p>
                                    </div>
                                </div>

                                <ul className="space-y-3.5 ml-4 sm:ml-16 pt-2">
                                    <li className="flex items-center gap-3 text-slate-300 text-sm">
                                        <div className="w-2 h-2 bg-indigo-500 rounded-full shrink-0" />
                                        <span>{isStudent ? 'Complete education credentials structure' : 'Generative professional bio summary matching requirements'}</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-slate-300 text-sm">
                                        <div className="w-2 h-2 bg-indigo-500 rounded-full shrink-0" />
                                        <span>Highly optimized list of technical & interpersonal skills</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-slate-300 text-sm">
                                        <div className="w-2 h-2 bg-indigo-500 rounded-full shrink-0" />
                                        <span>{isStudent ? 'Internships & practical coursework details' : 'Chronological professional experience mapping'}</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-slate-300 text-sm">
                                        <div className="w-2 h-2 bg-indigo-500 rounded-full shrink-0" />
                                        <span>{isStudent ? 'College projects and tech stacks' : 'Action-verb oriented project bullets'}</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-slate-900/40 border border-slate-850 rounded-2xl p-6 space-y-4">
                                <h4 className="font-extrabold text-sm text-indigo-400 uppercase tracking-widest">Verify Profile Overview</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                    <div className="flex justify-between sm:justify-start border-b border-slate-900/50 py-1.5 gap-4">
                                        <span className="text-slate-400 text-xs">Candidate Name:</span>
                                        <span className="font-semibold text-white">{formData.fullName}</span>
                                    </div>
                                    <div className="flex justify-between sm:justify-start border-b border-slate-900/50 py-1.5 gap-4">
                                        <span className="text-slate-400 text-xs">{isStudent ? 'Degree/Major:' : 'Target Job Title:'}</span>
                                        <span className="font-semibold text-white">{isStudent ? formData.degree : formData.jobTitle}</span>
                                    </div>
                                    {!isStudent && (
                                        <>
                                            <div className="flex justify-between sm:justify-start border-b border-slate-900/50 py-1.5 gap-4">
                                                <span className="text-slate-400 text-xs">Target Industry:</span>
                                                <span className="font-semibold text-white">{formData.industry}</span>
                                            </div>
                                            <div className="flex justify-between sm:justify-start border-b border-slate-900/50 py-1.5 gap-4">
                                                <span className="text-slate-400 text-xs">Experience Level:</span>
                                                <span className="font-semibold text-white capitalize">{formData.experienceLevel}</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            <Button onClick={handleCreateResume} disabled={isGenerating} size="lg" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-12 font-bold shadow-lg shadow-indigo-600/20">
                                {isGenerating ? (
                                    <>
                                        <Sparkles className="w-5 h-5 mr-2 animate-spin text-white" />
                                        Creating Your Resume...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5 mr-2 text-white" />
                                        Create My Resume
                                    </>
                                )}
                            </Button>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8 pt-6 border-t border-slate-900">
                        <Button variant="outline" onClick={step === 1 ? () => navigate('/dashboard') : handleBack} disabled={isGenerating} className="border-slate-800 bg-transparent text-slate-350 hover:bg-slate-900 hover:text-white rounded-xl h-10 px-5">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            {step === 1 ? 'Cancel' : 'Back'}
                        </Button>

                        {step > 1 && step < 3 && (
                            <Button onClick={handleNext} className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-10 px-6 font-semibold">
                                Next
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        )}
                    </div>
                </Card>
                
                {/* Upgrade Dialog */}
                <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
                    <DialogContent className="sm:max-w-md bg-slate-950 border-slate-900 text-white">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2.5 text-xl font-black">
                                <Crown className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                                Upgrade Your Plan
                            </DialogTitle>
                            <DialogDescription className="pt-2 text-sm text-slate-400 leading-relaxed">
                                You've reached the **1 resume limit** on the Free Plan. Unlock unlimited access today.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-850 text-sm space-y-3">
                            <p className="font-bold text-indigo-400">Pro Plan Includes:</p>
                            <ul className="space-y-2 text-slate-350">
                                <li className="flex items-center gap-2">✅ Create Unlimited Resumes</li>
                                <li className="flex items-center gap-2">✅ 12+ Premium Templates</li>
                                <li className="flex items-center gap-2">✅ Professional Profile Photos</li>
                                <li className="flex items-center gap-2">✅ AI Multi-Job Suggestions</li>
                                <li className="flex items-center gap-2">✅ High Priority Support</li>
                            </ul>
                        </div>
                        <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-2">
                            <Button variant="ghost" onClick={() => setShowUpgradeDialog(false)} className="sm:flex-1 text-slate-400 hover:text-white hover:bg-slate-900">
                                Maybe Later
                            </Button>
                            <Button
                                className="sm:flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-bold gap-2"
                                onClick={() => window.open('https://wa.me/918270374293?text=Hi!%20I\'m%20interested%20in%20upgrading%20to%20KS%20Resume%20Bilder%20Pro%20Plan', '_blank')}
                            >
                                Upgrade to Pro
                                <ExternalLink className="w-4 h-4" />
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}
