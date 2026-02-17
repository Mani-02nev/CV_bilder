export interface ResumeGenerationParams {
    jobTitle: string
    industry: string
    experienceLevel: string
}

export interface GeneratedResumeData {
    professionalSummary: string
    skills: string[]
    experience: {
        title: string
        company: string
        period: string
        description: string[]
    }[]
    projects: {
        name: string
        description: string
    }[]
}

const toTitleCase = (str: string) =>
    str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

// Professional content templates based on job details
function generateProfessionalContent(params: ResumeGenerationParams): GeneratedResumeData {
    const jobTitle = toTitleCase(params.jobTitle)
    const industry = toTitleCase(params.industry)
    const { experienceLevel } = params

    // Customize based on experience level
    const yearsMap = {
        'entry': '1-2',
        'mid': '3-5',
        'senior': '7+'
    }
    const years = yearsMap[experienceLevel as keyof typeof yearsMap] || '3-5'

    return {
        professionalSummary: `Results-driven ${jobTitle} with ${years} years of experience in ${industry}. Proven track record of delivering high-quality solutions and driving business growth through innovative approaches. Strong expertise in industry best practices, team collaboration, and strategic problem-solving.`,
        skills: [
            'Leadership & Team Management',
            'Strategic Planning',
            'Project Management',
            'Problem Solving',
            'Communication',
            'Technical Expertise',
            'Innovation & Creativity',
            'Data Analysis'
        ],
        experience: [
            {
                title: experienceLevel === 'entry' ? jobTitle : `Senior ${jobTitle}`,
                company: `${industry} Solutions Inc.`,
                period: experienceLevel === 'entry' ? '2023 - Present' : '2020 - Present',
                description: [
                    `Led cross-functional teams to deliver critical ${industry.toLowerCase()} projects on time and within budget`,
                    'Implemented innovative solutions that increased operational efficiency by 40%',
                    'Collaborated with stakeholders to identify opportunities and drive strategic initiatives',
                    'Mentored team members and fostered a culture of continuous improvement'
                ]
            },
            {
                title: experienceLevel === 'entry' ? `Junior ${jobTitle}` : jobTitle,
                company: `${industry} Innovations Corp`,
                period: experienceLevel === 'entry' ? '2022 - 2023' : '2018 - 2020',
                description: [
                    `Developed and executed ${industry.toLowerCase()} strategies aligned with business objectives`,
                    'Achieved 95% customer satisfaction through excellent service delivery',
                    'Contributed to revenue growth through process optimization and innovation',
                    'Collaborated with cross-functional teams to resolve complex challenges'
                ]
            }
        ],
        projects: [
            {
                name: `${industry} Digital Transformation Initiative`,
                description: `Led company-wide digital transformation project in ${industry.toLowerCase()}, modernizing legacy systems and improving operational efficiency by 35%`
            },
            {
                name: 'Customer Experience Enhancement Platform',
                description: `Designed and implemented customer-facing platform that increased engagement by 50% and reduced support tickets by 30%`
            }
        ]
    }
}

import { supabase } from "@/lib/supabase"

export const aiService = {
    generateResume: async (params: ResumeGenerationParams): Promise<GeneratedResumeData> => {
        try {
            console.log('✨ Attempting AI generation via Supabase...')

            const { data, error } = await supabase.functions.invoke('generate-resume', {
                body: params
            })

            if (error) {
                console.warn('⚠️ Supabase function error, falling back to local generator:', error)
                return generateProfessionalContent(params)
            }

            if (data && !data.error) {
                console.log('✅ AI generation successful via Supabase!')
                return data as GeneratedResumeData
            }

            console.warn('⚠️ AI generation returned error or empty data:', data?.error)
            return generateProfessionalContent(params)

        } catch (err) {
            console.error('❌ AI service exception, using local fallback:', err)
            return generateProfessionalContent(params)
        }
    }
}
