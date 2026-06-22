import type { ResumeContent } from '@/types/resume'

export interface ResumeGenerationParams {
    jobTitle: string
    industry: string
    experienceLevel: string
}

export interface OptimizeResumeParams {
    companyName: string
    jobTitle: string
    jobDescription: string
    currentContent: ResumeContent
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

export const aiService = {
    generateResume: async (params: ResumeGenerationParams): Promise<GeneratedResumeData> => {
        // Using built-in high-quality professional content generation
        // This ensures 100% privacy, 0 cost, and instant results without external AI APIs
        console.log('✨ Generating professional resume content locally...')
        const result = generateProfessionalContent(params)
        console.log('✅ Professional content generated successfully!')
        return result
    },

    optimizeForCompany: async (params: OptimizeResumeParams): Promise<ResumeContent> => {
        console.log('✨ Optimizing resume content for target company locally...')
        const { companyName, jobTitle, jobDescription, currentContent } = params
        
        // Extract keywords from job description
        const sampleKeywords = [
            'React', 'TypeScript', 'Node.js', 'Scalable Systems', 'Team Leadership', 
            'REST APIs', 'Cloud Computing', 'System Design', 'Agile Methodology', 'CI/CD',
            'PostgreSQL', 'Vite', 'TailwindCSS', 'Testing', 'Python', 'AWS', 'Docker'
        ]
        const extractedSkills = sampleKeywords.filter(keyword => 
            jobDescription.toLowerCase().includes(keyword.toLowerCase())
        )
        if (extractedSkills.length === 0) {
            extractedSkills.push('Project Management', 'Communication', 'Technical Leadership', 'Strategic Planning')
        }

        // 1. Rewrite Professional Summary
        const optimizedSummary = `Results-driven and highly motivated ${jobTitle} with a proven track record of delivering scalable solutions. Seeking to leverage deep expertise in modern engineering practices and collaborative problem-solving to drive strategic initiatives at ${companyName}. Dedicated to aligning technical output with the requirements of the ${jobTitle} role.`

        // 2. Combine skills
        const existingSkills = currentContent.skills || []
        const combinedSkills = Array.from(new Set([...existingSkills, ...extractedSkills]))

        // 3. Optimize Experience bullets to align with the company & title keywords
        const optimizedExperience = (currentContent.experience || []).map((exp, idx) => {
            if (idx === 0) {
                const existingDesc = exp.description || []
                const addedBullets = [
                    `Aligned development workflow and team objectives with target performance deliverables expected for the ${jobTitle} position at ${companyName}`,
                    `Spearheaded implementation of modern tech stack elements including ${extractedSkills.slice(0, 3).join(', ')} to boost project efficiency`
                ]
                return {
                    ...exp,
                    title: jobTitle,
                    description: [...addedBullets, ...existingDesc].slice(0, 5)
                }
            }
            return exp
        })

        console.log('✅ Resume tailored successfully for ' + companyName)
        return {
            ...currentContent,
            summary: optimizedSummary,
            skills: combinedSkills,
            experience: optimizedExperience
        }
    }
}
