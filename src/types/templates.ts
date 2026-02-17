export interface Template {
    id: string
    name: string
    description: string
    preview: string
    category: 'professional' | 'creative' | 'modern' | 'minimal' | 'executive' | 'ats'
    color: string
    isPremium: boolean
}

export const RESUME_TEMPLATES: Template[] = [
    // FREE TEMPLATES (4)
    {
        id: 'ats-basic',
        name: 'ATS Basic',
        description: 'Ultra-clean, single-column design optimized for ATS (Applicant Tracking Systems)',
        preview: '/templates/ats-basic.png',
        category: 'ats',
        color: '#1A1A1A',
        isPremium: false
    },
    {
        id: 'modern-blue',
        name: 'Modern Blue',
        description: 'Clean and contemporary design with blue accents, perfect for tech professionals',
        preview: '/templates/modern-blue.png',
        category: 'modern',
        color: '#3B82F6',
        isPremium: false
    },
    {
        id: 'classic-black',
        name: 'Classic Black',
        description: 'Traditional black and white format, ideal for corporate and executive roles',
        preview: '/templates/classic-black.png',
        category: 'professional',
        color: '#000000',
        isPremium: false
    },
    {
        id: 'minimalist-gray',
        name: 'Minimalist Gray',
        description: 'A quiet, sophisticated design for those who value simplicity',
        preview: '/templates/minimalist-gray.png',
        category: 'minimal',
        color: '#4B5563',
        isPremium: false
    },
    // PRO TEMPLATES (8)
    {
        id: 'executive-navy',
        name: 'Executive Navy',
        description: 'Sophisticated navy blue design for senior executives and managers',
        preview: '/templates/executive-navy.png',
        category: 'executive',
        color: '#1E40AF',
        isPremium: true
    },
    {
        id: 'creative-purple',
        name: 'Creative Purple',
        description: 'Eye-catching purple design for creative professionals and designers',
        preview: '/templates/creative-purple.png',
        category: 'creative',
        color: '#9333EA',
        isPremium: true
    },
    {
        id: 'tech-startup-cyan',
        name: 'Tech Startup Cyan',
        description: 'Vibrant and energetic design for the fast-paced tech world',
        preview: '/templates/tech-startup-cyan.png',
        category: 'modern',
        color: '#06B6D4',
        isPremium: true
    },
    {
        id: 'academic-emerald',
        name: 'Academic Emerald',
        description: 'Structured Emerald theme for researchers and academics',
        preview: '/templates/academic-emerald.png',
        category: 'professional',
        color: '#059669',
        isPremium: true
    },
    {
        id: 'elegant-gold',
        name: 'Elegant Gold',
        description: 'Premium gold accents for high-profile executive positions',
        preview: '/templates/elegant-gold.png',
        category: 'executive',
        color: '#D4AF37',
        isPremium: true
    },
    {
        id: 'fresher-teal',
        name: 'Fresher Teal',
        description: 'Optimized layout to highlight skills and projects for newcomers',
        preview: '/templates/fresher-teal.png',
        category: 'modern',
        color: '#14B8A6',
        isPremium: true
    },
    {
        id: 'marketing-orange',
        name: 'Marketing Orange',
        description: 'Bold orange theme designed to grab attention in sales and marketing',
        preview: '/templates/marketing-orange.png',
        category: 'creative',
        color: '#F97316',
        isPremium: true
    },
    {
        id: 'lawyer-maroon',
        name: 'Lawyer Maroon',
        description: 'Formal and authoritative maroon design for legal and law professionals',
        preview: '/templates/lawyer-maroon.png',
        category: 'professional',
        color: '#7F1D1D',
        isPremium: true
    }
]

export function getTemplateById(id: string): Template | undefined {
    return RESUME_TEMPLATES.find(t => t.id === id)
}

export function getFreeTemplates(): Template[] {
    return RESUME_TEMPLATES.filter(t => !t.isPremium)
}

export function getPremiumTemplates(): Template[] {
    return RESUME_TEMPLATES.filter(t => t.isPremium)
}

export function getTemplatesByCategory(category: Template['category']): Template[] {
    return RESUME_TEMPLATES.filter(t => t.category === category)
}
