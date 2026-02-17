import { useQuery } from '@tanstack/react-query'
import { profileService, type Profile } from '@/services/profile'
import { useAuth } from '@/context/AuthContext'

export function useProfile() {
    const { user } = useAuth()

    return useQuery<Profile | null>({
        queryKey: ['profile', user?.id],
        queryFn: async () => {
            if (!user) return null
            return await profileService.getProfile()
        },
        enabled: !!user,
        staleTime: 1000 * 60 * 5, // 5 minutes
    })
}
