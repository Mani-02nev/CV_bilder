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
            bgColor: "bg-yellow-500/10",
            content: {
                input: "Software Engineer, 5 years experience",
                output: "Generating professional summary..."
            }
        },
        {
            title: "Crafting Professional Summary",
            icon: User,
            color: "text-blue-500",
            bgColor: "bg-blue-500/10",
            content: {
                input: "",
                output: "Results-driven Software Engineer with 5+ years of experience in full-stack development, specializing in React, Node.js, and cloud technologies. Proven track record of delivering scalable solutions..."
            }
        },
        {
            title: "Generating Experience Bullets",
            icon: Briefcase,
            color: "text-green-500",
            bgColor: "bg-green-500/10",
            content: {
                input: "",
                output: "• Led development of microservices architecture serving 1M+ users\n• Reduced API response time by 60% through optimization\n• Mentored team of 5 junior developers"
            }
        },
        {
            title: "Optimizing for ATS",
            icon: Zap,
            color: "text-purple-500",
            bgColor: "bg-purple-500/10",
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
        <div className="relative w-full h-full bg-gradient-to-br from-background via-background to-muted/20 rounded-lg overflow-hidden">
            {/* Animated background particles */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-primary/20 rounded-full"
                        initial={{
                            x: Math.random() * 100 + '%',
                            y: Math.random() * 100 + '%',
                            scale: 0
                        }}
                        animate={{
                            y: [null, Math.random() * 100 + '%'],
                            scale: [0, 1, 0],
                            opacity: [0, 0.5, 0]
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2
                        }}
                    />
                ))}
            </div>

            {/* Main content */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center p-4 sm:p-8 space-y-4 sm:space-y-8">
                {/* Header */}
                <motion.div
                    className="text-center space-y-2"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground">
                        <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
                        <span>AI-Powered Resume Generation</span>
                    </div>
                </motion.div>

                {/* Step indicator */}
                <div className="flex gap-2">
                    {demoSteps.map((_, i) => (
                        <motion.div
                            key={i}
                            className={`h-1 rounded-full transition-all ${i === step ? 'w-8 bg-primary' : 'w-2 bg-muted'
                                }`}
                            animate={{
                                scale: i === step ? [1, 1.2, 1] : 1
                            }}
                            transition={{ duration: 0.3 }}
                        />
                    ))}
                </div>

                {/* Demo card */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="w-full max-w-2xl"
                    >
                        <div className={`${currentStep.bgColor} border-2 border-primary/20 rounded-2xl p-4 sm:p-8 space-y-4 sm:space-y-6 shadow-2xl backdrop-blur-sm`}>
                            {/* Step header */}
                            <div className="flex items-center gap-4">
                                <motion.div
                                    className={`${currentStep.bgColor} p-4 rounded-xl`}
                                    animate={{
                                        rotate: isTyping ? [0, 5, -5, 0] : 0,
                                        scale: isTyping ? [1, 1.1, 1] : 1
                                    }}
                                    transition={{ duration: 0.5, repeat: isTyping ? Infinity : 0 }}
                                >
                                    <Icon className={`w-8 h-8 ${currentStep.color}`} />
                                </motion.div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg sm:text-xl font-bold truncate">{currentStep.title}</h3>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                        {isTyping ? (
                                            <>
                                                <motion.div
                                                    className="flex gap-1"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                >
                                                    {[0, 1, 2].map((i) => (
                                                        <motion.div
                                                            key={i}
                                                            className="w-2 h-2 bg-primary rounded-full"
                                                            animate={{
                                                                scale: [1, 1.5, 1],
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
                                                <span>AI is working...</span>
                                            </>
                                        ) : (
                                            <span className="text-green-500">✓ Complete</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="space-y-4">
                                {currentStep.content.input && (
                                    <div className="bg-background/50 rounded-lg p-4 border">
                                        <div className="text-xs font-semibold text-muted-foreground mb-2">INPUT</div>
                                        <div className="text-sm">{currentStep.content.input}</div>
                                    </div>
                                )}

                                <div className="bg-background rounded-lg p-4 border-2 border-primary/30">
                                    <div className="text-xs font-semibold text-primary mb-2 flex items-center gap-2">
                                        <Sparkles className="w-3 h-3" />
                                        AI GENERATED
                                    </div>
                                    <motion.div
                                        className="text-sm leading-relaxed whitespace-pre-line"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.5, delay: 0.2 }}
                                    >
                                        {currentStep.content.output}
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Features badges */}
                <motion.div
                    className="flex flex-wrap gap-3 justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    {[
                        { icon: Sparkles, text: "AI-Powered" },
                        { icon: Zap, text: "Instant" },
                        { icon: Code, text: "ATS-Optimized" },
                        { icon: GraduationCap, text: "Professional" }
                    ].map((badge, i) => (
                        <motion.div
                            key={i}
                            className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-background/80 backdrop-blur-sm rounded-full border text-[10px] sm:text-sm font-medium"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <badge.icon className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                            <span>{badge.text}</span>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    )
}
