import { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { CheckCircle2, AlertCircle, TrendingUp, Search, Sparkles, Loader2 } from 'lucide-react'
import type { ResumeContent } from '@/types/resume'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { aiService } from '@/services/ai'
import { toast } from 'sonner'

interface ATSAnalyserProps {
    content: ResumeContent
    onUpdateContent?: (content: ResumeContent) => void
}

export function ATSAnalyser({ content, onUpdateContent }: ATSAnalyserProps) {
    const [showOptimizeDialog, setShowOptimizeDialog] = useState(false)
    const [isOptimizing, setIsOptimizing] = useState(false)
    const [optimizeParams, setOptimizeParams] = useState({
        companyName: "",
        jobTitle: "",
        jobDescription: ""
    })

    const handleOptimize = async () => {
        if (!optimizeParams.companyName || !optimizeParams.jobTitle) {
            toast.error("Please fill in the Company Name and Job Title")
            return
        }
        setIsOptimizing(true)
        try {
            const optimized = await aiService.optimizeForCompany({
                companyName: optimizeParams.companyName,
                jobTitle: optimizeParams.jobTitle,
                jobDescription: optimizeParams.jobDescription,
                currentContent: content
            })
            if (onUpdateContent) {
                onUpdateContent(optimized)
            }
            setShowOptimizeDialog(false)
            toast.success(`Successfully tailored resume for ${optimizeParams.companyName}!`)
        } catch (error) {
            console.error('Tailoring failed:', error)
            toast.error("Failed to tailor resume")
        } finally {
            setIsOptimizing(false)
        }
    }

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
        if (content.education && content.education.length > 0) {
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
        <>
            <Card className="border-slate-900 bg-slate-950/40 shadow-xl rounded-2xl overflow-hidden text-white">
                <CardHeader className="py-4 px-5 border-b border-slate-900 bg-slate-900/10">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-extrabold text-white flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-indigo-400" />
                            ATS Score & Analysis
                        </CardTitle>
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                            <Search className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                            <span className="text-[10px] font-bold text-indigo-400">Live Scan</span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-5 space-y-6">
                    {/* Score Section */}
                    <div className="text-center space-y-4 pt-2">
                        <div className="relative inline-flex items-center justify-center">
                            <svg className="w-28 h-28 transform -rotate-90">
                                <circle
                                    cx="56"
                                    cy="56"
                                    r="50"
                                    stroke="currentColor"
                                    strokeWidth="6"
                                    fill="transparent"
                                    className="text-slate-900"
                                />
                                <circle
                                    cx="56"
                                    cy="56"
                                    r="50"
                                    stroke="currentColor"
                                    strokeWidth="6"
                                    fill="transparent"
                                    strokeDasharray={314.16}
                                    strokeDashoffset={314.16 - (314.16 * analysis.score) / 100}
                                    className="text-indigo-500 transition-all duration-1000 ease-out"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-2xl font-black text-white">{analysis.score}</span>
                                <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Score</span>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="font-extrabold text-sm text-slate-200">
                                {analysis.score >= 80 ? "Excellent!" : analysis.score >= 60 ? "Good" : "Needs Work"}
                            </p>
                            <p className="text-xs text-slate-400">
                                Your resume is {analysis.score}% optimized for Applicant Tracking Systems.
                            </p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        {/* Pros */}
                        <div className="space-y-2.5">
                            <h3 className="text-xs font-black uppercase tracking-wider text-green-400 flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4 text-green-400" />
                                Strengths
                            </h3>
                            <div className="space-y-1.5 text-left">
                                {analysis.pros.map((pro, i) => (
                                    <div key={i} className="flex items-start gap-2 text-xs bg-green-500/10 p-2.5 rounded-xl border border-green-500/20 text-green-300">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 flex-shrink-0" />
                                        <span>{pro}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Cons */}
                        <div className="space-y-2.5">
                            <h3 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                                <AlertCircle className="w-4 h-4 text-amber-450" />
                                Improvements
                            </h3>
                            <div className="space-y-1.5 text-left">
                                {analysis.cons.map((con, i) => (
                                    <div key={i} className="flex items-start gap-2 text-xs bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20 text-amber-300">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                                        <span>{con}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Detailed Metrics */}
                    <div className="space-y-3 pt-4 border-t border-slate-900 text-left">
                        <h3 className="text-xs font-black opacity-60 uppercase text-slate-400 tracking-wider">Section Breakdown</h3>
                        <div className="grid gap-3">
                            <MetricBar label="Contact Info" value={analysis.metrics.contactInfo} />
                            <MetricBar label="Summary" value={analysis.metrics.summary} />
                            <MetricBar label="Skills Keyword" value={analysis.metrics.skills} />
                            <MetricBar label="Work Experience" value={analysis.metrics.experience} />
                        </div>
                    </div>

                    {/* Tailor for Company Section */}
                    {onUpdateContent && (
                        <div className="pt-5 border-t border-slate-900 mt-4 space-y-4">
                            <div className="bg-indigo-600/10 border border-indigo-500/20 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="space-y-1 text-left">
                                    <h4 className="font-bold text-white flex items-center gap-1.5 text-xs sm:text-sm">
                                        <Sparkles className="w-4 h-4 text-indigo-400" />
                                        Optimize for Target Company
                                    </h4>
                                    <p className="text-[11px] text-slate-400">
                                        Instantly rewrite summary, skills & top role keywords to tailor your CV.
                                    </p>
                                </div>
                                <Button 
                                    onClick={() => setShowOptimizeDialog(true)} 
                                    size="sm"
                                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shrink-0"
                                >
                                    Tailor Resume
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* AI Tailoring Dialog */}
            <Dialog open={showOptimizeDialog} onOpenChange={setShowOptimizeDialog}>
                <DialogContent className="bg-slate-950 border-slate-900 text-white max-w-md rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-lg font-bold">
                            <Sparkles className="h-5 w-5 text-indigo-400" /> 
                            ATS Target Tailor
                        </DialogTitle>
                        <DialogDescription className="text-slate-400 text-xs">
                            Maximize your ATS compatibility matching a specific target company and role.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-3 text-left font-sans">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-slate-400">Target Company Name</Label>
                            <Input 
                                value={optimizeParams.companyName} 
                                onChange={(e) => setOptimizeParams(p => ({ ...p, companyName: e.target.value }))} 
                                placeholder="e.g. Google" 
                                className="bg-slate-900/60 border-slate-800 text-white placeholder-slate-600 rounded-xl h-10" 
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-slate-400">Target Job Title</Label>
                            <Input 
                                value={optimizeParams.jobTitle} 
                                onChange={(e) => setOptimizeParams(p => ({ ...p, jobTitle: e.target.value }))} 
                                placeholder="e.g. Frontend Engineer" 
                                className="bg-slate-900/60 border-slate-800 text-white placeholder-slate-650 rounded-xl h-10" 
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-slate-400">Job Description / Requirements</Label>
                            <Textarea 
                                value={optimizeParams.jobDescription} 
                                onChange={(e) => setOptimizeParams(p => ({ ...p, jobDescription: e.target.value }))} 
                                placeholder="Paste the key job description bullet points or text here to extract key skills..." 
                                rows={4}
                                className="bg-slate-900/60 border-slate-800 text-white placeholder-slate-650 rounded-xl" 
                            />
                        </div>
                    </div>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button 
                            variant="outline" 
                            onClick={() => setShowOptimizeDialog(false)} 
                            className="border-slate-800 bg-transparent text-slate-450 hover:bg-slate-900 hover:text-white rounded-xl"
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleOptimize} 
                            disabled={isOptimizing} 
                            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl"
                        >
                            {isOptimizing ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : <Sparkles className="h-4 w-4 mr-1.5" />} 
                            Tailor & Maximize ATS
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

function MetricBar({ label, value }: { label: string; value: number }) {
    return (
        <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium text-slate-300">
                <span>{label}</span>
                <span>{value}%</span>
            </div>
            <Progress value={value} className="h-1.5 bg-slate-900" />
        </div>
    )
}
