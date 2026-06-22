import { useState, useEffect } from 'react'
import { Sparkles, User, Briefcase, GraduationCap, Code, Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function AIResumeDemo() {
    const [step, setStep] = useState(0)
    const [isTyping, setIsTyping] = useState(false)

    const demoSteps = [
        {
            title: "AI Analyzing Your Profile",
            icon: Sparkles,
            color: "text-yellow-500",
            bgColor: "bg-yellow-500/5",
            content: {
                input: "Software Engineer, 5 years experience",
                output: "Generating professional summary..."
            }
        },
        {
            title: "Crafting Professional Summary",
            icon: User,
            color: "text-blue-400",
            bgColor: "bg-blue-500/5",
            content: {
                input: "",
                output: "Results-driven Software Engineer with 5+ years of experience in full-stack development, specializing in React, Node.js, and cloud technologies. Proven track record of delivering scalable solutions..."
            }
        },
        {
            title: "Generating Experience Bullets",
            icon: Briefcase,
            color: "text-emerald-400",
            bgColor: "bg-emerald-500/5",
            content: {
                input: "",
                output: "• Led development of microservices architecture serving 1M+ users\n• Reduced API response time by 60% through optimization\n• Mentored team of 5 junior developers"
            }
        },
        {
            title: "Optimizing for ATS",
            icon: Zap,
            color: "text-purple-400",
            bgColor: "bg-purple-500/5",
            content: {
                input: "",
                output: "✓ Keywords optimized\n✓ Format ATS-friendly\n✓ Section order optimized\n✓ Ready to submit!"
            }
        }
    ]

    useEffect(() => {
        const interval = setInterval(() => {
            setIsTyping(true)
            setTimeout(() => {
                setStep((prev) => (prev + 1) % demoSteps.length)
                setIsTyping(false)
            }, 1500)
        }, 4000)

        return () => clearInterval(interval)
    }, [])

    const currentStep = demoSteps[step]
    const Icon = currentStep.icon

    return (
        <div className="relative w-full h-full bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900/50 rounded-2xl overflow-hidden font-sans border border-slate-900">
            {/* Animated background particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(15)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1.5 h-1.5 bg-indigo-500/10 rounded-full"
                        initial={{
                            x: Math.random() * 100 + '%',
                            y: Math.random() * 100 + '%',
                            scale: 0
                        }}
                        animate={{
                            y: [null, Math.random() * 100 + '%'],
                            scale: [0, 1, 0],
                            opacity: [0, 0.4, 0]
                        }}
                        transition={{
                            duration: 4 + Math.random() * 3,
                            repeat: Infinity,
                            delay: Math.random() * 2
                        }}
                    />
                ))}
            </div>

            {/* Main content */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
                {/* Header */}
                <motion.div
                    className="text-center space-y-1.5"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-wider text-slate-450 uppercase">
                        <Sparkles className="w-3.5 h-3.5 text-yellow-500 animate-pulse" />
                        <span>AI-Powered Resume Generation</span>
                    </div>
                </motion.div>

                {/* Step indicator dots */}
                <div className="flex gap-2">
                    {demoSteps.map((_, i) => (
                        <motion.div
                            key={i}
                            className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-indigo-500' : 'w-2 bg-slate-800'}`}
                            animate={{
                                scale: i === step ? [1, 1.15, 1] : 1
                            }}
                            transition={{ duration: 0.3 }}
                        />
                    ))}
                </div>

                {/* Demo card container */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, scale: 0.96, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: -15 }}
                        transition={{ duration: 0.4 }}
                        className="w-full max-w-2xl"
                    >
                        <div className={`bg-slate-950/70 border border-slate-900 rounded-2xl p-5 sm:p-6.5 space-y-4 shadow-2xl backdrop-blur-md`}>
                            {/* Step title header */}
                            <div className="flex items-center gap-4">
                                <motion.div
                                    className={`${currentStep.bgColor} p-3 rounded-xl border border-slate-800/40`}
                                    animate={{
                                        rotate: isTyping ? [0, 4, -4, 0] : 0,
                                        scale: isTyping ? [1, 1.05, 1] : 1
                                    }}
                                    transition={{ duration: 0.5, repeat: isTyping ? Infinity : 0 }}
                                >
                                    <Icon className={`w-6 h-6 ${currentStep.color}`} />
                                </motion.div>
                                <div className="flex-1 min-w-0 text-left">
                                    <h3 className="text-sm sm:text-base font-bold text-white truncate">{currentStep.title}</h3>
                                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-1 font-medium">
                                        {isTyping ? (
                                            <>
                                                <motion.div
                                                    className="flex gap-1 items-center"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                >
                                                    {[0, 1, 2].map((i) => (
                                                        <motion.div
                                                            key={i}
                                                            className="w-1.5 h-1.5 bg-indigo-500 rounded-full"
                                                            animate={{
                                                                scale: [1, 1.4, 1],
                                                                opacity: [0.3, 1, 0.3]
                                                            }}
                                                            transition={{
                                                                duration: 0.8,
                                                                repeat: Infinity,
                                                                delay: i * 0.2
                                                            }}
                                                        />
                                                    ))}
                                                </motion.div>
                                                <span className="text-slate-400">AI Engine active...</span>
                                            </>
                                        ) : (
                                            <span className="text-emerald-400 font-semibold flex items-center gap-1">✓ Complete</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Inner Code/Text Blocks */}
                            <div className="space-y-3.5 text-left">
                                {currentStep.content.input && (
                                    <div className="bg-slate-900/30 rounded-xl p-4 border border-slate-900/80">
                                        <div className="text-[10px] font-bold tracking-wider uppercase text-slate-500 mb-1.5">INPUT BACKGROUND</div>
                                        <div className="text-xs sm:text-sm text-slate-300 font-medium">{currentStep.content.input}</div>
                                    </div>
                                )}

                                <div className="bg-slate-900/60 rounded-xl p-4 border border-indigo-500/25 shadow-lg shadow-indigo-500/5">
                                    <div className="text-[10px] font-bold tracking-wider uppercase text-indigo-400 mb-1.5 flex items-center gap-1.5">
                                        <Sparkles className="w-3.5 h-3.5" />
                                        AI GENERATED CV CONTENT
                                    </div>
                                    <motion.div
                                        className="text-xs sm:text-sm leading-relaxed text-slate-200 whitespace-pre-line font-mono"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.4, delay: 0.15 }}
                                    >
                                        {currentStep.content.output}
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Features bottom badges */}
                <motion.div
                    className="flex flex-wrap gap-2.5 justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    {[
                        { icon: Sparkles, text: "AI-Powered Generator" },
                        { icon: Zap, text: "Instant Real-Time" },
                        { icon: Code, text: "100% ATS-Optimized" },
                        { icon: GraduationCap, text: "Recruiter Standard" }
                    ].map((badge, i) => (
                        <motion.div
                            key={i}
                            className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-900/50 backdrop-blur-md rounded-full border border-slate-800/80 text-[10px] sm:text-xs font-semibold text-slate-300 transition-colors hover:border-slate-700"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <badge.icon className="w-3.5 h-3.5 text-indigo-400" />
                            <span>{badge.text}</span>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    )
}
