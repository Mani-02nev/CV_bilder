import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
    ArrowLeft,
    Save,
    Crown,
    Loader2,
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    RefreshCw,
    Lock,
    CheckCircle
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useProfile } from '@/hooks/useProfile'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export default function ProfilePage() {
    const navigate = useNavigate()
    const { user, signOut } = useAuth()
    const { data: profile, isLoading } = useProfile()
    const [isSaving, setIsSaving] = useState(false)

    const [formData, setFormData] = useState({
        full_name: '',
        phone: '',
        location: ''
    })

    useEffect(() => {
        if (profile) {
            setFormData({
                full_name: profile.full_name || '',
                phone: profile.phone || '',
                location: profile.location || ''
            })
        }
    }, [profile])

    const getInitials = () => {
        if (formData.full_name) {
            const parts = formData.full_name.trim().split(/\s+/);
            if (parts.length > 1) {
                return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
            }
            return parts[0].slice(0, 2).toUpperCase();
        }
        if (user?.email) {
            return user.email.slice(0, 2).toUpperCase();
        }
        return 'U';
    }

    const handleSave = async () => {
        if (!user) return

        setIsSaving(true)
        try {
            const updateData: any = {
                updated_at: new Date().toISOString()
            }

            updateData.full_name = formData.full_name
            updateData.phone = formData.phone
            updateData.location = formData.location

            const { error } = await supabase
                .from('profiles')
                .update(updateData)
                .eq('id', user.id)

            if (error) {
                if (error.code === '42703') {
                    throw new Error('Database schema mismatch: Missing columns in profiles table. Please run the provided SQL migration in Supabase.')
                }
                throw error
            }

            toast.success('Profile updated successfully!')
        } catch (error: any) {
            console.error('Failed to update profile:', error)
            toast.error(error.message || 'Failed to update profile. Please try again.')
        } finally {
            setIsSaving(false)
        }
    }

    const handleSignOut = async () => {
        await signOut()
        navigate('/')
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#030712]">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
                    <span className="text-sm text-slate-400 font-medium tracking-wide">Syncing profile...</span>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#030712] text-white font-sans selection:bg-indigo-500/20 selection:text-indigo-400 relative overflow-x-hidden pb-12">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[130px] -z-10 pointer-events-none" />
            <div className="absolute bottom-1/3 left-10 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[130px] -z-10 pointer-events-none" />

            {/* Premium Navigation Header */}
            <header className="h-16 border-b border-slate-900/80 flex items-center justify-between px-4 sm:px-6 bg-slate-950/65 backdrop-blur-xl sticky top-0 z-35">
                <div className="flex items-center gap-2 sm:gap-4">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-slate-400 hover:text-white hover:bg-slate-900/55 rounded-xl transition-all duration-200"
                        onClick={() => navigate('/dashboard')}
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">Back to Dashboard</span>
                        <span className="inline sm:hidden">Back</span>
                    </Button>
                    <Separator orientation="vertical" className="h-5 bg-slate-800" />
                    <h1 className="text-xs sm:text-sm font-black text-white tracking-widest uppercase">My Profile</h1>
                </div>
                <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-slate-800 bg-slate-900/30 text-slate-300 hover:bg-slate-900 hover:text-white rounded-xl transition-all duration-200" 
                    onClick={handleSignOut}
                >
                    Sign Out
                </Button>
            </header>

            {/* Profile Workspace Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 mt-8 space-y-6">
                
                {/* Hero Header Profile Card */}
                <div className="relative overflow-hidden rounded-3xl border border-slate-900 bg-gradient-to-b from-slate-950/80 to-slate-950/40 p-6 sm:p-8 backdrop-blur-md shadow-2xl flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
                    
                    {/* Gradient Avatar with initials */}
                    <div className="relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 text-white font-extrabold text-2xl sm:text-3xl shadow-xl ring-4 ring-indigo-500/10 shrink-0">
                        {getInitials()}
                        <div className="absolute bottom-0 right-0 bg-slate-950 p-1.5 rounded-full border border-slate-800">
                            <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-indigo-400" />
                        </div>
                    </div>

                    <div className="flex-1 text-center sm:text-left space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-center sm:justify-start gap-2.5">
                            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                                {formData.full_name || 'Awaiting Profile Update'}
                            </h2>
                            <div className="flex justify-center">
                                {profile?.is_pro ? (
                                    <Badge className="gap-1 bg-gradient-to-r from-yellow-500 to-amber-500 text-black border-none rounded-full px-3 py-1 font-bold text-[9px] sm:text-[10px] tracking-widest uppercase shadow-lg shadow-amber-500/15">
                                        <Crown className="h-3 w-3 fill-black text-black" />
                                        PRO MEMBER
                                    </Badge>
                                ) : (
                                    <Badge variant="outline" className="border-slate-800 text-slate-400 bg-slate-900/60 rounded-full px-3 py-1 font-bold text-[9px] sm:text-[10px] tracking-widest uppercase">
                                        FREE USER
                                    </Badge>
                                )}
                            </div>
                        </div>
                        <p className="text-slate-405 text-sm flex items-center justify-center sm:justify-start gap-2">
                            <Mail className="h-4 w-4 text-slate-500" />
                            {user?.email}
                        </p>
                    </div>
                </div>

                {/* Main section: grid of details & pro-promotion */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* Left Column: Forms */}
                    <div className="lg:col-span-8 space-y-6">
                        <Card className="bg-slate-950/40 border-slate-900 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden text-white">
                            <CardHeader className="border-b border-slate-900/60 pb-5 px-6 sm:px-8">
                                <CardTitle className="text-base font-bold text-white">Profile Coordinates</CardTitle>
                                <CardDescription className="text-slate-400 text-xs mt-1">Configure your personal contact data for resume imports</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 sm:p-8 space-y-6">
                                
                                <div className="space-y-2.5 text-left">
                                    <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                                        <Mail className="h-3.5 w-3.5 text-slate-500" />
                                        Email Coordinates
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="email"
                                            type="email"
                                            value={user?.email || ''}
                                            disabled
                                            className="bg-slate-900/15 border-slate-900/50 text-slate-500 rounded-xl cursor-not-allowed h-12 pr-10 border-dashed"
                                        />
                                        <Lock className="absolute right-3.5 top-3.5 h-5 w-5 text-slate-600" />
                                    </div>
                                    <p className="text-[10px] text-slate-500 leading-relaxed pl-1">
                                        Your authentication email is locked and cannot be changed.
                                    </p>
                                </div>

                                <Separator className="bg-slate-900/60" />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-2.5 text-left md:col-span-2">
                                        <Label htmlFor="full_name" className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                                            <User className="h-3.5 w-3.5 text-slate-500" />
                                            Full Name
                                        </Label>
                                        <Input
                                            id="full_name"
                                            value={formData.full_name}
                                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                            placeholder="Karuppasamy M"
                                            className="bg-slate-950/40 border-slate-900 hover:border-slate-800/80 text-white placeholder-slate-650 focus:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/10 rounded-xl h-12 px-4 transition-all duration-200"
                                        />
                                    </div>

                                    <div className="space-y-2.5 text-left">
                                        <Label htmlFor="phone" className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                                            <Phone className="h-3.5 w-3.5 text-slate-500" />
                                            Phone Number
                                        </Label>
                                        <Input
                                            id="phone"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            placeholder="+91 8270374293"
                                            className="bg-slate-950/40 border-slate-900 hover:border-slate-800/80 text-white placeholder-slate-650 focus:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/10 rounded-xl h-12 px-4 transition-all duration-200"
                                        />
                                    </div>

                                    <div className="space-y-2.5 text-left">
                                        <Label htmlFor="location" className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                                            <MapPin className="h-3.5 w-3.5 text-slate-500" />
                                            Location
                                        </Label>
                                        <Input
                                            id="location"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            placeholder="Tamil Nadu, India"
                                            className="bg-slate-950/40 border-slate-900 hover:border-slate-800/80 text-white placeholder-slate-650 focus:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/10 rounded-xl h-12 px-4 transition-all duration-200"
                                        />
                                    </div>
                                </div>

                                <div className="pt-3 border-t border-slate-900/60 flex justify-end">
                                    <Button 
                                        onClick={handleSave} 
                                        disabled={isSaving} 
                                        className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-xl h-12 px-6 border-none transition-all duration-200 shadow-lg shadow-indigo-600/15 active:scale-[0.98]"
                                    >
                                        {isSaving ? (
                                            <>
                                                <Loader2 className="h-4.5 w-4.5 mr-2 animate-spin" />
                                                Saving Changes...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="h-4.5 w-4.5 mr-2" />
                                                Save Changes
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Upgrade Promo and Meta Info */}
                    <div className="lg:col-span-4 space-y-6">
                        
                        {/* Premium Pro Upgrade Banner */}
                        {!profile?.is_pro ? (
                            <Card className="relative overflow-hidden bg-gradient-to-b from-slate-950 to-indigo-950/40 border-indigo-900/30 backdrop-blur-md rounded-3xl p-6 shadow-2xl flex flex-col justify-between text-left">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/5 rounded-full blur-xl pointer-events-none" />
                                <div className="space-y-4">
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded-full font-bold text-[9px] tracking-widest uppercase">
                                        <Crown className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                        PRO MEMBERSHIP
                                    </div>
                                    <div className="space-y-1.5">
                                        <h3 className="text-lg font-black tracking-tight text-white">Upgrade to Pro</h3>
                                        <p className="text-slate-400 text-xs leading-relaxed">
                                            Empower your resume builder with state-of-the-art AI tailoring features.
                                        </p>
                                    </div>
                                    
                                    <Separator className="bg-slate-900/60" />
                                    
                                    <ul className="space-y-2.5">
                                        <li className="flex items-start gap-2.5 text-xs text-slate-300">
                                            <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                                            <span>12+ Premium Recruiter layouts</span>
                                        </li>
                                        <li className="flex items-start gap-2.5 text-xs text-slate-300">
                                            <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                                            <span>Unlimited AI Resume Optimizer</span>
                                        </li>
                                        <li className="flex items-start gap-2.5 text-xs text-slate-300">
                                            <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                                            <span>Full Recruiter Score & Analysis</span>
                                        </li>
                                        <li className="flex items-start gap-2.5 text-xs text-slate-300">
                                            <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                                            <span>Watermark-free ultra PDF exports</span>
                                        </li>
                                    </ul>
                                </div>
                                
                                <div className="pt-6">
                                    <a
                                        href="https://wa.me/918270374293?text=Hi!%20I'm%20interested%20in%20upgrading%20to%20Pro%20plan"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block w-full"
                                    >
                                        <Button className="w-full gap-2 bg-yellow-500 hover:bg-yellow-600 text-black font-extrabold rounded-xl h-11 border-none shadow-[0_0_20px_rgba(234,179,8,0.15)] hover:shadow-[0_0_25px_rgba(234,179,8,0.3)] transition-all duration-200 scale-100 hover:scale-[1.02]">
                                            <Crown className="h-4.5 w-4.5 fill-black text-black" />
                                            Unlock Pro Access
                                        </Button>
                                    </a>
                                </div>
                            </Card>
                        ) : (
                            <Card className="bg-gradient-to-b from-slate-950 to-indigo-950/20 border-slate-900 rounded-3xl p-6 text-left relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
                                <div className="space-y-3">
                                    <h3 className="text-base font-bold text-emerald-400 flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5" />
                                        <span>Pro Membership Active</span>
                                    </h3>
                                    <p className="text-slate-400 text-xs leading-relaxed">
                                        You have full premium access. All templates, AI features, and high-density exports are unlocked in your workspace.
                                    </p>
                                </div>
                            </Card>
                        )}

                        {/* Account Metadata Stats */}
                        <Card className="bg-slate-950/40 border-slate-900 backdrop-blur-md rounded-3xl p-6 text-left">
                            <div className="space-y-4">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Account Integrity</h4>
                                <div className="space-y-3.5 font-sans text-xs">
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-400 flex items-center gap-1.5">
                                            <Calendar className="h-3.5 w-3.5 text-slate-500" />
                                            Created
                                        </span>
                                        <span className="font-semibold text-slate-200">
                                            {profile?.created_at ? new Date(profile.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                                        </span>
                                    </div>
                                    <Separator className="bg-slate-900/50" />
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-400 flex items-center gap-1.5">
                                            <RefreshCw className="h-3.5 w-3.5 text-slate-500" />
                                            Synced
                                        </span>
                                        <span className="font-semibold text-slate-200">
                                            {profile?.updated_at ? new Date(profile.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Card>

                    </div>
                </div>

            </div>
        </div>
    )
}
