export interface Resume {
    id: string
    user_id: string
    title: string
    template_id: string
    content: ResumeContent
    status: 'draft' | 'published' | 'archived'
    created_at: string
    updated_at: string
}

export interface ResumeContent {
    personalInfo?: PersonalInfo
    summary?: string
    experience?: Experience[]
    education?: Education[]
    skills?: string[]
    projects?: Project[]
    certifications?: Certification[]
}

export interface PersonalInfo {
    fullName: string
    email: string
    phone: string
    location: string
    linkedin?: string
    portfolio?: string
    github?: string
    profilePicture?: string
}

export interface Experience {
    id: string
    title: string
    company: string
    location: string
    startDate: string
    endDate: string
    current: boolean
    description: string[]
}

export interface Education {
    id: string
    degree: string
    institution: string
    location: string
    startDate: string
    endDate: string
    gpa?: string
}

export interface Project {
    id: string
    name: string
    description: string
    technologies: string[]
    link?: string
}

export interface Certification {
    id: string
    name: string
    issuer: string
    date: string
    credentialId?: string
}

export interface UserProfile {
    id: string
    email: string
    role: 'user' | 'admin'
    plan: 'free' | 'pro' | 'premium'
    active: boolean
    created_at: string
    updated_at: string
}
