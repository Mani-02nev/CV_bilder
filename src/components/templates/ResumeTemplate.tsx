import type { ResumeContent } from '@/types/resume'
import { Mail, Phone, MapPin, Linkedin, Globe, Github } from 'lucide-react'

interface TemplateProps {
    content: ResumeContent
    templateId: string
}

interface TemplateSubProps {
    content: ResumeContent
    styles: {
        primary: string
        secondary: string
        accent?: string
        isGradient?: boolean
    }
}

const getTemplateStyles = (templateId: string) => {
    switch (templateId) {
        case 'modern-blue': return { primary: '#2563eb', secondary: '#eff6ff', accent: '#3b82f6' }
        case 'modern-green': return { primary: '#16a34a', secondary: '#f0fdf4', accent: '#22c55e' }
        case 'professional-teal': return { primary: '#0d9488', secondary: '#f0fdfa', accent: '#14b8a6' }
        case 'classic-black': return { primary: '#1f2937', secondary: '#f9fafb', accent: '#374151' }
        case 'executive-navy': return { primary: '#1e3a8a', secondary: '#eff6ff', accent: '#1d4ed8' }
        case 'executive-gold':
        case 'elegant-gold': return { primary: '#ca8a04', secondary: '#fefce8', accent: '#eab308' }
        case 'minimal-gray':
        case 'minimalist-gray': return { primary: '#4b5563', secondary: '#f9fafb', accent: '#6b7280' }
        case 'minimal-rose': return { primary: '#e11d48', secondary: '#fff1f2', accent: '#f43f5e' }
        case 'creative-purple': return { primary: '#9333ea', secondary: '#db2777', isGradient: true }
        case 'creative-orange':
        case 'marketing-orange': return { primary: '#ea580c', secondary: '#dc2626', isGradient: true }
        case 'ats-basic':
        case 'ats-pro': return { primary: '#000000', secondary: '#ffffff', accent: '#000000' }
        case 'tech-startup-cyan': return { primary: '#0891b2', secondary: '#ecfeff', accent: '#06b6d4' }
        case 'academic-emerald': return { primary: '#059669', secondary: '#ecfdf5', accent: '#10b981' }
        case 'fresher-teal': return { primary: '#0d9488', secondary: '#f0fdfa', accent: '#14b8a6' }
        case 'lawyer-maroon': return { primary: '#991b1b', secondary: '#fef2f2', accent: '#b91c1c' }
        default: return { primary: '#2563eb', secondary: '#eff6ff', accent: '#3b82f6' }
    }
}

export function ResumeTemplate({ content, templateId }: TemplateProps) {
    const styles = getTemplateStyles(templateId)

    // Map all template IDs to the base templates
    const modernTemplates = ['modern-blue', 'modern', 'tech-startup-cyan', 'fresher-teal']
    const classicTemplates = ['classic-black', 'executive-navy', 'classic', 'academic-emerald', 'elegant-gold', 'lawyer-maroon']
    const atsTemplates = ['ats-basic']
    const creativeTemplates = ['creative-purple', 'marketing-orange']
    const minimalTemplates = ['minimalist-gray']

    if (modernTemplates.includes(templateId)) {
        return <ModernTemplate content={content} styles={styles} />
    } else if (classicTemplates.includes(templateId)) {
        return <ClassicTemplate content={content} styles={styles} />
    } else if (creativeTemplates.includes(templateId)) {
        return <CreativeTemplate content={content} styles={styles} />
    } else if (atsTemplates.includes(templateId)) {
        return <ATSTemplate content={content} styles={styles} />
    } else if (minimalTemplates.includes(templateId)) {
        return <MinimalTemplate content={content} styles={styles} />
    }

    return <ModernTemplate content={content} styles={styles} />
}

function Watermark({ opacity = "0.1" }: { opacity?: string }) {
    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
            <div
                className="text-[200px] font-bold -rotate-45 select-none whitespace-nowrap text-gray-400"
                style={{ opacity: opacity }}
            >
                KS
            </div>
        </div>
    )
}

// Modern Template
function ModernTemplate({ content, styles }: { content: ResumeContent; styles: any }) {
    const primaryColor = styles.primary;
    return (
        <div className="bg-white p-12 min-h-[297mm] font-sans relative overflow-hidden">
            <Watermark opacity="0.08" />
            <div className="relative z-10">
                {content.personalInfo && (
                    <div className="mb-8 pb-6 border-b-4" style={{ borderColor: primaryColor }}>
                        <div className="flex items-start gap-6">
                            {content.personalInfo.profilePicture && (
                                <div className="flex-shrink-0">
                                    <img
                                        src={content.personalInfo.profilePicture}
                                        alt={content.personalInfo.fullName}
                                        className="w-24 h-24 rounded-full object-cover border-4"
                                        style={{ borderColor: primaryColor }}
                                    />
                                </div>
                            )}
                            <div className="flex-1">
                                <h1 className="text-4xl font-bold text-gray-900 mb-3">
                                    {content.personalInfo.fullName || "Your Name"}
                                </h1>
                                <div className="grid grid-cols-2 gap-2 text-sm text-gray-700 mb-3">
                                    {content.personalInfo.email && (
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-4 h-4" style={{ color: primaryColor }} />
                                            <span>{content.personalInfo.email}</span>
                                        </div>
                                    )}
                                    {content.personalInfo.phone && (
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-4 h-4" style={{ color: primaryColor }} />
                                            <span>{content.personalInfo.phone}</span>
                                        </div>
                                    )}
                                    {content.personalInfo.location && (
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4" style={{ color: primaryColor }} />
                                            <span>{content.personalInfo.location}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-4 text-sm">
                                    {content.personalInfo.linkedin && (
                                        <div className="flex items-center gap-2" style={{ color: primaryColor }}>
                                            <Linkedin className="w-4 h-4" />
                                            <span className="hover:underline">{content.personalInfo.linkedin}</span>
                                        </div>
                                    )}
                                    {content.personalInfo.portfolio && (
                                        <div className="flex items-center gap-2" style={{ color: primaryColor }}>
                                            <Globe className="w-4 h-4" />
                                            <span className="hover:underline">{content.personalInfo.portfolio}</span>
                                        </div>
                                    )}
                                    {content.personalInfo.github && (
                                        <div className="flex items-center gap-2" style={{ color: primaryColor }}>
                                            <Github className="w-4 h-4" />
                                            <span className="hover:underline">{content.personalInfo.github}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {content.summary && (
                    <div className="mb-6 break-inside-avoid">
                        <h2 className="text-xl font-bold mb-3 uppercase tracking-wide flex items-center gap-2" style={{ color: primaryColor }}>
                            <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: primaryColor }}></div>
                            Professional Summary
                        </h2>
                        <p className="text-sm leading-relaxed text-gray-700 pl-4">{content.summary}</p>
                    </div>
                )}

                {content.skills && content.skills.length > 0 && (
                    <div className="mb-6 break-inside-avoid">
                        <h2 className="text-xl font-bold mb-3 uppercase tracking-wide flex items-center gap-2" style={{ color: primaryColor }}>
                            <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: primaryColor }}></div>
                            Skills
                        </h2>
                        <div className="flex flex-wrap gap-2 pl-4">
                            {content.skills.map((skill, idx) => (
                                <span key={idx} className="px-3 py-1 rounded-md text-sm font-medium" style={{ backgroundColor: primaryColor + '15', color: primaryColor }}>
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {content.education && content.education.length > 0 && (
                    <div className="mb-6 break-inside-avoid">
                        <h2 className="text-xl font-bold mb-3 uppercase tracking-wide flex items-center gap-2" style={{ color: primaryColor }}>
                            <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: primaryColor }}></div>
                            Education
                        </h2>
                        <div className="pl-4 space-y-4">
                            {content.education.map((edu) => (
                                <div key={edu.id} className="border-l-2 pl-4" style={{ borderColor: primaryColor + '33' }}>
                                    <div className="flex justify-between items-start mb-1">
                                        <div>
                                            <h3 className="font-bold text-base text-gray-900">{edu.degree || "Degree"}</h3>
                                            <p className="text-sm text-gray-600">{edu.institution || "Institution"}</p>
                                        </div>
                                        <span className="text-sm text-gray-600 font-medium whitespace-nowrap ml-4">
                                            {edu.startDate} - {edu.endDate}
                                        </span>
                                    </div>
                                    {edu.gpa && <p className="text-sm font-semibold" style={{ color: primaryColor }}>GPA: {edu.gpa}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {content.experience && content.experience.length > 0 && (
                    <div className="mb-6 break-inside-avoid">
                        <h2 className="text-xl font-bold mb-3 uppercase tracking-wide flex items-center gap-2" style={{ color: primaryColor }}>
                            <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: primaryColor }}></div>
                            Experience
                        </h2>
                        <div className="pl-4 space-y-6">
                            {content.experience.map((exp) => (
                                <div key={exp.id} className="border-l-2 pl-4" style={{ borderColor: primaryColor + '33' }}>
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-bold text-base text-gray-900">{exp.title || "Job Title"}</h3>
                                            <p className="text-sm text-gray-600">{exp.company || "Company Name"}</p>
                                        </div>
                                        <span className="text-sm text-gray-600 whitespace-nowrap ml-4">
                                            {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                                        </span>
                                    </div>
                                    {exp.description && exp.description.length > 0 && (
                                        <ul className="list-disc ml-5 text-sm space-y-1 text-gray-700">
                                            {exp.description.filter(Boolean).map((item, idx) => (
                                                <li key={idx}>{item}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {content.projects && content.projects.length > 0 && (
                    <div className="mb-6 break-inside-avoid">
                        <h2 className="text-xl font-bold mb-3 uppercase tracking-wide flex items-center gap-2" style={{ color: primaryColor }}>
                            <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: primaryColor }}></div>
                            Projects
                        </h2>
                        <div className="pl-4 space-y-4">
                            {content.projects.map((proj) => (
                                <div key={proj.id} className="border-l-2 pl-4" style={{ borderColor: primaryColor + '33' }}>
                                    <h3 className="font-bold text-base text-gray-900">{proj.name}</h3>
                                    <p className="text-sm text-gray-700 mb-2">{proj.description}</p>
                                    {proj.technologies && proj.technologies.length > 0 && (
                                        <div className="flex flex-wrap gap-1">
                                            {proj.technologies.map((tech, idx) => (
                                                <span key={idx} className="text-xs px-2 py-0.5 rounded font-medium" style={{ backgroundColor: primaryColor + '15', color: primaryColor }}>
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

// Classic Template
function ClassicTemplate({ content, styles }: { content: ResumeContent; styles: any }) {
    const primaryColor = styles.primary;
    return (
        <div className="bg-white p-12 min-h-[297mm] font-serif relative overflow-hidden">
            <Watermark opacity="0.08" />
            <div className="relative z-10">
                {content.personalInfo && (
                    <div className="text-center mb-8 pb-6 border-b-2" style={{ borderColor: primaryColor }}>
                        {content.personalInfo.profilePicture && (
                            <div className="flex justify-center mb-4">
                                <img
                                    src={content.personalInfo.profilePicture}
                                    alt={content.personalInfo.fullName}
                                    className="w-28 h-28 rounded-full object-cover border-4 border-gray-800"
                                />
                            </div>
                        )}
                        <h1 className="text-3xl font-bold mb-3 tracking-wide">
                            {content.personalInfo.fullName?.toUpperCase() || "YOUR NAME"}
                        </h1>
                        <div className="text-sm space-y-1 mb-3">
                            <div className="flex justify-center items-center gap-2">
                                {content.personalInfo.email && <span>{content.personalInfo.email}</span>}
                                {content.personalInfo.phone && <><span>|</span><span>{content.personalInfo.phone}</span></>}
                                {content.personalInfo.location && <><span>|</span><span>{content.personalInfo.location}</span></>}
                            </div>
                        </div>
                        <div className="flex justify-center gap-4 text-sm">
                            {content.personalInfo.linkedin && (
                                <div className="flex items-center gap-1">
                                    <Linkedin className="w-3 h-3" />
                                    <span>{content.personalInfo.linkedin}</span>
                                </div>
                            )}
                            {content.personalInfo.portfolio && (
                                <div className="flex items-center gap-1">
                                    <Globe className="w-3 h-3" />
                                    <span>{content.personalInfo.portfolio}</span>
                                </div>
                            )}
                            {content.personalInfo.github && (
                                <div className="flex items-center gap-1">
                                    <Github className="w-3 h-3" />
                                    <span>{content.personalInfo.github}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {content.summary && (
                    <div className="mb-5 break-inside-avoid">
                        <h2 className="text-lg font-bold mb-2 border-b border-gray-400 pb-1">PROFESSIONAL SUMMARY</h2>
                        <p className="text-sm leading-relaxed">{content.summary}</p>
                    </div>
                )}

                {content.experience && content.experience.length > 0 && (
                    <div className="mb-5 break-inside-avoid">
                        <h2 className="text-lg font-bold mb-2 border-b border-gray-400 pb-1">PROFESSIONAL EXPERIENCE</h2>
                        {content.experience.map((exp) => (
                            <div key={exp.id} className="mb-3">
                                <div className="flex justify-between">
                                    <strong className="text-sm">{exp.title}</strong>
                                    <span className="text-xs">{exp.startDate} - {exp.current ? "Present" : exp.endDate}</span>
                                </div>
                                <div className="italic text-sm mb-1">{exp.company}</div>
                                {exp.description && exp.description.length > 0 && (
                                    <ul className="list-disc ml-5 text-xs space-y-0.5">
                                        {exp.description.filter(Boolean).map((item, idx) => (
                                            <li key={idx}>{item}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {content.education && content.education.length > 0 && (
                    <div className="mb-5 break-inside-avoid">
                        <h2 className="text-lg font-bold mb-2 border-b border-gray-400 pb-1">EDUCATION</h2>
                        {content.education.map((edu) => (
                            <div key={edu.id} className="mb-2">
                                <div className="flex justify-between">
                                    <strong className="text-sm">{edu.degree}</strong>
                                    <span className="text-xs">{edu.startDate} - {edu.endDate}</span>
                                </div>
                                <div className="italic text-sm">{edu.institution}</div>
                                {edu.gpa && <div className="text-xs">GPA: {edu.gpa}</div>}
                            </div>
                        ))}
                    </div>
                )}

                {content.projects && content.projects.length > 0 && (
                    <div className="mb-5 break-inside-avoid">
                        <h2 className="text-lg font-bold mb-2 border-b border-gray-400 pb-1">PROJECTS</h2>
                        {content.projects.map((proj) => (
                            <div key={proj.id} className="mb-2">
                                <strong className="text-sm">{proj.name}</strong>
                                <p className="text-xs">{proj.description}</p>
                            </div>
                        ))}
                    </div>
                )}

                {content.skills && content.skills.length > 0 && (
                    <div className="mb-5 break-inside-avoid">
                        <h2 className="text-lg font-bold mb-2 border-b border-gray-400 pb-1">SKILLS</h2>
                        <p className="text-sm">{content.skills.join(', ')}</p>
                    </div>
                )}
            </div>
        </div>
    )
}

// Minimal Template
function MinimalTemplate({ content, styles: _styles }: TemplateSubProps) {
    return (
        <div className="bg-white p-12 min-h-[297mm] font-sans relative overflow-hidden">
            <Watermark opacity="0.05" />
            <div className="relative z-10">
                {content.personalInfo && (
                    <div className="mb-10">
                        <h1 className="text-5xl font-light mb-6">{content.personalInfo.fullName || "Your Name"}</h1>
                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-500 border-t border-b py-4">
                            {content.personalInfo.email && <span>{content.personalInfo.email}</span>}
                            {content.personalInfo.phone && <span>{content.personalInfo.phone}</span>}
                            {content.personalInfo.location && <span>{content.personalInfo.location}</span>}
                            {content.personalInfo.linkedin && <span>LinkedIn</span>}
                            {content.personalInfo.portfolio && <span>Portfolio</span>}
                        </div>
                    </div>
                )}

                {content.summary && (
                    <div className="mb-8 break-inside-avoid">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Summary</h2>
                        <p className="text-sm leading-relaxed text-gray-700">{content.summary}</p>
                    </div>
                )}

                {content.experience && content.experience.length > 0 && (
                    <div className="mb-8 break-inside-avoid">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Experience</h2>
                        <div className="space-y-6">
                            {content.experience.map((exp) => (
                                <div key={exp.id}>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-bold text-base">{exp.title}</h3>
                                        <span className="text-xs text-gray-500">{exp.startDate} - {exp.endDate}</span>
                                    </div>
                                    <div className="text-sm text-gray-600 mb-2">{exp.company}</div>
                                    {exp.description && (
                                        <ul className="list-disc ml-5 text-sm space-y-1 text-gray-700">
                                            {exp.description.map((item, idx) => <li key={idx}>{item}</li>)}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {content.education && content.education.length > 0 && (
                    <div className="mb-8 break-inside-avoid">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Education</h2>
                        {content.education.map((edu) => (
                            <div key={edu.id} className="mb-4">
                                <div className="flex justify-between items-baseline">
                                    <h3 className="font-bold text-sm">{edu.degree}</h3>
                                    <span className="text-xs text-gray-500">{edu.startDate} - {edu.endDate}</span>
                                </div>
                                <div className="text-sm text-gray-600">{edu.institution}</div>
                            </div>
                        ))}
                    </div>
                )}

                {content.skills && content.skills.length > 0 && (
                    <div className="break-inside-avoid">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Skills</h2>
                        <div className="flex flex-wrap gap-2">
                            {content.skills.map((skill, idx) => (
                                <span key={idx} className="text-sm bg-gray-50 px-3 py-1 border">{skill}</span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

// Creative Template
function CreativeTemplate({ content, styles }: { content: ResumeContent; styles: any }) {
    const { primary, secondary, isGradient } = styles;
    const headerStyle = isGradient
        ? { background: `linear-gradient(to right, ${primary}, ${secondary})` }
        : { backgroundColor: primary };

    return (
        <div className="bg-white min-h-[297mm] font-sans relative overflow-hidden">
            <Watermark opacity="0.05" />
            <div className="relative z-10">
                {content.personalInfo && (
                    <div className="p-10 text-white" style={headerStyle}>
                        <div className="flex items-center gap-8">
                            {content.personalInfo.profilePicture && (
                                <img
                                    src={content.personalInfo.profilePicture}
                                    className="w-32 h-32 rounded-2xl object-cover border-4 border-white/20"
                                />
                            )}
                            <div>
                                <h1 className="text-5xl font-black mb-4">{content.personalInfo.fullName || "Your Name"}</h1>
                                <div className="flex flex-wrap gap-4 text-sm opacity-90">
                                    {content.personalInfo.email && <span>{content.personalInfo.email}</span>}
                                    {content.personalInfo.phone && <span>{content.personalInfo.phone}</span>}
                                    {content.personalInfo.location && <span>{content.personalInfo.location}</span>}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="p-10 grid grid-cols-3 gap-10">
                    <div className="col-span-2 space-y-8">
                        {content.summary && (
                            <div>
                                <h2 className="text-2xl font-bold mb-4" style={{ color: primary }}>About Me</h2>
                                <p className="text-sm leading-relaxed text-gray-700">{content.summary}</p>
                            </div>
                        )}
                        {content.experience && (
                            <div>
                                <h2 className="text-2xl font-bold mb-6" style={{ color: primary }}>Experience</h2>
                                <div className="space-y-8">
                                    {content.experience.map((exp) => (
                                        <div key={exp.id}>
                                            <h3 className="font-bold text-lg">{exp.title}</h3>
                                            <div className="text-sm font-bold opacity-60 mb-2">{exp.company} | {exp.startDate} - {exp.endDate}</div>
                                            <ul className="list-disc ml-5 text-sm space-y-1 text-gray-700">
                                                {exp.description.map((item, idx) => <li key={idx}>{item}</li>)}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="space-y-8">
                        {content.skills && (
                            <div>
                                <h2 className="text-xl font-bold mb-4" style={{ color: primary }}>Skills</h2>
                                <div className="flex flex-wrap gap-2">
                                    {content.skills.map((skill, idx) => (
                                        <span key={idx} className="bg-gray-100 px-3 py-1 rounded text-sm">{skill}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                        {content.education && (
                            <div>
                                <h2 className="text-xl font-bold mb-4" style={{ color: primary }}>Education</h2>
                                {content.education.map((edu) => (
                                    <div key={edu.id} className="mb-4">
                                        <div className="font-bold text-sm">{edu.degree}</div>
                                        <div className="text-xs opacity-60">{edu.institution}</div>
                                        <div className="text-xs italic">{edu.startDate} - {edu.endDate}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

// ATS Template
function ATSTemplate({ content }: TemplateSubProps) {
    return (
        <div className="bg-white p-12 min-h-[297mm] font-sans text-gray-900 relative overflow-hidden">
            <Watermark opacity="0.1" />
            <div className="relative z-10">
                {content.personalInfo && (
                    <div className="text-center mb-8 border-b-2 border-black pb-4">
                        <h1 className="text-3xl font-bold uppercase tracking-widest mb-2">{content.personalInfo.fullName || "Your Name"}</h1>
                        <div className="flex justify-center gap-4 text-sm">
                            {content.personalInfo.email && <span>{content.personalInfo.email}</span>}
                            {content.personalInfo.phone && <span>| {content.personalInfo.phone}</span>}
                            {content.personalInfo.location && <span>| {content.personalInfo.location}</span>}
                        </div>
                    </div>
                )}

                <div className="space-y-6">
                    {content.summary && (
                        <div>
                            <h2 className="text-sm font-bold uppercase tracking-wider mb-2 border-b">Professional Summary</h2>
                            <p className="text-sm">{content.summary}</p>
                        </div>
                    )}
                    {content.experience && (
                        <div>
                            <h2 className="text-sm font-bold uppercase tracking-wider mb-3 border-b">Experience</h2>
                            <div className="space-y-4">
                                {content.experience.map((exp) => (
                                    <div key={exp.id}>
                                        <div className="flex justify-between font-bold text-sm">
                                            <span>{exp.title}</span>
                                            <span>{exp.startDate} - {exp.endDate}</span>
                                        </div>
                                        <div className="text-sm italic mb-2">{exp.company}</div>
                                        <ul className="list-disc ml-5 text-sm space-y-1">
                                            {exp.description.map((item, idx) => <li key={idx}>{item}</li>)}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {content.education && (
                        <div>
                            <h2 className="text-sm font-bold uppercase tracking-wider mb-2 border-b">Education</h2>
                            {content.education.map((edu) => (
                                <div key={edu.id} className="flex justify-between text-sm">
                                    <span><span className="font-bold">{edu.degree}</span>, {edu.institution}</span>
                                    <span>{edu.startDate} - {edu.endDate}</span>
                                </div>
                            ))}
                        </div>
                    )}
                    {content.skills && (
                        <div>
                            <h2 className="text-sm font-bold uppercase tracking-wider mb-1 border-b">Skills</h2>
                            <p className="text-sm">{content.skills.join(', ')}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
