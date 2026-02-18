import React, { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { CheckCircle2, AlertCircle, TrendingUp, Search } from 'lucide-react'
import type { ResumeContent } from '@/types/resume'

interface ATSAnalyserProps {
    content: ResumeContent
}

export function ATSAnalyser({ content }: ATSAnalyserProps) {
    const analysis = useMemo(() => {
        const results = {
            score: 0,
            pros: [] as string[],
            cons: [] as string[],
            metrics: {
                contactInfo: 0,
                summary: 0,
                skills: 0,
                experience: 0,
                education: 0,
                length: 0
            }
        }

        // 1. Personal Info Check
        if (content.personalInfo?.fullName) results.metrics.contactInfo += 20
        if (content.personalInfo?.email) results.metrics.contactInfo += 20
        if (content.personalInfo?.phone) results.metrics.contactInfo += 20
        if (content.personalInfo?.location) results.metrics.contactInfo += 20
        if (content.personalInfo?.linkedin) results.metrics.contactInfo += 20

        if (results.metrics.contactInfo >= 80) {
            results.pros.push("Complete contact information")
        } else {
            results.cons.push("Missing some contact details (LinkedIn or Location)")
        }

        // 2. Summary Check
        if (content.summary && content.summary.length > 50) {
            results.metrics.summary = 100
            results.pros.push("Strong professional summary included")
        } else if (content.summary) {
            results.metrics.summary = 50
            results.cons.push("Summary is a bit short")
        } else {
            results.cons.push("Missing professional summary")
        }

        // 3. Skills Check
        const skillCount = content.skills?.length || 0
        results.metrics.skills = Math.min(100, skillCount * 10)
        if (skillCount > 8) {
            results.pros.push(`Good variety of skills (${skillCount} identified)`)
        } else if (skillCount > 0) {
            results.cons.push("Consider adding more relevant keywords/skills")
        } else {
            results.cons.push("No skills listed - critical for ATS")
        }

        // 4. Experience Check
        const expCount = content.experience?.length || 0
        results.metrics.experience = Math.min(100, expCount * 30)

        let hasActionVerbs = false
        const actionVerbs = ['managed', 'developed', 'led', 'created', 'implemented', 'increased', 'reduced', 'solved']
        content.experience?.forEach(exp => {
            exp.description?.forEach(desc => {
                if (actionVerbs.some(verb => desc.toLowerCase().includes(verb))) {
                    hasActionVerbs = true
                }
            })
        })

        if (expCount > 0) {
            results.pros.push("Work history is well-structured")
            if (hasActionVerbs) results.pros.push("Uses strong action verbs in descriptions")
            else results.cons.push("Try using more action verbs (e.g., Led, Developed, Managed)")
        } else {
            results.cons.push("No work experience listed")
        }

        // 5. Education Check
        if (content.education?.length > 0) {
            results.metrics.education = 100
            results.pros.push("Education background is clear")
        } else {
            results.cons.push("Missing education details")
        }

        // Final Score Calculation
        results.score = Math.round(
            (results.metrics.contactInfo * 0.15) +
            (results.metrics.summary * 0.15) +
            (results.metrics.skills * 0.25) +
            (results.metrics.experience * 0.35) +
            (results.metrics.education * 0.10)
        )

        return results
    }, [content])

    return (
        <Card className="border-2 border-primary/10 shadow-lg bg-card/50 backdrop-blur-sm overflow-hidden">
            <CardHeader className="bg-primary/5 border-b">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xl flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        ATS Score & Analysis
                    </CardTitle>
                    <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
                        <Search className="w-4 h-4 text-primary" />
                        <span className="text-sm font-bold text-primary">Live Scan</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
                {/* Score Section */}
                <div className="text-center space-y-4">
                    <div className="relative inline-flex items-center justify-center">
                        <svg className="w-32 h-32 transform -rotate-90">
                            <circle
                                cx="64"
                                cy="64"
                                r="58"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                className="text-muted"
                            />
                            <circle
                                cx="64"
                                cy="64"
                                r="58"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                strokeDasharray={364.4}
                                strokeDashoffset={364.4 - (364.4 * analysis.score) / 100}
                                className="text-primary transition-all duration-1000 ease-out"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-black">{analysis.score}</span>
                            <span className="text-[10px] uppercase font-bold tracking-tighter opacity-60">Score</span>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="font-bold text-lg">
                            {analysis.score >= 80 ? "Excellent!" : analysis.score >= 60 ? "Good" : "Needs Work"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Your resume is {analysis.score}% optimized for Applicant Tracking Systems.
                        </p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Pros */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-green-600 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" />
                            Strengths
                        </h3>
                        <div className="space-y-2">
                            {analysis.pros.map((pro, i) => (
                                <div key={i} className="flex items-start gap-2 text-sm bg-green-500/5 p-2 rounded border border-green-500/10">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                                    <span>{pro}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Cons */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-amber-500 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            Improvements
                        </h3>
                        <div className="space-y-2">
                            {analysis.cons.map((con, i) => (
                                <div key={i} className="flex items-start gap-2 text-sm bg-amber-500/5 p-2 rounded border border-amber-500/10">
                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                                    <span>{con}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Detailed Metrics */}
                <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-sm font-bold opacity-60 uppercase">Section Breakdown</h3>
                    <div className="grid gap-4">
                        <MetricBar label="Contact Info" value={analysis.metrics.contactInfo} />
                        <MetricBar label="Summary" value={analysis.metrics.summary} />
                        <MetricBar label="Skills Keyword" value={analysis.metrics.skills} />
                        <MetricBar label="Work Experience" value={analysis.metrics.experience} />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

function MetricBar({ label, value }: { label: string; value: number }) {
    return (
        <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
                <span>{label}</span>
                <span>{value}%</span>
            </div>
            <Progress value={value} className="h-1.5" />
        </div>
    )
}
