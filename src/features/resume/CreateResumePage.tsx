import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TemplateSelector } from '@/components/TemplateSelector'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCreateResume, useUpdateResumeContent } from '@/hooks/useResume'
import { ArrowLeft, ArrowRight, Sparkles, GraduationCap, Briefcase } from 'lucide-react'
import { aiService } from '@/services/ai'
import type { ResumeContent } from '@/types/resume'

export function CreateResumePage() {
    const navigate = useNavigate()
    const createResume = useCreateResume()
    const updateContent = useUpdateResumeContent()

    const [step, setStep] = useState(1)
    const [selectedTemplate, setSelectedTemplate] = useState<string>('')
    const [isGenerating, setIsGenerating] = useState(false)
    const [isStudent, setIsStudent] = useState(false)

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
            alert('Please select a template')
            return
        }
        if (step < 3) setStep(step + 1)
    }

    const handleBack = () => {
        if (step > 1) setStep(step - 1)
    }

    const handleCreateResume = async () => {
        if (!formData.fullName || !formData.email) {
            alert('Please fill in your name and email')
            return
        }

        if (!isStudent && (!formData.jobTitle || !formData.industry)) {
            alert('Please fill in job title and industry')
            return
        }

        if (isStudent && !formData.degree) {
            alert('Please fill in your degree/course')
            return
        }

        setIsGenerating(true)

        try {
            let content: ResumeContent

            if (isStudent) {
                content = {
                    personalInfo: {
                        fullName: formData.fullName,
                        email: formData.email,
                        phone: formData.phone,
                        location: formData.location,
                        linkedin: formData.linkedin,
                        portfolio: formData.portfolio
                    },
                    summary: formData.summary || `Motivated ${formData.degree} student with strong academic background and hands-on experience through internships and projects. Passionate about ${formData.major || formData.industry || 'technology'} and eager to apply theoretical knowledge to real-world challenges.`,
                    skills: formData.skills ? formData.skills.split(',').map(s => s.trim()) : [
                        'Problem Solving', 'Team Collaboration', 'Communication', 'Time Management',
                        'Quick Learner', 'Analytical Thinking', 'Project Management', 'Research Skills'
                    ],
                    education: [{
                        id: 'edu-1',
                        degree: formData.degree,
                        institution: formData.institution || 'University Name',
                        location: formData.educationLocation,
                        startDate: formData.graduationYear ? (parseInt(formData.graduationYear) - 4).toString() : '2020',
                        endDate: formData.graduationYear || 'Expected 2024',
                        gpa: formData.gpa
                    }],
                    experience: [],
                    projects: [],
                    certifications: []
                }

                if (formData.internship1Title) {
                    content.experience = content.experience || []
                    content.experience.push({
                        id: 'int-1',
                        title: formData.internship1Title,
                        company: formData.internship1Company || 'Company Name',
                        location: '',
                        startDate: formData.internship1Duration.split('-')[0]?.trim() || '2023',
                        endDate: formData.internship1Duration.split('-')[1]?.trim() || '2024',
                        current: false,
                        description: formData.internship1Description ?
                            formData.internship1Description.split('\n').filter(d => d.trim()) :
                            ['Contributed to team projects and gained practical experience']
                    })
                }

                if (formData.internship2Title) {
                    content.experience = content.experience || []
                    content.experience.push({
                        id: 'int-2',
                        title: formData.internship2Title,
                        company: formData.internship2Company || 'Company Name',
                        location: '',
                        startDate: formData.internship2Duration.split('-')[0]?.trim() || '2022',
                        endDate: formData.internship2Duration.split('-')[1]?.trim() || '2023',
                        current: false,
                        description: formData.internship2Description ?
                            formData.internship2Description.split('\n').filter(d => d.trim()) :
                            ['Gained hands-on experience in professional environment']
                    })
                }

                if (formData.project1Name) {
                    content.projects = content.projects || []
                    content.projects.push({
                        id: 'proj-1',
                        name: formData.project1Name,
                        description: formData.project1Description || 'Academic project',
                        technologies: formData.project1Technologies ? formData.project1Technologies.split(',').map(t => t.trim()) : [],
                        link: ''
                    })
                }

                if (formData.project2Name) {
                    content.projects = content.projects || []
                    content.projects.push({
                        id: 'proj-2',
                        name: formData.project2Name,
                        description: formData.project2Description || 'Academic project',
                        technologies: formData.project2Technologies ? formData.project2Technologies.split(',').map(t => t.trim()) : [],
                        link: ''
                    })
                }

            } else {
                const aiContent = await aiService.generateResume({
                    jobTitle: formData.jobTitle,
                    industry: formData.industry,
                    experienceLevel: formData.experienceLevel
                })

                content = {
                    personalInfo: {
                        fullName: formData.fullName,
                        email: formData.email,
                        phone: formData.phone,
                        location: formData.location,
                        linkedin: formData.linkedin,
                        portfolio: formData.portfolio
                    },
                    summary: formData.summary || aiContent.professionalSummary,
                    skills: formData.skills ? formData.skills.split(',').map(s => s.trim()) : aiContent.skills,
                    experience: aiContent.experience.map((exp, idx) => ({
                        id: `exp-${idx}`,
                        title: exp.title,
                        company: exp.company,
                        location: '',
                        startDate: exp.period.split(' - ')[0],
                        endDate: exp.period.split(' - ')[1] || 'Present',
                        current: exp.period.includes('Present'),
                        description: exp.description
                    })),
                    education: formData.degree ? [{
                        id: 'edu-1',
                        degree: formData.degree,
                        institution: formData.institution || 'University Name',
                        location: formData.educationLocation,
                        startDate: formData.graduationYear ? (parseInt(formData.graduationYear) - 4).toString() : '2015',
                        endDate: formData.graduationYear || '2019',
                        gpa: formData.gpa
                    }] : [{
                        id: 'edu-1',
                        degree: 'Bachelor of Science',
                        institution: 'University Name',
                        location: '',
                        startDate: '2015',
                        endDate: '2019',
                        gpa: '3.8'
                    }],
                    projects: aiContent.projects.map((proj, idx) => ({
                        id: `proj-${idx}`,
                        name: proj.name,
                        description: proj.description,
                        technologies: [],
                        link: ''
                    })),
                    certifications: []
                }
            }

            const newResume = await createResume.mutateAsync({
                title: `${formData.fullName} - ${isStudent ? formData.degree : formData.jobTitle}`,
                templateId: selectedTemplate
            })

            await updateContent.mutateAsync({
                id: newResume.id,
                content: content
            })

            navigate(`/builder/${newResume.id}`)
        } catch (error) {
            console.error('Error creating resume:', error)
            alert('Failed to create resume. Please try again.')
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex items-center justify-center gap-2 sm:gap-4">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className="flex items-center">
                                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-sm sm:text-base ${step >= s ? 'bg-primary text-primary-foreground' : 'bg-gray-200 text-gray-500'
                                    }`}>
                                    {s}
                                </div>
                                {s < 3 && <div className={`w-10 sm:w-20 h-1 ${step > s ? 'bg-primary' : 'bg-gray-200'}`} />}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-center gap-8 sm:gap-24 mt-2">
                        <span className={`text-xs sm:text-sm ${step >= 1 ? 'font-semibold' : 'text-gray-500'}`}>Template</span>
                        <span className={`text-xs sm:text-sm ${step >= 2 ? 'font-semibold' : 'text-gray-500'}`}>Info</span>
                        <span className={`text-xs sm:text-sm ${step >= 3 ? 'font-semibold' : 'text-gray-500'}`}>Create</span>
                    </div>
                </div>

                <Card className="p-8">
                    {/* Step 1: Template Selection */}
                    {step === 1 && (
                        <TemplateSelector
                            selectedTemplateId={selectedTemplate}
                            onSelect={setSelectedTemplate}
                        />
                    )}

                    {/* Step 2: Information Form */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <div className="text-center space-y-2 mb-8">
                                <h2 className="text-3xl font-bold">Your Information</h2>
                                <p className="text-muted-foreground">Fill in your details to create your professional resume</p>
                            </div>

                            {/* Student/Professional Toggle */}
                            <div className="flex justify-center gap-4 mb-8">
                                <Button
                                    type="button"
                                    variant={!isStudent ? 'default' : 'outline'}
                                    onClick={() => setIsStudent(false)}
                                    className="gap-2"
                                >
                                    <Briefcase className="w-4 h-4" />
                                    Professional
                                </Button>
                                <Button
                                    type="button"
                                    variant={isStudent ? 'default' : 'outline'}
                                    onClick={() => setIsStudent(true)}
                                    className="gap-2"
                                >
                                    <GraduationCap className="w-4 h-4" />
                                    Student
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Personal Information */}
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-lg">Personal Details</h3>

                                    <div>
                                        <Label htmlFor="fullName">Full Name *</Label>
                                        <Input id="fullName" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} placeholder="John Doe" />
                                    </div>

                                    <div>
                                        <Label htmlFor="email">Email *</Label>
                                        <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="john@example.com" />
                                    </div>

                                    <div>
                                        <Label htmlFor="phone">Phone</Label>
                                        <Input id="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+1 (555) 123-4567" />
                                    </div>

                                    <div>
                                        <Label htmlFor="location">Location</Label>
                                        <Input id="location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="New York, NY" />
                                    </div>

                                    <div>
                                        <Label htmlFor="linkedin">LinkedIn</Label>
                                        <Input id="linkedin" value={formData.linkedin} onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })} placeholder="linkedin.com/in/johndoe" />
                                    </div>

                                    <div>
                                        <Label htmlFor="portfolio">Portfolio/Website</Label>
                                        <Input id="portfolio" value={formData.portfolio} onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })} placeholder="johndoe.com" />
                                    </div>

                                    {isStudent && (
                                        <div>
                                            <Label htmlFor="github">GitHub</Label>
                                            <Input id="github" value={formData.github} onChange={(e) => setFormData({ ...formData, github: e.target.value })} placeholder="github.com/johndoe" />
                                        </div>
                                    )}
                                </div>

                                {/* Right Column - Different for Student vs Professional */}
                                <div className="space-y-4">
                                    {isStudent ? (
                                        <>
                                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                                <GraduationCap className="w-5 h-5 text-primary" />
                                                Education Details
                                            </h3>

                                            <div>
                                                <Label htmlFor="degree">Degree/Course *</Label>
                                                <Input id="degree" value={formData.degree} onChange={(e) => setFormData({ ...formData, degree: e.target.value })} placeholder="B.Tech in Computer Science" />
                                            </div>

                                            <div>
                                                <Label htmlFor="institution">College/University *</Label>
                                                <Input id="institution" value={formData.institution} onChange={(e) => setFormData({ ...formData, institution: e.target.value })} placeholder="MIT" />
                                            </div>

                                            <div>
                                                <Label htmlFor="major">Major/Specialization</Label>
                                                <Input id="major" value={formData.major} onChange={(e) => setFormData({ ...formData, major: e.target.value })} placeholder="Computer Science" />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Label htmlFor="graduationYear">Graduation Year</Label>
                                                    <Input id="graduationYear" value={formData.graduationYear} onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })} placeholder="2024" />
                                                </div>
                                                <div>
                                                    <Label htmlFor="gpa">GPA/Percentage</Label>
                                                    <Input id="gpa" value={formData.gpa} onChange={(e) => setFormData({ ...formData, gpa: e.target.value })} placeholder="3.8 / 85%" />
                                                </div>
                                            </div>

                                            <div>
                                                <Label htmlFor="educationLocation">Location</Label>
                                                <Input id="educationLocation" value={formData.educationLocation} onChange={(e) => setFormData({ ...formData, educationLocation: e.target.value })} placeholder="Cambridge, MA" />
                                            </div>

                                            <div>
                                                <Label htmlFor="skills">Skills (comma-separated)</Label>
                                                <Textarea id="skills" value={formData.skills} onChange={(e) => setFormData({ ...formData, skills: e.target.value })} placeholder="Python, Java, React, Machine Learning" rows={3} />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                                <Sparkles className="w-5 h-5 text-primary" />
                                                Professional Details
                                            </h3>

                                            <div>
                                                <Label htmlFor="jobTitle">Job Title *</Label>
                                                <Input id="jobTitle" value={formData.jobTitle} onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })} placeholder="Software Engineer" />
                                            </div>

                                            <div>
                                                <Label htmlFor="industry">Industry *</Label>
                                                <Input id="industry" value={formData.industry} onChange={(e) => setFormData({ ...formData, industry: e.target.value })} placeholder="Technology" />
                                            </div>

                                            <div>
                                                <Label htmlFor="experienceLevel">Experience Level *</Label>
                                                <Select value={formData.experienceLevel} onValueChange={(value: any) => setFormData({ ...formData, experienceLevel: value })}>
                                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                                                        <SelectItem value="mid">Mid Level (3-5 years)</SelectItem>
                                                        <SelectItem value="senior">Senior Level (6+ years)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div>
                                                <Label htmlFor="summary">Professional Summary (Optional)</Label>
                                                <Textarea id="summary" value={formData.summary} onChange={(e) => setFormData({ ...formData, summary: e.target.value })} placeholder="Leave blank to auto-generate with AI" rows={4} />
                                            </div>

                                            <div>
                                                <Label htmlFor="skills">Skills (Optional, comma-separated)</Label>
                                                <Textarea id="skills" value={formData.skills} onChange={(e) => setFormData({ ...formData, skills: e.target.value })} placeholder="JavaScript, React, Node.js, Python" rows={3} />
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Internships Section - Only for Students */}
                            {isStudent && (
                                <div className="mt-8 space-y-6 border-t pt-6">
                                    <h3 className="font-semibold text-lg">Internships (Optional)</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <h4 className="font-medium text-sm text-muted-foreground">Internship 1</h4>
                                            <div>
                                                <Label htmlFor="internship1Title">Title</Label>
                                                <Input id="internship1Title" value={formData.internship1Title} onChange={(e) => setFormData({ ...formData, internship1Title: e.target.value })} placeholder="Software Intern" />
                                            </div>
                                            <div>
                                                <Label htmlFor="internship1Company">Company</Label>
                                                <Input id="internship1Company" value={formData.internship1Company} onChange={(e) => setFormData({ ...formData, internship1Company: e.target.value })} placeholder="Google" />
                                            </div>
                                            <div>
                                                <Label htmlFor="internship1Duration">Duration</Label>
                                                <Input id="internship1Duration" value={formData.internship1Duration} onChange={(e) => setFormData({ ...formData, internship1Duration: e.target.value })} placeholder="Jun 2023 - Aug 2023" />
                                            </div>
                                            <div>
                                                <Label htmlFor="internship1Description">Description (one per line)</Label>
                                                <Textarea id="internship1Description" value={formData.internship1Description} onChange={(e) => setFormData({ ...formData, internship1Description: e.target.value })} placeholder="Developed web applications&#10;Collaborated with team" rows={3} />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="font-medium text-sm text-muted-foreground">Internship 2</h4>
                                            <div>
                                                <Label htmlFor="internship2Title">Title</Label>
                                                <Input id="internship2Title" value={formData.internship2Title} onChange={(e) => setFormData({ ...formData, internship2Title: e.target.value })} placeholder="Data Science Intern" />
                                            </div>
                                            <div>
                                                <Label htmlFor="internship2Company">Company</Label>
                                                <Input id="internship2Company" value={formData.internship2Company} onChange={(e) => setFormData({ ...formData, internship2Company: e.target.value })} placeholder="Microsoft" />
                                            </div>
                                            <div>
                                                <Label htmlFor="internship2Duration">Duration</Label>
                                                <Input id="internship2Duration" value={formData.internship2Duration} onChange={(e) => setFormData({ ...formData, internship2Duration: e.target.value })} placeholder="Jan 2023 - May 2023" />
                                            </div>
                                            <div>
                                                <Label htmlFor="internship2Description">Description (one per line)</Label>
                                                <Textarea id="internship2Description" value={formData.internship2Description} onChange={(e) => setFormData({ ...formData, internship2Description: e.target.value })} placeholder="Analyzed data&#10;Built ML models" rows={3} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Projects Section - Only for Students */}
                            {isStudent && (
                                <div className="mt-8 space-y-6 border-t pt-6">
                                    <h3 className="font-semibold text-lg">College Projects (Optional)</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <h4 className="font-medium text-sm text-muted-foreground">Project 1</h4>
                                            <div>
                                                <Label htmlFor="project1Name">Project Name</Label>
                                                <Input id="project1Name" value={formData.project1Name} onChange={(e) => setFormData({ ...formData, project1Name: e.target.value })} placeholder="E-Commerce Website" />
                                            </div>
                                            <div>
                                                <Label htmlFor="project1Description">Description</Label>
                                                <Textarea id="project1Description" value={formData.project1Description} onChange={(e) => setFormData({ ...formData, project1Description: e.target.value })} placeholder="Built a full-stack e-commerce platform with payment integration" rows={3} />
                                            </div>
                                            <div>
                                                <Label htmlFor="project1Technologies">Technologies (comma-separated)</Label>
                                                <Input id="project1Technologies" value={formData.project1Technologies} onChange={(e) => setFormData({ ...formData, project1Technologies: e.target.value })} placeholder="React, Node.js, MongoDB" />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="font-medium text-sm text-muted-foreground">Project 2</h4>
                                            <div>
                                                <Label htmlFor="project2Name">Project Name</Label>
                                                <Input id="project2Name" value={formData.project2Name} onChange={(e) => setFormData({ ...formData, project2Name: e.target.value })} placeholder="Machine Learning Model" />
                                            </div>
                                            <div>
                                                <Label htmlFor="project2Description">Description</Label>
                                                <Textarea id="project2Description" value={formData.project2Description} onChange={(e) => setFormData({ ...formData, project2Description: e.target.value })} placeholder="Developed a sentiment analysis model with 92% accuracy" rows={3} />
                                            </div>
                                            <div>
                                                <Label htmlFor="project2Technologies">Technologies (comma-separated)</Label>
                                                <Input id="project2Technologies" value={formData.project2Technologies} onChange={(e) => setFormData({ ...formData, project2Technologies: e.target.value })} placeholder="Python, TensorFlow, Pandas" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 3: Review & Create */}
                    {step === 3 && (
                        <div className="space-y-6">
                            <div className="text-center space-y-2 mb-8">
                                <h2 className="text-3xl font-bold">Ready to Create!</h2>
                                <p className="text-muted-foreground">Review your information and create your professional resume</p>
                            </div>

                            <div className="bg-gradient-to-br from-primary/10 to-purple-100 rounded-lg p-8 space-y-4">
                                <div className="flex items-center gap-4">
                                    <Sparkles className="w-12 h-12 text-primary" />
                                    <div>
                                        <h3 className="font-semibold text-lg">{isStudent ? 'Student' : 'AI-Powered'} Resume Generation</h3>
                                        <p className="text-sm text-muted-foreground">
                                            We'll create a professional resume with your information
                                        </p>
                                    </div>
                                </div>

                                <ul className="space-y-2 ml-16">
                                    <li className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-primary rounded-full" />
                                        <span>{isStudent ? 'Education details' : 'Professional summary tailored to your role'}</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-primary rounded-full" />
                                        <span>Relevant skills</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-primary rounded-full" />
                                        <span>{isStudent ? 'Internships and experience' : 'Professional work experience'}</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-primary rounded-full" />
                                        <span>{isStudent ? 'College projects' : 'Industry-specific projects'}</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                                <h4 className="font-semibold">Your Information:</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-muted-foreground">Name:</span>
                                        <span className="ml-2 font-medium">{formData.fullName}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">{isStudent ? 'Degree:' : 'Job Title:'}</span>
                                        <span className="ml-2 font-medium">{isStudent ? formData.degree : formData.jobTitle}</span>
                                    </div>
                                    {!isStudent && (
                                        <>
                                            <div>
                                                <span className="text-muted-foreground">Industry:</span>
                                                <span className="ml-2 font-medium">{formData.industry}</span>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Experience:</span>
                                                <span className="ml-2 font-medium capitalize">{formData.experienceLevel}</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            <Button onClick={handleCreateResume} disabled={isGenerating} size="lg" className="w-full">
                                {isGenerating ? (
                                    <>
                                        <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                                        Creating Your Resume...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5 mr-2" />
                                        Create My Resume
                                    </>
                                )}
                            </Button>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8 pt-6 border-t">
                        <Button variant="outline" onClick={step === 1 ? () => navigate('/dashboard') : handleBack} disabled={isGenerating}>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            {step === 1 ? 'Cancel' : 'Back'}
                        </Button>

                        {step < 3 && (
                            <Button onClick={handleNext}>
                                Next
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    )
}
