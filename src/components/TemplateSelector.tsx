import { useState } from 'react'
import { RESUME_TEMPLATES, type Template } from '@/types/templates'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, Crown, Lock } from 'lucide-react'
import { useProfile } from '@/hooks/useProfile'
import { toast } from 'sonner'

interface TemplateSelectorProps {
    onSelect: (templateId: string) => void
    selectedTemplateId?: string
}

export function TemplateSelector({ onSelect, selectedTemplateId }: TemplateSelectorProps) {
    const [filter, setFilter] = useState<'all' | 'free' | 'premium'>('all')
    const { data: profile, isLoading } = useProfile()
    const isPro = profile?.is_pro || false

    const filteredTemplates = RESUME_TEMPLATES.filter(template => {
        if (filter === 'free') return !template.isPremium
        if (filter === 'premium') return template.isPremium
        return true
    })

    const handleSelect = (template: Template) => {
        if (template.isPremium && !isPro) {
            toast.error("This is a Premium template. Please upgrade to Pro to use it.", {
                action: {
                    label: "Upgrade",
                    onClick: () => window.open('https://wa.me/918270374293?text=Hi!%20I\'m%20interested%20in%20upgrading%20to%20KS%20Resume%20Bilder%20Pro%20Plan', '_blank')
                }
            })
            return
        }
        onSelect(template.id)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold">Choose Your Template</h2>
                <p className="text-muted-foreground">
                    Select a professional template to get started
                </p>
                {!isLoading && !isPro && (
                    <div className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full inline-block">
                        Free Plan Active • 6 Free Templates Available
                    </div>
                )}
            </div>

            {/* Filter Buttons */}
            <div className="flex justify-center gap-2">
                <Button
                    variant={filter === 'all' ? 'default' : 'outline'}
                    onClick={() => setFilter('all')}
                    size="sm"
                >
                    All Templates
                </Button>
                <Button
                    variant={filter === 'free' ? 'default' : 'outline'}
                    onClick={() => setFilter('free')}
                    size="sm"
                >
                    Free
                </Button>
                <Button
                    variant={filter === 'premium' ? 'default' : 'outline'}
                    onClick={() => setFilter('premium')}
                    size="sm"
                >
                    <Crown className="w-4 h-4 mr-1" />
                    Premium
                </Button>
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {filteredTemplates.map((template) => (
                    <TemplateCard
                        key={template.id}
                        template={template}
                        isSelected={selectedTemplateId === template.id}
                        isPro={isPro}
                        onSelect={() => handleSelect(template)}
                    />
                ))}
            </div>
        </div>
    )
}

interface TemplateCardProps {
    template: Template
    isSelected: boolean
    isPro: boolean
    onSelect: () => void
}

function TemplateMockup({ category, color }: { category: string; color: string }) {
    return (
        <div className="absolute inset-0 p-3 bg-slate-900 flex flex-col gap-2 select-none pointer-events-none transition-transform duration-300 group-hover:scale-105 border-b border-slate-800">
            {/* Header Mock */}
            {category === 'creative' && (
                <div className="h-10 rounded flex items-center px-2 gap-2" style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}>
                    <div className="w-5 h-5 rounded-full bg-white/20 shrink-0" />
                    <div className="flex-1 flex flex-col gap-1">
                        <div className="w-10 h-1 bg-white/40 rounded" />
                        <div className="w-16 h-0.5 bg-white/25 rounded" />
                    </div>
                </div>
            )}
            {category === 'executive' && (
                <div className="flex-1 flex gap-2">
                    {/* Left Sidebar */}
                    <div className="w-10 rounded p-1 flex flex-col gap-1.5 shrink-0" style={{ backgroundColor: color }}>
                        <div className="w-4 h-4 rounded-full bg-white/20 mx-auto shrink-0" />
                        <div className="flex flex-col gap-1 items-center">
                            <div className="w-6 h-0.5 bg-white/40 rounded" />
                            <div className="w-6 h-0.5 bg-white/30 rounded" />
                            <div className="w-6 h-0.5 bg-white/30 rounded" />
                        </div>
                    </div>
                    {/* Right Main */}
                    <div className="flex-1 flex flex-col gap-1.5 pt-1">
                        <div className="w-12 h-1 bg-white/20 rounded" />
                        <div className="w-full flex flex-col gap-1">
                            <div className="w-full h-0.5 bg-white/10 rounded" />
                            <div className="w-11/12 h-0.5 bg-white/10 rounded" />
                            <div className="w-10/12 h-0.5 bg-white/10 rounded" />
                        </div>
                    </div>
                </div>
            )}
            {category === 'modern' && (
                <div className="flex-1 flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 border-b border-slate-800 pb-1.5">
                        <div className="w-12 h-1.5 bg-white/30 rounded" style={{ backgroundColor: color }} />
                        <div className="ml-auto w-4 h-4 rounded-full bg-white/10 shrink-0" />
                    </div>
                    <div className="flex gap-2">
                        <div className="flex-1 flex flex-col gap-1">
                            <div className="w-10 h-1 bg-white/20 rounded" />
                            <div className="w-full h-0.5 bg-white/10 rounded" />
                            <div className="w-11/12 h-0.5 bg-white/10 rounded" />
                        </div>
                        <div className="w-12 flex flex-col gap-1 shrink-0">
                            <div className="w-8 h-1 bg-white/20 rounded" />
                            <div className="w-full h-0.5 bg-white/10 rounded" style={{ backgroundColor: color + '25' }} />
                        </div>
                    </div>
                </div>
            )}
            {category === 'minimal' && (
                <div className="flex-1 flex flex-col gap-1.5 pt-1">
                    <div className="w-16 h-1.5 bg-white/30 rounded" />
                    <div className="w-full border-t border-slate-800 my-1" />
                    <div className="flex flex-col gap-1">
                        <div className="w-12 h-1 bg-white/20 rounded" />
                        <div className="w-full h-0.5 bg-white/10 rounded" />
                        <div className="w-11/12 h-0.5 bg-white/10 rounded" />
                    </div>
                </div>
            )}
            {category === 'professional' && (
                <div className="flex-1 flex flex-col gap-1.5 items-center text-center pt-1">
                    <div className="w-4 h-4 rounded-full bg-white/15 border border-white/10 shrink-0" />
                    <div className="w-12 h-1 bg-white/30 rounded" />
                    <div className="w-20 h-0.5 bg-white/15 rounded" />
                    <div className="w-full border-t border-slate-800 my-1" />
                    <div className="w-full flex flex-col gap-1 items-start text-left">
                        <div className="w-10 h-0.5 bg-white/20 rounded" />
                        <div className="w-11/12 h-0.5 bg-white/10 rounded" />
                    </div>
                </div>
            )}
            {category === 'ats' && (
                <div className="flex-1 flex flex-col gap-1.5 pt-1 border border-dashed border-slate-800 rounded p-1 bg-slate-950/60">
                    <div className="w-12 h-1.5 bg-white/30 rounded" />
                    <div className="w-full border-t border-slate-900" />
                    <div className="flex flex-col gap-1">
                        <div className="w-10 h-0.5 bg-white/20 rounded" />
                        <div className="w-full h-0.5 bg-white/10 rounded" />
                    </div>
                </div>
            )}

            {/* Default bottom indicators */}
            {category !== 'executive' && (
                <div className="flex-1 flex flex-col gap-1 justify-end">
                    <div className="w-full h-0.5 bg-white/5 rounded" />
                    <div className="w-10/12 h-0.5 bg-white/5 rounded" />
                </div>
            )}
        </div>
    )
}

function TemplateCard({ template, isSelected, isPro, onSelect }: TemplateCardProps) {
    const isLocked = template.isPremium && !isPro

    return (
        <Card
            className={`relative cursor-pointer transition-all hover:shadow-lg group overflow-hidden border-slate-900 bg-slate-950/40
                ${isSelected ? 'ring-2 ring-primary shadow-lg' : ''}
                ${isLocked ? 'opacity-75 hover:opacity-100' : ''}
            `}
            onClick={onSelect}
        >
            {/* Premium Badge / Lock Icon */}
            {template.isPremium && (
                <div className="absolute top-2 right-2 z-30">
                    {isLocked ? (
                        <Badge variant="destructive" className="gap-1 bg-red-900/80 text-white border-red-800">
                            <Lock className="w-3 h-3" />
                            Pro
                        </Badge>
                    ) : (
                        <Badge variant="secondary" className="gap-1 bg-indigo-950 text-indigo-400 border-indigo-900">
                            <Crown className="w-3 h-3" />
                            Pro
                        </Badge>
                    )}
                </div>
            )}

            {/* Selected Indicator */}
            {isSelected && (
                <div className="absolute top-2 left-2 z-30 bg-primary text-primary-foreground rounded-full p-1 shadow-md">
                    <Check className="w-3.5 h-3.5" />
                </div>
            )}

            {/* Template Preview */}
            <div className="h-48 rounded-t-lg relative overflow-hidden bg-slate-905 border-b border-slate-900">
                <TemplateMockup category={template.category} color={template.color} />

                {isLocked && (
                    <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-[1.5px] flex items-center justify-center z-20">
                        <Lock className="w-8 h-8 text-white/70" />
                    </div>
                )}

                {/* Banner overlay with name */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent p-3 pt-6 z-10 flex flex-col items-start">
                    <span 
                        className="inline-block text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/10 mb-1 border border-white/5"
                        style={{ color: template.color }}
                    >
                        {template.category}
                    </span>
                    <h4 className="text-sm font-bold text-white leading-tight">
                        {template.name}
                    </h4>
                </div>
            </div>

            {/* Template Info */}
            <div className="p-4 space-y-2">
                <h3 className="font-semibold text-sm text-slate-200">{template.name}</h3>
                <p className="text-xs text-slate-400 line-clamp-2">
                    {template.description}
                </p>
                {isLocked && (
                    <p className="text-xs text-indigo-400 font-medium">Click to Upgrade</p>
                )}
            </div>
        </Card>
    )
}
