import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff, Loader2, Sparkles, ArrowLeft } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/context/AuthContext"
import logo from "@/assets/logo.png"

export default function LoginPage() {
    const navigate = useNavigate()
    const { signInWithGoogle } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) throw error
            navigate('/dashboard')
        } catch (err: any) {
            setError(err.message || 'Failed to sign in')
        } finally {
            setIsLoading(false)
        }
    }

    const handleGoogleSignIn = async () => {
        setError("")
        setIsLoading(true)
        try {
            await signInWithGoogle()
        } catch (err: any) {
            setError(err.message || 'Failed to sign in with Google')
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

            {/* Background glowing grid/lights */}
            <div className="absolute top-0 inset-x-0 h-80 bg-gradient-to-b from-indigo-500/10 to-transparent blur-3xl pointer-events-none" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/5 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-[150px] pointer-events-none" />

            <div className="absolute top-8 left-8 z-20">
                <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors duration-200">
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </Link>
            </div>

            <Card className="w-full max-w-[420px] bg-slate-950/40 border border-slate-900 text-white backdrop-blur-xl shadow-[0_24px_50px_-12px_rgba(0,0,0,0.7)] rounded-[32px] p-6 sm:p-8 relative z-10">
                <CardHeader className="space-y-3 p-0 pb-6 text-center sm:text-left">
                    <div className="flex justify-center sm:justify-start items-center gap-3">
                        <img src={logo} alt="KS Logo" className="h-8 w-8 object-contain" />
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                            <Sparkles className="w-3 h-3 text-indigo-400" />
                            <span className="text-[9px] font-black uppercase tracking-widest">KS Career Suite</span>
                        </div>
                    </div>
                    <div>
                        <CardTitle className="text-3xl font-black tracking-tight text-white mt-2">Welcome Back</CardTitle>
                        <CardDescription className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                            Access your private workspace and check your real-time resume scores.
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="p-0 space-y-5">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3.5 rounded-xl font-medium">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2 text-left">
                            <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-slate-400">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="bg-slate-900/40 border-slate-800 hover:border-slate-700 text-white placeholder-slate-600 focus:border-indigo-500 focus-visible:ring-1 focus-visible:ring-indigo-500/50 rounded-xl h-11 px-3.5 transition-colors"
                            />
                        </div>
                        <div className="space-y-2 text-left">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-slate-400">Password</Label>
                                <Link to="/auth/forgot-password" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="bg-slate-900/40 border-slate-800 hover:border-slate-700 text-white placeholder-slate-600 focus:border-indigo-500 focus-visible:ring-1 focus-visible:ring-indigo-500/50 rounded-xl h-11 pl-3.5 pr-10 transition-colors"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-slate-500 hover:text-white"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                    <span className="sr-only">Toggle password visibility</span>
                                </Button>
                            </div>
                        </div>
                        <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl h-11 border-none transition-all shadow-lg hover:shadow-indigo-500/25 mt-2" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Sign In
                        </Button>
                    </form>
                    
                    <div className="relative py-2">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-slate-900/80" />
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
                            <span className="bg-[#0b0f19] px-3.5 text-slate-500 rounded-full border border-slate-900/60 py-0.5">Or continue with</span>
                        </div>
                    </div>
                    
                    <Button
                        variant="outline"
                        className="w-full bg-slate-900/30 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white hover:bg-slate-900/60 rounded-xl h-11 transition-all"
                        type="button"
                        disabled={isLoading}
                        onClick={handleGoogleSignIn}
                    >
                        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                            <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                            />
                        </svg>
                        Google
                    </Button>
                </CardContent>
                <CardFooter className="p-0 pt-6">
                    <div className="text-xs text-center text-slate-500 w-full">
                        Don't have an account?{" "}
                        <Link to="/auth/signup" className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors">
                            Create Account
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
