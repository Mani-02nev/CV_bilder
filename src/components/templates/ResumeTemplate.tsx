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

// Modern Template with Dynamic Color support
function ModernTemplate({ content, styles }: { content: ResumeContent; styles: any }) {
    const primaryColor = styles.primary;
    return (
        <div className="bg-white p-12 min-h-[297mm] font-sans">
            {/* Header with Profile Picture */}
            {content.personalInfo && (
                <div className="mb-8 pb-6 border-b-4" style={{ borderColor: primaryColor }}>
                    <div className="flex items-start gap-6">
                        {/* Profile Picture */}
                        {content.personalInfo.profilePicture && (
                            <div className="flex-shrink-0">
                                <img
                                    src={content.personalInfo.profilePicture}
                                    alt={content.personalInfo.fullName}
                                    className="w-24 h-24 rounded-full object-cover border-4 border-blue-600"
                                />
                            </div>
                        )}

                        {/* Header Info */}
                        <div className="flex-1">
                            <h1 className="text-4xl font-bold text-gray-900 mb-3">
                                {content.personalInfo.fullName || "Your Name"}
                            </h1>

                            {/* Contact Info with Icons */}
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

                            {/* Social Links */}
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

            {/* Summary */}
            {content.summary && (
                <div className="mb-6 break-inside-avoid">
                    <h2 className="text-xl font-bold mb-3 uppercase tracking-wide flex items-center gap-2" style={{ color: primaryColor }}>
                        <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: primaryColor }}></div>
                        Professional Summary
                    </h2>
                    <p className="text-sm leading-relaxed text-gray-700 pl-4">{content.summary}</p>
                </div>
            )}

            {/* Skills */}
            {content.skills && content.skills.length > 0 && (
                <div className="mb-6 break-inside-avoid">
                    <h2 className="text-xl font-bold mb-3 uppercase tracking-wide flex items-center gap-2" style={{ color: primaryColor }}>
                        <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: primaryColor }}></div>
                        Skills
                    </h2>
                    <div className="flex flex-wrap gap-2 pl-4">
                        {content.skills.map((skill, idx) => (
                            <span key={idx} className="px-3 py-1 rounded-md text-sm font-medium" style={{ backgroundColor: styles.accent + '22', color: primaryColor }}>
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Education */}
            {content.education && content.education.length > 0 && (
                <div className="mb-6 break-inside-avoid">
                    <h2 className="text-xl font-bold mb-3 uppercase tracking-wide flex items-center gap-2" style={{ color: primaryColor }}>
                        <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: primaryColor }}></div>
                        Education
                    </h2>
                    <div className="pl-4 space-y-4">
                        {content.education.map((edu) => (
                            <div key={edu.id} className="border-l-2 pl-4" style={{ borderColor: `${primaryColor}33` }}>
                                <div className="flex justify-between items-start mb-1">
                                    <div>
                                        <h3 className="font-bold text-base text-gray-900">{edu.degree || "Degree"}</h3>
                                        <p className="text-sm text-gray-600">{edu.institution || "Institution"}</p>
                                        {edu.location && <p className="text-xs text-gray-500">{edu.location}</p>}
                                    </div>
                                    <span className="text-sm text-gray-600 font-medium">
                                        {edu.startDate} - {edu.endDate}
                                    </span>
                                </div>
                                {edu.gpa && <p className="text-sm font-semibold" style={{ color: primaryColor }}>GPA: {edu.gpa}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Experience */}
            {content.experience && content.experience.length > 0 && (
                <div className="mb-6 break-inside-avoid">
                    <h2 className="text-xl font-bold mb-3 uppercase tracking-wide flex items-center gap-2" style={{ color: primaryColor }}>
                        <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: primaryColor }}></div>
                        Experience
                    </h2>
                    <div className="pl-4 space-y-6">
                        {content.experience.map((exp) => (
                            <div key={exp.id} className="border-l-2 pl-4" style={{ borderColor: `${primaryColor}33` }}>
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

            {/* Projects */}
            {content.projects && content.projects.length > 0 && (
                <div className="mb-6 break-inside-avoid">
                    <h2 className="text-xl font-bold mb-3 uppercase tracking-wide flex items-center gap-2" style={{ color: primaryColor }}>
                        <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: primaryColor }}></div>
                        Projects
                    </h2>
                    <div className="pl-4 space-y-4">
                        {content.projects.map((proj) => (
                            <div key={proj.id} className="border-l-2 pl-4" style={{ borderColor: `${primaryColor}33` }}>
                                <h3 className="font-bold text-base text-gray-900">{proj.name}</h3>
                                <p className="text-sm text-gray-700 mb-2">{proj.description}</p>
                                {proj.technologies && proj.technologies.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                        {proj.technologies.map((tech, idx) => (
                                            <span key={idx} className="text-xs px-2 py-0.5 rounded font-medium" style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}>
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
    )
}

// Classic Template with Dynamic Color support
function ClassicTemplate({ content, styles }: { content: ResumeContent; styles: any }) {
    const primaryColor = styles.primary;
    return (
        <div className="bg-white p-12 min-h-[297mm] font-serif">
            {/* Header */}
            {content.personalInfo && (
                <div className="text-center mb-8 pb-6 border-b-2" style={{ borderColor: primaryColor }}>
                    {/* Profile Picture */}
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

                    {/* Contact Info */}
                    <div className="text-sm space-y-1 mb-3">
                        <div className="flex justify-center items-center gap-2">
                            {content.personalInfo.email && <span>{content.personalInfo.email}</span>}
                            {content.personalInfo.phone && <><span>|</span><span>{content.personalInfo.phone}</span></>}
                            {content.personalInfo.location && <><span>|</span><span>{content.personalInfo.location}</span></>}
                        </div>
                    </div>

                    {/* Social Links */}
                    {(content.personalInfo.linkedin || content.personalInfo.portfolio || content.personalInfo.github) && (
                        <div className="text-sm space-y-1">
                            {content.personalInfo.linkedin && (
                                <div className="flex justify-center items-center gap-2">
                                    <Linkedin className="w-3 h-3" />
                                    <span>{content.personalInfo.linkedin}</span>
                                </div>
                            )}
                            {content.personalInfo.portfolio && (
                                <div className="flex justify-center items-center gap-2">
                                    <Globe className="w-3 h-3" />
                                    <span>{content.personalInfo.portfolio}</span>
                                </div>
                            )}
                            {content.personalInfo.github && (
                                <div className="flex justify-center items-center gap-2">
                                    <Github className="w-3 h-3" />
                                    <span>{content.personalInfo.github}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Summary */}
            {content.summary && (
                <div className="mb-5 break-inside-avoid">
                    <h2 className="text-lg font-bold mb-2 border-b border-gray-400 pb-1">
                        PROFESSIONAL SUMMARY
                    </h2>
                    <p className="text-sm leading-relaxed">{content.summary}</p>
                </div>
            )}

            {/* Education */}
            {content.education && content.education.length > 0 && (
                <div className="mb-5 break-inside-avoid">
                    <h2 className="text-lg font-bold mb-2 border-b border-gray-400 pb-1">
                        EDUCATION
                    </h2>
                    {content.education.map((edu) => (
                        <div key={edu.id} className="mb-2">
                            <div className="flex justify-between">
                                <strong className="text-sm">{edu.degree || "Degree"}</strong>
                                <span className="text-xs">{edu.startDate} - {edu.endDate}</span>
                            </div>
                            <div className="italic text-sm">{edu.institution || "Institution"}</div>
                            {edu.gpa && <div className="text-xs">GPA: {edu.gpa}</div>}
                        </div>
                    ))}
                </div>
            )}

            {/* Experience */}
            {content.experience && content.experience.length > 0 && (
                <div className="mb-5 break-inside-avoid">
                    <h2 className="text-lg font-bold mb-2 border-b border-gray-400 pb-1">
                        PROFESSIONAL EXPERIENCE
                    </h2>
                    {content.experience.map((exp) => (
                        <div key={exp.id} className="mb-3">
                            <div className="flex justify-between">
                                <strong className="text-sm">{exp.title || "Job Title"}</strong>
                                <span className="text-xs">{exp.startDate} - {exp.current ? "Present" : exp.endDate}</span>
                            </div>
                            <div className="italic text-sm mb-1">{exp.company || "Company Name"}</div>
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

            {/* Projects */}
            {content.projects && content.projects.length > 0 && (
                <div className="mb-5 break-inside-avoid">
                    <h2 className="text-lg font-bold mb-2 border-b border-gray-400 pb-1">
                        PROJECTS
                    </h2>
                    {content.projects.map((proj) => (
                        <div key={proj.id} className="mb-2">
                            <strong className="text-sm">{proj.name}</strong>
                            <p className="text-xs">{proj.description}</p>
                            {proj.technologies && proj.technologies.length > 0 && (
                                <p className="text-xs text-gray-600">Tech: {proj.technologies.join(', ')}</p>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Skills */}
            {content.skills && content.skills.length > 0 && (
                <div>
                    <h2 className="text-lg font-bold mb-2 border-b border-gray-400 pb-1">
                        SKILLS
                    </h2>
                    <p className="text-sm">{content.skills.join(', ')}</p>
                </div>
            )}
        </div>
    )
}

// Minimal Template with Dynamic Color support
function MinimalTemplate({ content, styles }: TemplateSubProps) {
    const primaryColor = styles.primary;
    return (
        <div className="bg-white p-12 min-h-[297mm] font-sans">
            {/* Header */}
            {content.personalInfo && (
                <div className="mb-10">
                    <div className="flex items-start gap-6 mb-4">
                        {content.personalInfo.profilePicture && (
                            <img
                                src={content.personalInfo.profilePicture}
                                alt={content.personalInfo.fullName}
                                className="w-20 h-20 rounded-full object-cover"
                            />
                        )}
                        <div className="flex-1">
                            <h1 className="text-5xl font-light mb-3">
                                {content.personalInfo.fullName || "Your Name"}
                            </h1>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                        {content.personalInfo.email && <span>✉ {content.personalInfo.email}</span>}
                        {content.personalInfo.phone && <span>☎ {content.personalInfo.phone}</span>}
                        {content.personalInfo.location && <span>📍 {content.personalInfo.location}</span>}
                        {content.personalInfo.linkedin && <span>🔗 {content.personalInfo.linkedin}</span>}
                        {content.personalInfo.portfolio && <span>🌐 {content.personalInfo.portfolio}</span>}
                        {content.personalInfo.github && <span>💻 {content.personalInfo.github}</span>}
                    </div>
                </div>
            )}

            {/* Summary */}
            {content.summary && (
                <div className="mb-8 break-inside-avoid">
                    <p className="text-sm leading-relaxed text-gray-700">{content.summary}</p>
                </div>
            )}

            {/* Education */}
            {content.education && content.education.length > 0 && (
                <div className="mb-8 break-inside-avoid">
                    <h2 className="text-xs font-semibold mb-4 tracking-widest uppercase" style={{ color: primaryColor }}>
                        Education
                    </h2>
                    {content.education.map((edu) => (
                        <div key={edu.id} className="mb-3">
                            <div className="flex justify-between">
                                <h3 className="font-medium text-sm">{edu.degree || "Degree"}</h3>
                                <span className="text-xs text-gray-500">{edu.startDate} - {edu.endDate}</span>
                            </div>
                            <p className="text-xs text-gray-600">{edu.institution || "Institution"}</p>
                            {edu.gpa && <p className="text-xs text-gray-500">GPA: {edu.gpa}</p>}
                        </div>
                    ))}
                </div>
            )}

            {/* Experience */}
            {content.experience && content.experience.length > 0 && (
                <div className="mb-8 break-inside-avoid">
                    <h2 className="text-xs font-semibold text-gray-400 mb-4 tracking-widest uppercase">
                        Experience
                    </h2>
                    {content.experience.map((exp) => (
                        <div key={exp.id} className="mb-5">
                            <div className="flex justify-between mb-1">
                                <h3 className="font-medium text-sm">{exp.title || "Job Title"}</h3>
                                <span className="text-xs text-gray-500">
                                    {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                                </span>
                            </div>
                            <p className="text-xs text-gray-600 mb-2">{exp.company || "Company Name"}</p>
                            {exp.description && exp.description.length > 0 && (
                                <ul className="space-y-1 text-xs text-gray-700">
                                    {exp.description.filter(Boolean).map((item, idx) => (
                                        <li key={idx} className="pl-4 relative before:content-['—'] before:absolute before:left-0">
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Projects */}
            {content.projects && content.projects.length > 0 && (
                <div className="mb-8 break-inside-avoid">
                    <h2 className="text-xs font-semibold text-gray-400 mb-4 tracking-widest uppercase">
                        Projects
                    </h2>
                    {content.projects.map((proj) => (
                        <div key={proj.id} className="mb-4">
                            <h3 className="font-medium text-sm">{proj.name}</h3>
                            <p className="text-xs text-gray-700">{proj.description}</p>
                            {proj.technologies && proj.technologies.length > 0 && (
                                <p className="text-xs text-gray-500 mt-1">{proj.technologies.join(' • ')}</p>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Skills */}
            {content.skills && content.skills.length > 0 && (
                <div>
                    <h2 className="text-xs font-semibold text-gray-400 mb-4 tracking-widest uppercase">
                        Skills
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {content.skills.map((skill, idx) => (
                            <span key={idx} className="text-xs px-2 py-1 bg-gray-100 text-gray-700">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

// Creative Template - Dynamic Color / Gradient support
function CreativeTemplate({ content, styles }: { content: ResumeContent; styles: any }) {
    const { primary, secondary, isGradient } = styles;
    const headerStyle = isGradient
        ? { background: `linear-gradient(to right, ${primary}, ${secondary})` }
        : { backgroundColor: primary };

    return (
        <div className="bg-white min-h-[297mm] font-sans">
            {/* Header with colored background and profile picture */}
            {content.personalInfo && (
                <div className="mb-8 p-8 text-white shadow-md" style={headerStyle}>
                    <div className="flex items-center gap-6">
                        {content.personalInfo.profilePicture && (
                            <img
                                src={content.personalInfo.profilePicture}
                                alt={content.personalInfo.fullName}
                                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                            />
                        )}
                        <div className="flex-1">
                            <h1 className="text-4xl font-bold mb-3">
                                {content.personalInfo.fullName || "Your Name"}
                            </h1>
                            <div className="grid grid-cols-2 gap-2 text-sm opacity-95">
                                {content.personalInfo.email && (
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4" />
                                        <span>{content.personalInfo.email}</span>
                                    </div>
                                )}
                                {content.personalInfo.phone && (
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4" />
                                        <span>{content.personalInfo.phone}</span>
                                    </div>
                                )}
                                {content.personalInfo.location && (
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        <span>{content.personalInfo.location}</span>
                                    </div>
                                )}
                                {content.personalInfo.linkedin && (
                                    <div className="flex items-center gap-2">
                                        <Linkedin className="w-4 h-4" />
                                        <span>{content.personalInfo.linkedin}</span>
                                    </div>
                                )}
                                {content.personalInfo.portfolio && (
                                    <div className="flex items-center gap-2">
                                        <Globe className="w-4 h-4" />
                                        <span>{content.personalInfo.portfolio}</span>
                                    </div>
                                )}
                                {content.personalInfo.github && (
                                    <div className="flex items-center gap-2">
                                        <Github className="w-4 h-4" />
                                        <span>{content.personalInfo.github}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="px-8 pb-8">
                {/* Summary */}
                {content.summary && (
                    <div className="mb-6 break-inside-avoid">
                        <h2 className="text-xl font-bold mb-3" style={{ color: primary }}>About Me</h2>
                        <p className="text-sm leading-relaxed">{content.summary}</p>
                    </div>
                )}

                {/* Skills */}
                {content.skills && content.skills.length > 0 && (
                    <div className="mb-6 break-inside-avoid">
                        <h2 className="text-xl font-bold mb-3" style={{ color: primary }}>Skills</h2>
                        <div className="flex flex-wrap gap-2">
                            {content.skills.map((skill, idx) => (
                                <span key={idx} className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: secondary + '33', color: primary }}>
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Education */}
                {content.education && content.education.length > 0 && (
                    <div className="mb-6 break-inside-avoid">
                        <h2 className="text-xl font-bold mb-3" style={{ color: primary }}>Education</h2>
                        {content.education.map((edu) => (
                            <div key={edu.id} className="mb-3 pl-4 border-l-4" style={{ borderColor: secondary }}>
                                <div className="flex justify-between">
                                    <h3 className="font-bold text-base">{edu.degree}</h3>
                                    <span className="text-sm text-gray-600">{edu.startDate} - {edu.endDate}</span>
                                </div>
                                <p className="text-sm text-gray-700">{edu.institution}</p>
                                {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
                            </div>
                        ))}
                    </div>
                )}

                {/* Experience */}
                {content.experience && content.experience.length > 0 && (
                    <div className="mb-6 break-inside-avoid">
                        <h2 className="text-xl font-bold mb-3" style={{ color: primary }}>Experience</h2>
                        {content.experience.map((exp) => (
                            <div key={exp.id} className="mb-4 pl-4 border-l-4" style={{ borderColor: secondary }}>
                                <div className="flex justify-between mb-1">
                                    <h3 className="font-bold text-base">{exp.title}</h3>
                                    <span className="text-sm text-gray-600">{exp.startDate} - {exp.current ? "Present" : exp.endDate}</span>
                                </div>
                                <p className="text-sm text-gray-700 mb-2">{exp.company}</p>
                                {exp.description && exp.description.length > 0 && (
                                    <ul className="list-disc ml-5 text-sm space-y-1">
                                        {exp.description.filter(Boolean).map((item, idx) => (
                                            <li key={idx}>{item}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Projects */}
                {content.projects && content.projects.length > 0 && (
                    <div className="mb-6 break-inside-avoid">
                        <h2 className="text-xl font-bold text-purple-600 mb-3">Projects</h2>
                        {content.projects.map((proj) => (
                            <div key={proj.id} className="mb-4 p-4 bg-purple-50 rounded-lg">
                                <h3 className="font-bold text-base text-purple-900">{proj.name}</h3>
                                <p className="text-sm mb-2">{proj.description}</p>
                                {proj.technologies && proj.technologies.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                        {proj.technologies.map((tech, idx) => (
                                            <span key={idx} className="text-xs px-2 py-0.5 bg-purple-200 text-purple-800 rounded">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

// ATS Optimized Template - Clean Black & White
function ATSTemplate({ content }: TemplateSubProps) {
    return (
        <div className="bg-white p-10 min-h-[297mm] font-sans text-gray-900 leading-normal resume-container">
            {/* Header */}
            {content.personalInfo && (
                <div className="text-center mb-6 pt-4 border-b-2 border-black pb-4">
                    <h1 className="text-3xl font-bold uppercase tracking-widest mb-2">
                        {content.personalInfo.fullName?.toUpperCase() || "YOUR NAME"}
                    </h1>
                    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm">
                        {content.personalInfo.email && <span>{content.personalInfo.email}</span>}
                        {content.personalInfo.phone && <span>• {content.personalInfo.phone}</span>}
                        {content.personalInfo.location && <span>• {content.personalInfo.location}</span>}
                    </div>
                </div>
            )}

            {/* Content Flow */}
            <div className="space-y-6">
                {/* Summary */}
                {content.summary && (
                    <div className="no-break border-b border-gray-200 pb-2">
                        <h2 className="text-xs font-bold uppercase tracking-wider mb-2 text-black">Professional Summary</h2>
                        <p className="text-sm">{content.summary}</p>
                    </div>
                )}

                {/* Experience */}
                {content.experience && content.experience.length > 0 && (
                    <div className="no-break border-b border-gray-200 pb-2">
                        <h2 className="text-xs font-bold uppercase tracking-wider mb-2 text-black">Experience</h2>
                        <div className="space-y-4">
                            {content.experience.map((exp) => (
                                <div key={exp.id} className="no-break">
                                    <div className="flex justify-between items-baseline mb-0.5">
                                        <h3 className="font-bold text-base capitalize">{exp.title}</h3>
                                        <span className="text-sm font-medium">{exp.startDate} – {exp.current ? "Present" : exp.endDate}</span>
                                    </div>
                                    <p className="text-sm italic mb-2 text-gray-600 capitalize">{exp.company}</p>
                                    <ul className="list-disc ml-5 text-sm space-y-1">
                                        {exp.description.filter(Boolean).map((item, idx) => (
                                            <li key={idx}>
                                                {item.charAt(0).toUpperCase() + item.slice(1)}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Education */}
                {content.education && content.education.length > 0 && (
                    <div className="no-break border-b border-gray-200 pb-2">
                        <h2 className="text-xs font-bold uppercase tracking-wider mb-2 text-black">Education</h2>
                        <div className="space-y-2">
                            {content.education.map((edu) => (
                                <div key={edu.id} className="no-break">
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="font-bold text-sm capitalize">{edu.degree}</h3>
                                        <span className="text-sm font-medium">{edu.startDate} – {edu.endDate}</span>
                                    </div>
                                    <p className="text-sm italic text-gray-600 capitalize">{edu.institution}</p>
                                    {edu.gpa && <p className="text-sm">GPA: {edu.gpa}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Projects */}
                {content.projects && content.projects.length > 0 && (
                    <div className="no-break border-b border-gray-200 pb-2">
                        <h2 className="text-xs font-bold uppercase tracking-wider mb-2 text-black">Projects</h2>
                        <div className="space-y-3">
                            {content.projects.map((proj) => (
                                <div key={proj.id} className="no-break">
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="font-bold text-sm capitalize">{proj.name}</h3>
                                    </div>
                                    <p className="text-sm mb-1">{proj.description}</p>
                                    {proj.technologies && proj.technologies.length > 0 && (
                                        <p className="text-xs text-gray-500 font-medium">Keywords: {proj.technologies.join(', ')}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Skills Section - ATS Style */}
                {content.skills && content.skills.length > 0 && (
                    <div className="no-break">
                        <h2 className="text-xs font-bold uppercase tracking-wider mb-2 text-black">Technical Skills</h2>
                        <p className="text-sm">
                            <span className="font-bold">Languages & Tools: </span>
                            {content.skills.join(', ')}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
