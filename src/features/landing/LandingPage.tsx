import { Button } from "@/components/ui/button"
import {
    ArrowRight,
    FileText,
    Sparkles,
    CheckCircle,
    Crown,
    MessageCircle,
    Palette,
    Menu
} from "lucide-react"
import { Link } from "react-router-dom"
import { AIResumeDemo } from "@/components/AIResumeDemo"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"

export default function LandingPage() {

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
                <div className="container flex h-16 items-center justify-between px-4 md:px-6">
                    <div className="flex items-center gap-2 font-bold text-xl">
                        <FileText className="h-6 w-6 text-primary" />
                        <span>KS Resume Builder</span>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex gap-6 text-sm font-medium">
                        <a href="#features" className="hover:text-primary transition-colors">Features</a>
                        <a href="#templates" className="hover:text-primary transition-colors">Templates</a>
                        <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
                    </nav>

                    <div className="hidden md:flex items-center gap-4">
                        <Link to="/auth/login">
                            <Button variant="ghost" size="sm">Log In</Button>
                        </Link>
                        <Link to="/auth/signup">
                            <Button size="sm">Get Started</Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <button className="md:hidden p-2">
                                <Menu className="h-6 w-6" />
                            </button>
                        </SheetTrigger>
                        <SheetContent side="right" className="flex flex-col gap-6 p-8">
                            <div className="flex items-center gap-2 font-bold text-xl mb-4">
                                <FileText className="h-6 w-6 text-primary" />
                                <span>KS Resume</span>
                            </div>
                            <nav className="flex flex-col gap-4 text-base font-medium">
                                <a href="#features" className="hover:text-primary transition-colors">Features</a>
                                <a href="#templates" className="hover:text-primary transition-colors">Templates</a>
                                <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
                            </nav>
                            <div className="flex flex-col gap-3 pt-6 border-t mt-auto">
                                <Link to="/auth/login" className="w-full">
                                    <Button variant="outline" className="w-full justify-center">Log In</Button>
                                </Link>
                                <Link to="/auth/signup" className="w-full">
                                    <Button className="w-full justify-center">Get Started</Button>
                                </Link>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="py-20 md:py-32 px-4 md:px-6 text-center space-y-8 max-w-5xl mx-auto">
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                            Build Your <span className="text-primary">Dream Resume</span> <br className="hidden md:block" /> with AI in Minutes.
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Create professional, ATS-optimized resumes tailored to your job applications using our advanced AI engine.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/auth/signup">
                            <Button size="lg" className="gap-2 h-12 px-8 text-lg">
                                Create My Resume <ArrowRight className="h-5 w-5" />
                            </Button>
                        </Link>
                        <a href="#templates">
                            <Button variant="outline" size="lg" className="h-12 px-8 text-lg">
                                View Templates
                            </Button>
                        </a>
                    </div>

                    <div className="pt-12">
                        <div className="bg-muted/50 rounded-xl border p-2 max-w-4xl mx-auto shadow-2xl">
                            <div className="aspect-video bg-background rounded-lg overflow-hidden">
                                <AIResumeDemo />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-20 bg-muted/30">
                    <div className="container px-4 md:px-6">
                        <div className="text-center mb-16 space-y-4">
                            <h2 className="text-3xl font-bold">Why Choose KS Resume Builder?</h2>
                            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Everything you need to land your next job, powered by intelligent automation.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                {
                                    title: "AI-Powered Content",
                                    desc: "Generate professional summaries and bullet points tailored to your role.",
                                    icon: Sparkles
                                },
                                {
                                    title: "ATS Optimization",
                                    desc: "Ensure your resume gets past applicant tracking systems effectively.",
                                    icon: CheckCircle
                                },
                                {
                                    title: "Real-time Preview",
                                    desc: "See changes instantly as you type with our dynamic split-screen editor.",
                                    icon: FileText
                                }
                            ].map((feature, i) => (
                                <div key={i} className="bg-background p-8 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                                    <feature.icon className="h-12 w-12 text-primary mb-6" />
                                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Templates Section */}
                <section id="templates" className="py-20">
                    <div className="container px-4 md:px-6">
                        <div className="text-center mb-16 space-y-4">
                            <h2 className="text-3xl font-bold">Professional Resume Templates</h2>
                            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                                Choose from our collection of beautifully designed templates
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                            {[
                                { name: "Executive Navy", color: "bg-blue-900", free: false },
                                { name: "Creative Purple", color: "bg-purple-500", free: false },
                                { name: "ATS Basic", color: "bg-gray-800", free: true },
                                { name: "Modern Blue", color: "bg-blue-500", free: true },
                                { name: "Classic Black", color: "bg-gray-900", free: true }
                            ].map((template, i) => (
                                <div key={i} className="group relative bg-background rounded-xl border p-4 hover:shadow-lg transition-all">
                                    <div className={`${template.color} h-48 rounded-lg mb-4 flex items-center justify-center text-white font-bold relative overflow-hidden`}>
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                                        <Palette className="h-12 w-12 opacity-50" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-semibold">{template.name}</h3>
                                            {!template.free && (
                                                <span className="flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                                    <Crown className="h-3 w-3" />
                                                    Pro
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            {template.free ? "Free template" : "Premium template"}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="text-center mt-12">
                            <Link to="/auth/signup">
                                <Button size="lg" className="gap-2">
                                    View All Templates <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section id="pricing" className="py-20 bg-muted/30">
                    <div className="container px-4 md:px-6">
                        <div className="text-center mb-16 space-y-4">
                            <h2 className="text-3xl font-bold">Simple, Transparent Pricing</h2>
                            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                                Start free, upgrade when you need more
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {/* Free Plan */}
                            <div className="bg-background rounded-2xl border p-8 space-y-6">
                                <div>
                                    <h3 className="text-2xl font-bold mb-2">Free</h3>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-bold">$0</span>
                                        <span className="text-muted-foreground">/month</span>
                                    </div>
                                </div>

                                <ul className="space-y-3">
                                    {[
                                        "3 Free Templates",
                                        "AI Content Generation",
                                        "ATS Optimization",
                                        "PDF Download",
                                        "Real-time Preview",
                                        "Basic Support"
                                    ].map((feature, i) => (
                                        <li key={i} className="flex items-center gap-3">
                                            <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                                            <span className="text-sm">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Link to="/auth/signup" className="block">
                                    <Button variant="outline" className="w-full" size="lg">
                                        Get Started Free
                                    </Button>
                                </Link>
                            </div>

                            {/* Pro Plan */}
                            <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background rounded-2xl border-2 border-primary p-8 space-y-6 relative">
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                    <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                                        Most Popular
                                    </span>
                                </div>

                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Crown className="h-6 w-6 text-primary" />
                                        <h3 className="text-2xl font-bold">Pro</h3>
                                    </div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-bold">$29</span>
                                        <span className="text-muted-foreground">/month</span>
                                    </div>
                                </div>

                                <ul className="space-y-3">
                                    {[
                                        "All Free Features",
                                        "10 Premium Templates",
                                        "Unlimited Resumes",
                                        "Priority AI Generation",
                                        "Advanced Customization",
                                        "Priority Support",
                                        "Profile Picture Upload",
                                        "Custom Branding"
                                    ].map((feature, i) => (
                                        <li key={i} className="flex items-center gap-3">
                                            <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                                            <span className="text-sm font-medium">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <a
                                    href="https://wa.me/918270374293?text=Hi!%20I'm%20interested%20in%20upgrading%20to%20Pro%20plan%20($29/month)"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block"
                                >
                                    <Button className="w-full gap-2" size="lg">
                                        <MessageCircle className="h-5 w-5" />
                                        Contact on WhatsApp
                                    </Button>
                                </a>

                                <p className="text-xs text-center text-muted-foreground">
                                    Message us to upgrade. We'll activate Pro manually.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="py-8 bg-muted/50 border-t">
                <div className="container px-4 text-center text-muted-foreground text-sm">
                    © {new Date().getFullYear()} KS Resume Builder. All rights reserved.
                </div>
            </footer>
        </div>
    )
}
