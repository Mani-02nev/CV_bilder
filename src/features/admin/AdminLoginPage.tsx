import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, Lock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import logo from '@/assets/logo.png'

export default function AdminLoginPage() {
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

            if (password === adminPassword) {
                // Store admin session in sessionStorage (expires when tab closes)
                sessionStorage.setItem('isAdmin', 'true')
                toast.success('Admin access granted')
                navigate('/admin/dashboard')
            } else {
                setError('Invalid admin password')
            }
        } catch (err) {
            setError('Login failed. Please try again.')
        } finally {
            setLoading(false)
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

            {/* Background glowing lights */}
            <div className="absolute top-0 inset-x-0 h-80 bg-gradient-to-b from-indigo-500/10 to-transparent blur-3xl pointer-events-none" />
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-indigo-600/5 rounded-full blur-[150px] pointer-events-none" />

            <Card className="w-full max-w-[420px] bg-slate-950/40 border border-slate-900 text-white backdrop-blur-xl shadow-[0_24px_50px_-12px_rgba(0,0,0,0.7)] rounded-[32px] p-6 sm:p-8 relative z-10">
                <CardHeader className="space-y-3 p-0 pb-6 text-center">
                    <div className="mx-auto flex items-center justify-center gap-3">
                        <img src={logo} alt="KS Logo" className="h-10 w-10 object-contain" />
                        <div className="w-10 h-10 bg-indigo-500/10 border border-indigo-500/25 rounded-2xl flex items-center justify-center">
                            <Shield className="h-5 w-5 text-indigo-400" />
                        </div>
                    </div>
                    <div>
                        <CardTitle className="text-2xl font-black tracking-tight mt-2">Admin Portal</CardTitle>
                        <CardDescription className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                            Enter the secure administration coordinates to access management pipelines.
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2 text-left">
                            <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-slate-400">Secret Admin Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="bg-slate-900/40 border-slate-800 hover:border-slate-700 text-white placeholder-slate-600 focus:border-indigo-500 focus-visible:ring-1 focus-visible:ring-indigo-500/50 rounded-xl h-11 px-3.5 transition-colors"
                            />
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3.5 rounded-xl font-medium">
                                {error}
                            </div>
                        )}

                        <Button type="submit" className="w-full gap-2 h-11 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl border-none transition-all shadow-lg hover:shadow-indigo-500/25 mt-2" disabled={loading}>
                            <Lock className="h-4 w-4" />
                            {loading ? 'Verifying...' : 'Access Admin Panel'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
