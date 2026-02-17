import { supabase } from '@/lib/supabase'

export interface Profile {
    id: string
    email: string
    created_at: string
    updated_at: string | null
    is_pro: boolean
    full_name: string | null
    phone: string | null
    location: string | null
}

export const profileService = {
    async getProfile() {
        // Get current checking user ID
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.user) return null

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()

        if (error) throw error
        return data as Profile
    }
}
