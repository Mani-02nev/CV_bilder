import { supabase } from '@/lib/supabase'
import type { Resume, ResumeContent } from '@/types/resume'

export const resumeService = {
    // Get all resumes for current user
    getResumes: async (): Promise<Resume[]> => {
        const { data, error } = await supabase
            .from('resumes')
            .select('*')
            .order('updated_at', { ascending: false })

        if (error) throw error
        return data || []
    },

    // Get single resume
    getResume: async (id: string): Promise<Resume | null> => {
        const { data, error } = await supabase
            .from('resumes')
            .select('*')
            .eq('id', id)
            .single()

        if (error) throw error
        return data
    },

    // Create new resume
    createResume: async (title: string, templateId: string = 'modern'): Promise<Resume> => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Not authenticated')

        const { data, error } = await supabase
            .from('resumes')
            .insert({
                user_id: user.id,
                title,
                template_id: templateId,
                content: {},
                status: 'draft'
            })
            .select()
            .single()

        if (error) throw error
        return data
    },

    // Update resume
    updateResume: async (id: string, updates: Partial<Resume>): Promise<Resume> => {
        const { data, error } = await supabase
            .from('resumes')
            .update({
                ...updates,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return data
    },

    // Update resume content
    updateResumeContent: async (id: string, content: ResumeContent): Promise<Resume> => {
        const { data, error } = await supabase
            .from('resumes')
            .update({
                content,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return data
    },

    // Delete resume
    deleteResume: async (id: string): Promise<void> => {
        const { error } = await supabase
            .from('resumes')
            .delete()
            .eq('id', id)

        if (error) throw error
    },

    // Duplicate resume
    duplicateResume: async (id: string): Promise<Resume> => {
        const original = await resumeService.getResume(id)
        if (!original) throw new Error('Resume not found')

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Not authenticated')

        const { data, error } = await supabase
            .from('resumes')
            .insert({
                user_id: user.id,
                title: `${original.title} (Copy)`,
                template_id: original.template_id,
                content: original.content,
                status: 'draft'
            })
            .select()
            .single()

        if (error) throw error
        return data
    }
}
