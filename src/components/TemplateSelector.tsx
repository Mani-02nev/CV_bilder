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
                    onClick: () => window.open('https://wa.me/918270374293?text=Hi!%20I\'m%20interested%20in%20upgrading%20to%20Pro%20plan', '_blank')
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
                        Free Plan Active • Upgrade for Premium Templates
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

function TemplateCard({ template, isSelected, isPro, onSelect }: TemplateCardProps) {
    const isLocked = template.isPremium && !isPro

    return (
        <Card
            className={`relative cursor-pointer transition-all hover:shadow-lg 
                ${isSelected ? 'ring-2 ring-primary shadow-lg' : ''}
                ${isLocked ? 'opacity-75 hover:opacity-100' : ''}
            `}
            onClick={onSelect}
        >
            {/* Premium Badge / Lock Icon */}
            {template.isPremium && (
                <div className="absolute top-2 right-2 z-10">
                    {isLocked ? (
                        <Badge variant="destructive" className="gap-1">
                            <Lock className="w-3 h-3" />
                            Pro
                        </Badge>
                    ) : (
                        <Badge variant="secondary" className="gap-1">
                            <Crown className="w-3 h-3" />
                            Pro
                        </Badge>
                    )}
                </div>
            )}

            {/* Selected Indicator */}
            {isSelected && (
                <div className="absolute top-2 left-2 z-10 bg-primary text-primary-foreground rounded-full p-1">
                    <Check className="w-4 h-4" />
                </div>
            )}

            {/* Template Preview */}
            <div
                className="h-48 rounded-t-lg flex items-center justify-center text-white font-bold text-lg relative overflow-hidden"
                style={{ backgroundColor: template.color }}
            >
                {isLocked && (
                    <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] flex items-center justify-center">
                        <Lock className="w-8 h-8 text-foreground/80" />
                    </div>
                )}

                <div className="text-center p-4">
                    <div className="text-sm opacity-90 mb-2">{template.category.toUpperCase()}</div>
                    <div className="text-2xl">{template.name}</div>
                </div>
            </div>

            {/* Template Info */}
            <div className="p-4 space-y-2">
                <h3 className="font-semibold text-sm">{template.name}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">
                    {template.description}
                </p>
                {isLocked && (
                    <p className="text-xs text-primary font-medium">Click to Upgrade</p>
                )}
            </div>
        </Card>
    )
}
