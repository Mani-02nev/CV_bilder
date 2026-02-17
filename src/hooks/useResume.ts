import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { resumeService } from '@/services/resume'
import type { Resume, ResumeContent } from '@/types/resume'

export function useResumes() {
    return useQuery({
        queryKey: ['resumes'],
        queryFn: resumeService.getResumes,
    })
}

export function useResume(id: string) {
    return useQuery({
        queryKey: ['resume', id],
        queryFn: () => resumeService.getResume(id),
        enabled: !!id,
    })
}

export function useCreateResume() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ title, templateId }: { title: string; templateId?: string }) =>
            resumeService.createResume(title, templateId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['resumes'] })
        },
    })
}

export function useUpdateResume() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: Partial<Resume> }) =>
            resumeService.updateResume(id, updates),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['resumes'] })
            queryClient.invalidateQueries({ queryKey: ['resume', data.id] })
        },
    })
}

export function useUpdateResumeContent() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, content }: { id: string; content: ResumeContent }) =>
            resumeService.updateResumeContent(id, content),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['resume', data.id] })
        },
    })
}

export function useDeleteResume() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => resumeService.deleteResume(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['resumes'] })
        },
    })
}

export function useDuplicateResume() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => resumeService.duplicateResume(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['resumes'] })
        },
    })
}
