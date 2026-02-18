import { Button } from "@/components/ui/button"
import {
    ArrowRight,
    CheckCircle2,
    Star,
    Layers,
    Search,
    Zap,
    Layout,
    FileText,
    ShieldCheck,
    Download,
    Menu,
    X,
    Plus,
    Minus,
    Sparkles
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetTrigger,
} from "@/components/ui/sheet"
import { AIResumeDemo } from "@/components/AIResumeDemo"
import logo from "@/assets/logo.png"
import companyLogo from "@/assets/company-logo.png"

export default function LandingPage() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [openFaq, setOpenFaq] = useState<number | null>(null)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const faqItems = [
        {
            q: "Is the resume ATS-compatible?",
            a: "Yes, all our templates are built using standard fonts and layouts that are 100% readable by Applicant Tracking Systems (ATS) used by top Fortune 500 companies."
        },
        {
            q: "How does the AI generation work?",
            a: "Our AI analysis tool takes your job description and background to craft high-impact bullet points and summaries that highlight your measurable achievements."
        },
        {
            q: "Is my data secure?",
            a: "Absolutely. We use enterprise-grade encryption and do not share your personal information with third parties. Your data is stored securely in our private cloud."
        },
        {
            q: "Can I cancel my subscription anytime?",
            a: "Yes, you can manage your subscription from your dashboard. Our Pro plan includes a 7-day money-back guarantee with no questions asked."
        },
        {
            q: "Who owns my resume after I download it?",
            a: "You do. You have 100% ownership of any resume you create and download from KS Resume Builder."
        }
    ]

    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/10 selection:text-primary">
            {/* Navigation */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-white/80 backdrop-blur-md border-b border-gray-100 py-3" : "bg-transparent py-5"}`}>
                <div className="container mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <img src={logo} alt="KS Logo" className="h-8 w-8 object-contain" style={{ height: "70px", width: "70px" }} />
                        <span className="font-bold text-xl tracking-tight text-[#0F172A]">KS RESUME Bilder</span>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Features</a>
                        <a href="#templates" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Templates</a>
                        <a href="#pricing" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Pricing</a>
                        <a href="#faq" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">FAQ</a>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link to="/auth/login" className="hidden sm:block text-sm font-medium text-gray-600 hover:text-primary">Log in</Link>
                        <Link to="/auth/signup">
                            <Button size="sm" className="bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-full px-6 shadow-sm">
                                Create My Resume
                            </Button>
                        </Link>

                        <Sheet>
                            <SheetTrigger className="md:hidden">
                                <Menu className="h-6 w-6" />
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                                <SheetHeader className="sr-only">
                                    <SheetTitle>Navigation Menu</SheetTitle>
                                    <SheetDescription>Access different sections of our website.</SheetDescription>
                                </SheetHeader>
                                <nav className="flex flex-col gap-6 mt-12">
                                    <a href="#features" className="text-lg font-medium">Features</a>
                                    <a href="#templates" className="text-lg font-medium">Templates</a>
                                    <a href="#pricing" className="text-lg font-medium">Pricing</a>
                                    <hr />
                                    <Link to="/auth/login" className="text-lg">Log in</Link>
                                    <Link to="/auth/signup">
                                        <Button className="w-full">Get Started</Button>
                                    </Link>
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </nav>

            <main>
                {/* Hero Section */}
                <section className="pt-32 pb-20 md:pt-48 md:pb-32 px-6">
                    <div className="container mx-auto max-w-6xl text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="space-y-6"
                        >
                            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-[#0F172A] leading-[1.1]">
                                Build Your <span className="text-primary">Dream Resume</span> <br className="hidden md:block" /> with AI in Minutes.
                            </h1>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                                Create professional, ATS-optimized resumes tailored to your job applications using our advanced AI engine.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                                <Link to="/auth/signup">
                                    <Button size="lg" className="h-14 px-10 text-lg rounded-full bg-[#0F172A] hover:bg-black transition-all shadow-xl shadow-[#0F172A]/10 gap-2">
                                        Create My Resume <ArrowRight className="w-5 h-5" />
                                    </Button>
                                </Link>
                                <a href="#templates">
                                    <Button size="lg" variant="outline" className="h-14 px-10 text-lg rounded-full border-2 hover:bg-gray-50 transition-all">
                                        View Templates
                                    </Button>
                                </a>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="mt-20 relative px-4 md:px-0"
                        >
                            <AIResumeDemo />
                        </motion.div>
                    </div>
                </section>


                {/* How It Works */}
                <section className="py-32 px-6 overflow-hidden">
                    <div className="container mx-auto max-w-6xl">
                        <div className="text-center mb-24 max-w-2xl mx-auto space-y-4">
                            <h2 className="text-4xl font-bold text-[#0F172A]">Craft Your Career Narrative in Minutes.</h2>
                            <p className="text-lg text-gray-500">A streamlined process designed for software engineers and IT professionals.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-16 relative">
                            {[
                                {
                                    step: "01",
                                    title: "Input Experience",
                                    desc: "Connect your LinkedIn or paste your current resume details.",
                                    icon: <FileText className="w-10 h-10 text-primary" />
                                },
                                {
                                    step: "02",
                                    title: "AI Analysis",
                                    desc: "Our engine optimizes content for ATS and recruiter impact.",
                                    icon: <Zap className="w-10 h-10 text-primary" />
                                },
                                {
                                    step: "03",
                                    title: "Export & Apply",
                                    desc: "Download a beautiful, pixel-perfect PDF tailored to the job.",
                                    icon: <Download className="w-10 h-10 text-primary" />
                                }
                            ].map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    whileHover={{ y: -5 }}
                                    className="relative group p-8 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
                                >
                                    <div className="mb-6 w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center">
                                        {item.icon}
                                    </div>
                                    <div className="absolute top-8 right-8 text-6xl font-black text-gray-50 opacity-10 group-hover:opacity-20 transition-opacity">
                                        {item.step}
                                    </div>
                                    <h3 className="text-xl font-bold text-[#0F172A] mb-3">{item.title}</h3>
                                    <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-32 bg-[#0F172A] text-white">
                    <div className="container mx-auto px-6 max-w-6xl">
                        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-24">
                            <div className="space-y-4 max-w-2xl">
                                <div className="text-blue-400 font-bold tracking-widest uppercase text-xs">Unfair Advantage</div>
                                <h2 className="text-4xl md:text-5xl font-bold">Engineered for High-Stakes Career Growth.</h2>
                            </div>
                            <Link to="/auth/signup">
                                <Button className="bg-white text-black hover:bg-gray-200 rounded-full px-8 h-12 font-bold">Start Building Now</Button>
                            </Link>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                { title: "AI-Powered Generation", desc: "Automated bullet points that pass the most strict recruiter checks.", icon: Sparkles },
                                { title: "ATS Optimization", desc: "Built with a proprietary parsing engine to ensure 100% crawlability.", icon: Search },
                                { title: "Live Editor Preview", desc: "See your changes instantly as you edit, with no lag.", icon: Layout },
                                { title: "Enterprise Templates", desc: "Curated layouts used by executives at Fortune 500 companies.", icon: Layers },
                                { title: "One-Click PDF Export", desc: "Clean metadata and high-fidelity output for perfect printing.", icon: Download },
                                { title: "Cloud Security", desc: "Encrypted data storage with modern privacy protocols.", icon: ShieldCheck }
                            ].map((feature: { title: string, desc: string, icon: LucideIcon }, i) => (
                                <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                    <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-6 text-blue-400">
                                        <feature.icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Templates Section */}
                <section id="templates" className="py-32 px-6">
                    <div className="container mx-auto max-w-6xl">
                        <div className="text-center mb-20 space-y-4">
                            <h2 className="text-4xl font-bold text-[#0F172A]">Professional Templates for Every Role.</h2>
                            <p className="text-gray-500 max-w-xl mx-auto">Battle-tested layouts optimized for both human readability and machine parsing.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                { name: "Modern Executive", tag: "Most Popular", color: "bg-blue-600" },
                                { name: "The Minimalist", tag: "ATS-Friendly", color: "bg-gray-100" },
                                { name: "Creative Edge", tag: "Best for Designers", color: "bg-purple-600" },
                                { name: "Classic Corporate", tag: "MNC Standard", color: "bg-[#0F172A]" },
                                { name: "Clean Slate", tag: "Universal", color: "bg-emerald-600" },
                                { name: "Tech Pro", tag: "Dev Favorite", color: "bg-slate-700" }
                            ].map((tmpl, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ y: -10 }}
                                    className="group relative rounded-3xl overflow-hidden border border-gray-100 bg-white shadow-sm"
                                >
                                    <div className={`h-64 ${tmpl.color} opacity-90 relative overflow-hidden flex items-center justify-center text-white/20 select-none`}>
                                        <FileText className="w-32 h-32" />
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm gap-4">
                                            <Button variant="secondary" className="rounded-full px-6">Preview</Button>
                                            <Button className="rounded-full px-6 bg-white text-black hover:bg-gray-200 border-none">Use</Button>
                                        </div>
                                    </div>
                                    <div className="p-6 flex justify-between items-center">
                                        <div>
                                            <h4 className="font-bold text-gray-900">{tmpl.name}</h4>
                                            <span className="text-xs font-semibold text-primary uppercase">{tmpl.tag}</span>
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Comparison Section */}
                <section className="py-32 px-6 bg-gray-50">
                    <div className="container mx-auto max-w-4xl">
                        <div className="text-center mb-16 space-y-4">
                            <h2 className="text-4xl font-bold text-[#0F172A]">Why KS Resume Bilder?</h2>
                        </div>
                        <div className="bg-white rounded-[40px] shadow-xl overflow-hidden border border-gray-100">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b">
                                        <th className="p-8 text-sm font-semibold text-gray-400">Features</th>
                                        <th className="p-8 text-xl font-bold bg-[#0F172A] text-white">KS Resume</th>
                                        <th className="p-8 text-sm font-semibold text-gray-400">Generic Builders</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { f: "AI Customization", ks: true, gen: false },
                                        { f: "ATS Analysis (99%+)", ks: true, gen: "Limited" },
                                        { f: "Expert-Verified Content", ks: true, gen: false },
                                        { f: "High-Res PDF Export", ks: true, gen: true },
                                        { f: "Secure Data Storage", ks: true, gen: "Partial" },
                                        { f: "One-Click Optimization", ks: true, gen: false }
                                    ].map((row, i) => (
                                        <tr key={i} className="border-b last:border-0 hover:bg-gray-50/50 transition-colors">
                                            <td className="p-8 font-medium text-gray-600">{row.f}</td>
                                            <td className="p-8 bg-blue-50/20">
                                                {row.ks === true ? <CheckCircle2 className="text-emerald-500 w-6 h-6" /> : row.ks}
                                            </td>
                                            <td className="p-8 text-gray-400">
                                                {row.gen === true ? <CheckCircle2 className="text-gray-300 w-6 h-6" /> : (row.gen === false ? <X className="text-red-300 w-6 h-6" /> : row.gen)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* Testimonials */}
                <section className="py-32 px-6 bg-white">
                    <div className="container mx-auto px-6 max-w-6xl">
                        <div className="text-center mb-20">
                            <h2 className="text-4xl font-bold">Trusted by Industry Leaders.</h2>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                { name: "Ankit Sharma", role: "SDE-2 @ Intuit", text: "KS Resume builder played a crucial role in my Google application. The AI suggestions were spot on." },
                                { name: "Priya V.", role: "Senior Analyst @ Devloper", text: "The clean layouts and ATS optimization are industry-standard. It saved me hours of formatting." },
                                { name: "Mark Wilson", role: "Product Manager", text: "Professional, clean, and extremely intuitive. The best tool in this category by far." }
                            ].map((test, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ y: -5 }}
                                    className="p-10 rounded-[32px] bg-gray-50 border border-gray-100 space-y-6"
                                >
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                                    </div>
                                    <p className="text-gray-700 italic leading-relaxed text-lg">"{test.text}"</p>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-gray-200" />
                                        <div>
                                            <h5 className="font-bold text-[#0F172A]">{test.name}</h5>
                                            <p className="text-sm text-gray-500">{test.role}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section id="pricing" className="py-32 bg-[#F8F9FB] border-y border-gray-100">
                    <div className="container mx-auto max-w-5xl px-6">
                        <div className="text-center mb-16 space-y-4">
                            <h2 className="text-4xl font-bold">Simple, Professional Pricing.</h2>
                            <p className="text-gray-500">No hidden fees. Just results.</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            {/* Free Card */}
                            <div className="p-8 sm:p-10 rounded-[40px] bg-white border border-gray-100 shadow-sm relative overflow-hidden group">
                                <h3 className="text-lg font-bold text-gray-500 mb-2">Free Starter</h3>
                                <div className="flex items-baseline mb-8">
                                    <span className="text-5xl font-extrabold">₹0</span>
                                    <span className="text-gray-400 ml-2">/forever</span>
                                </div>
                                <ul className="space-y-4 mb-10 text-gray-600">
                                    <li className="flex gap-2 items-center"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> 1 Basic Resume Template</li>
                                    <li className="flex gap-2 items-center"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> AI Bullet Point Analysis</li>
                                    <li className="flex gap-2 items-center"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> High-Res PDF Download</li>
                                    <li className="flex gap-2 items-center opacity-40"><X className="w-5 h-5 text-red-400" /> Premium Templates</li>
                                </ul>
                                <Link to="/auth/signup">
                                    <Button variant="outline" className="w-full rounded-2xl h-14 border-2 font-bold group-hover:bg-gray-50 transition-all">Get Started</Button>
                                </Link>
                            </div>

                            {/* Pro Card */}
                            <div className="p-8 sm:p-12 rounded-[40px] bg-[#0F172A] text-white shadow-2xl relative overflow-hidden scale-100 sm:scale-105 z-10">
                                <div className="absolute top-0 right-0 py-1.5 px-6 bg-blue-600 rounded-bl-3xl text-xs font-bold uppercase tracking-widest animate-pulse">Special Offer</div>
                                <h3 className="text-lg font-bold text-blue-400 mb-2">Pro Advantage</h3>
                                <div className="flex items-baseline mb-2">
                                    <span className="text-5xl font-extrabold">₹39</span>
                                    <span className="text-blue-200/50 ml-2">/first month</span>
                                </div>
                                <div className="text-blue-300/60 text-sm mb-8">
                                    Then ₹59/month. Cancel anytime.
                                </div>
                                <ul className="space-y-4 mb-10 text-blue-50/80">
                                    <li className="flex gap-2 items-center font-medium text-white"><CheckCircle2 className="w-5 h-5 text-blue-400" /> Unlimited AI Generations</li>
                                    <li className="flex gap-2 items-center font-medium text-white"><CheckCircle2 className="w-5 h-5 text-blue-400" /> All Premium Templates</li>
                                    <li className="flex gap-2 items-center font-medium text-white"><CheckCircle2 className="w-5 h-5 text-blue-400" /> ATS Optimization Engine</li>
                                    <li className="flex gap-2 items-center font-medium text-white"><CheckCircle2 className="w-5 h-5 text-blue-400" /> Profile Picture Upload</li>
                                </ul>
                                <Link to="/auth/signup">
                                    <Button className="w-full rounded-2xl h-14 bg-white text-black hover:bg-gray-200 font-bold border-none transition-all shadow-xl shadow-white/5">Upgrade Now – Secure Checkout</Button>
                                </Link>
                                <div className="text-center mt-4 text-xs text-blue-300 opacity-60 flex items-center justify-center gap-1">
                                    <ShieldCheck className="w-3 h-3" /> 7-Day Money Back Guarantee
                                </div>
                            </div>
                        </div>
                        <p className="text-center mt-12 text-gray-400 text-sm italic">"No hidden fees. Your data belongs to you."</p>
                    </div>
                </section>

                {/* FAQ */}
                <section id="faq" className="py-32 px-6">
                    <div className="container mx-auto max-w-3xl">
                        <div className="text-center mb-16 space-y-4">
                            <h2 className="text-4xl font-bold">Frequently Asked Questions</h2>
                        </div>
                        <div className="space-y-4">
                            {faqItems.map((item, i) => (
                                <div key={i} className="rounded-2xl border border-gray-100 overflow-hidden bg-white">
                                    <button
                                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                        className="w-full p-6 text-left flex justify-between items-center transition-colors hover:bg-gray-50"
                                    >
                                        <span className="font-bold text-[#0F172A]">{item.q}</span>
                                        {openFaq === i ? <Minus className="w-5 h-5 text-primary" /> : <Plus className="w-5 h-5 text-primary" />}
                                    </button>
                                    <AnimatePresence>
                                        {openFaq === i && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <div className="px-6 pb-6 text-gray-500 leading-relaxed">
                                                    {item.a}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Tech Stack / Product of Section */}
                <section className="py-24 bg-white overflow-hidden">
                    <div className="container mx-auto px-6 max-w-6xl">
                        <div className="flex flex-col items-center text-center space-y-12">
                            <div className="space-y-4">
                                <h2 className="text-sm font-black uppercase tracking-[0.3em] text-gray-400">Official Product of</h2>
                                <a
                                    href="https://times-tech-one.vercel.app"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 justify-center group/brand hover:opacity-90 transition-all cursor-pointer"
                                >
                                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white border-2 border-indigo-50 flex items-center justify-center shadow-xl shadow-indigo-500/10 group-hover/brand:scale-105 transition-transform overflow-hidden">
                                        <img src={companyLogo} className="w-10 h-10 sm:w-12 sm:h-12 object-contain" alt="Company Logo" />
                                    </div>
                                    <h3 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tighter">TECH STACK <span className="text-indigo-600 uppercase text-[10px] sm:text-xs tracking-widest ml-1 bg-indigo-50 px-2 py-1 rounded">Solutions</span></h3>
                                </a>
                            </div>

                            <div className="w-full max-w-4xl px-4">
                                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 sm:gap-8 items-center justify-center opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center"><Sparkles className="w-6 h-6 text-indigo-500" /></div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest">OpenAI API</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center"><ShieldCheck className="w-6 h-6 text-blue-500" /></div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Supabase</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center"><Zap className="w-6 h-6 text-yellow-500" /></div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Vite React</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center"><Layers className="w-6 h-6 text-indigo-400" /></div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Framer Motion</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center"><Layout className="w-6 h-6 text-slate-600" /></div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Tailwind CSS</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center"><Download className="w-6 h-6 text-emerald-500" /></div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Vercel Edge</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-32 px-6">
                    <div className="container mx-auto max-w-5xl rounded-[40px] bg-[#0F172A] p-12 md:p-24 text-center text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 blur-[120px] -z-0" />
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/20 blur-[120px] -z-0" />

                        <div className="relative z-10 space-y-8">
                            <h2 className="text-4xl md:text-6xl font-bold">Ready to Elevate Your Career?</h2>
                            <p className="text-xl text-blue-100/60 max-w-2xl mx-auto">Join thousands of high-performers landing roles at top-tier MNCs.</p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                                <Link to="/auth/signup">
                                    <Button size="lg" className="h-14 px-10 text-lg rounded-full bg-white text-black hover:bg-gray-200 transition-all font-bold">Create My Resume</Button>
                                </Link>
                                <Link to="/auth/login">
                                    <Button size="lg" variant="outline" className="h-14 px-10 text-lg rounded-full border-white/20 hover:bg-white/10 text-white font-bold transition-all" style={{ color: "black" }}>Sign In</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="py-20 border-t border-gray-100">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
                        <div className="col-span-2 space-y-6">
                            <div className="flex items-center gap-2 font-bold text-xl">
                                <img src={logo} alt="KS Logo" className="h-8 w-8 object-contain" />
                                <span>KS RESUME Bilder</span>
                            </div>
                            <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
                                The world's most advanced AI-powered career platform for modern professionals.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h5 className="font-bold text-sm uppercase tracking-widest text-[#0F172A]">SaaS</h5>
                            <ul className="space-y-2 text-sm text-gray-500">
                                <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
                                <li><a href="#templates" className="hover:text-primary transition-colors">Templates</a></li>
                                <li><a href="#pricing" className="hover:text-primary transition-colors">Pricing</a></li>
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <h5 className="font-bold text-sm uppercase tracking-widest text-[#0F172A]">Company</h5>
                            <ul className="space-y-2 text-sm text-gray-500">
                                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Support</a></li>
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <h5 className="font-bold text-sm uppercase tracking-widest text-[#0F172A]">Social</h5>
                            <ul className="space-y-2 text-sm text-gray-500">
                                <li><a href="#" className="hover:text-primary transition-colors">LinkedIn</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Twitter</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">GitHub</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-gray-50">
                        <p className="text-gray-400 text-sm">© {new Date().getFullYear()} KS RESUME Bilder. All rights reserved.</p>
                        <p className="text-gray-400 text-sm flex items-center gap-1">Built with ❤️ for modern professionals</p>
                        <p className="text-gray-400 text-sm flex items-center gap-1.5">
                            Product of
                            <a href="https://times-tech-one.vercel.app" target="_blank" className="inline-flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors border border-gray-100 group">
                                <img src={companyLogo} className="w-4 h-4 object-contain grayscale group-hover:grayscale-0 transition-all" alt="Stack" />
                                <span className="font-bold text-[#0F172A]">Tech stack</span>
                            </a>
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
