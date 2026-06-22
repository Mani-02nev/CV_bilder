import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { Loader2, Sparkles, ArrowLeft } from "lucide-react"
import { supabase } from "@/lib/supabase"
import logo from "@/assets/logo.png"

export default function SignupPage() {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: 'https://cv-bilder.vercel.app/',
                    data: {
                        first_name: firstName,
                        last_name: lastName,
                    }
                }
            })

            if (error) throw error

            alert('Check your email to confirm your account!')
            navigate('/auth/login')
        } catch (err: any) {
            setError(err.message || 'Failed to create account')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#030712] text-white p-4 relative overflow-hidden font-sans">
            {/* CSS Grid Pattern */}
            <div 
                className="absolute inset-0 pointer-events-none opacity-20" 
                style={{
                    backgroundImage: `radial-gradient(rgba(99, 102, 241, 0.15) 1px, transparent 0), radial-gradient(rgba(168, 85, 247, 0.1) 1px, transparent 0)`,
                    backgroundSize: '32px 32px',
                    backgroundPosition: '0 0, 16px 16px'
                }}
            />

            {/* Background glowing effects */}
            <div className="absolute top-10 right-10 w-72 h-72 bg-indigo-600/5 rounded-full blur-[110px] pointer-events-none" />
            <div className="absolute bottom-10 left-10 w-72 h-72 bg-purple-600/5 rounded-full blur-[110px] pointer-events-none" />

            <div className="absolute top-6 left-6 z-20">
                <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
                </Link>
            </div>

            <Card className="w-full max-w-[420px] bg-slate-950/40 border border-slate-900/60 text-white backdrop-blur-xl shadow-[0_24px_50px_-12px_rgba(0,0,0,0.7)] rounded-[32px] p-5 sm:p-8 relative z-10">
                <CardHeader className="space-y-3 p-0 pb-6 text-center sm:text-left">
                    <div className="flex justify-center sm:justify-start items-center gap-3">
                        <img src={logo} alt="KS Logo" className="h-8 w-8 object-contain animate-pulse" />
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                            <Sparkles className="w-3 h-3 text-indigo-400" />
                            <span className="text-[9px] font-black uppercase tracking-widest">KS Career Suite</span>
                        </div>
                    </div>
                    <div>
                        <CardTitle className="text-2xl font-black tracking-tight text-white mt-2">Create Account</CardTitle>
                        <CardDescription className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                            Enter your coordinates below to claim your free career sandbox workspace.
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-xl text-left">
                                {error}
                            </div>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2 text-left">
                                <Label htmlFor="first-name" className="text-xs font-bold uppercase tracking-wider text-slate-400">First Name</Label>
                                <Input
                                    id="first-name"
                                    placeholder="John"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                    className="bg-slate-900/40 border-slate-800 hover:border-slate-700 text-white placeholder-slate-650 focus-visible:ring-indigo-500 focus-visible:ring-offset-slate-950 rounded-xl"
                                />
                            </div>
                            <div className="space-y-2 text-left">
                                <Label htmlFor="last-name" className="text-xs font-bold uppercase tracking-wider text-slate-400">Last Name</Label>
                                <Input
                                    id="last-name"
                                    placeholder="Doe"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                    className="bg-slate-900/40 border-slate-800 hover:border-slate-700 text-white placeholder-slate-650 focus-visible:ring-indigo-500 focus-visible:ring-offset-slate-950 rounded-xl"
                                />
                            </div>
                        </div>
                        <div className="space-y-2 text-left">
                            <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-slate-400">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="bg-slate-900/40 border-slate-800 hover:border-slate-700 text-white placeholder-slate-650 focus-visible:ring-indigo-500 focus-visible:ring-offset-slate-950 rounded-xl"
                            />
                        </div>
                        <div className="space-y-2 text-left">
                            <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-slate-400">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="bg-slate-900/40 border-slate-800 hover:border-slate-700 text-white placeholder-slate-650 focus-visible:ring-indigo-500 focus-visible:ring-offset-slate-950 rounded-xl"
                            />
                        </div>
                        <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl h-11 border-none transition-all shadow-lg hover:shadow-indigo-500/25 mt-4" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Account
                        </Button>
                    </form>
                    <div className="mt-6 text-center text-xs">
                        <span className="text-slate-500">Already have an account? </span>
                        <Link to="/auth/login" className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors">
                            Sign In
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
