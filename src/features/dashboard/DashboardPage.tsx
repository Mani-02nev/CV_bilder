import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
    FileText,
    Plus,
    MoreVertical,
    Pencil,
    Copy,
    Trash2,
    LogOut,
    User,
    Menu,
    Crown,
    ExternalLink,
    BookOpen
} from "lucide-react"
import { useResumes, useCreateResume, useDeleteResume, useDuplicateResume } from "@/hooks/useResume"
import { useAuth } from "@/context/AuthContext"
import { useProfile } from "@/hooks/useProfile"
import { useState } from "react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import { useLocation } from "react-router-dom"
import logo from "@/assets/logo.png"
import { productData } from "../products/productData"
import * as LucideIcons from "lucide-react"

export default function DashboardPage() {
    const navigate = useNavigate()
    const { user, signOut } = useAuth()
    const { data: resumes, isLoading } = useResumes()
    const createResume = useCreateResume()
    const deleteResume = useDeleteResume()
    const duplicateResume = useDuplicateResume()

    const { data: profile } = useProfile()
    const isPro = profile?.is_pro || false

    const [showCreateDialog, setShowCreateDialog] = useState(false)
    const [showUpgradeDialog, setShowUpgradeDialog] = useState(false)
    const [newResumeTitle, setNewResumeTitle] = useState("")
    const [activeSection, setActiveSection] = useState<'resumes' | 'tools'>('resumes')

    const productSlugsAndIcons: Record<string, keyof typeof LucideIcons> = {
        "resume-builder": "Sparkles",
        "ats-checker": "Search",
        "resume-score": "Zap",
        "resume-analyzer": "FileText",
        "resume-templates": "Layout"
    }

    const tools = Object.entries(productData).map(([slug, data]) => {
        const iconName = productSlugsAndIcons[slug] || "FileText"
        const IconComponent = (LucideIcons[iconName] as any) || LucideIcons.FileText
        return {
            slug,
            icon: IconComponent,
            ...data
        }
    })

    const handleCreateNewClick = () => {
        if (!isPro && resumes && resumes.length >= 1) {
            setShowUpgradeDialog(true)
            return
        }
        navigate('/create-resume')
    }

    const handleCreateResume = async () => {
        if (!newResumeTitle.trim()) return

        try {
            const resume = await createResume.mutateAsync({
                title: newResumeTitle,
                templateId: 'modern'
            })
            setShowCreateDialog(false)
            setNewResumeTitle("")
            navigate(`/builder/${resume.id}`)
        } catch (error) {
            console.error('Failed to create resume:', error)
        }
    }

    const handleDuplicate = async (id: string) => {
        try {
            const newResume = await duplicateResume.mutateAsync(id)
            navigate(`/builder/${newResume.id}`)
        } catch (error) {
            console.error('Failed to duplicate resume:', error)
        }
    }

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this resume?')) {
            try {
                await deleteResume.mutateAsync(id)
            } catch (error) {
                console.error('Failed to delete resume:', error)
            }
        }
    }

    const handleSignOut = async () => {
        await signOut()
        navigate('/')
    }

    const location = useLocation()

    const SidebarContent = () => (
        <div className="flex flex-col h-full font-sans">
            <div className="flex items-center gap-2.5 font-extrabold text-xl mb-8 px-2">
                <img src={logo} alt="KS RESUME Bilder" className="h-8 w-8 object-contain" />
                <span className="text-white">KS RESUME <span className="text-indigo-400 font-medium">Bilder</span></span>
            </div>

            <nav className="space-y-1.5 flex-1">
                <button
                    onClick={() => {
                        setActiveSection('resumes')
                        navigate('/dashboard')
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all border text-left ${activeSection === 'resumes' && location.pathname === '/dashboard' ? 'bg-indigo-600/10 text-indigo-400 font-semibold border-indigo-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-900/50 border-transparent font-medium'}`}
                >
                    <FileText className="h-4 w-4" />
                    My Resumes
                </button>
                <button
                    onClick={() => {
                        setActiveSection('tools')
                        navigate('/dashboard')
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all border text-left ${activeSection === 'tools' && location.pathname === '/dashboard' ? 'bg-indigo-600/10 text-indigo-400 font-semibold border-indigo-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-900/50 border-transparent font-medium'}`}
                >
                    <LucideIcons.Crown className="h-4 w-4" />
                    AI Career Suite
                </button>
                <Link
                    to="/blog"
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all border ${location.pathname.startsWith('/blog') ? 'bg-indigo-600/10 text-indigo-400 font-semibold border-indigo-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-900/50 border-transparent font-medium'}`}
                >
                    <BookOpen className="h-4 w-4" />
                    Career Blog
                </Link>
                <Link
                    to="/profile"
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all border ${location.pathname === '/profile' ? 'bg-indigo-600/10 text-indigo-400 font-semibold border-indigo-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-900/50 border-transparent font-medium'}`}
                >
                    <User className="h-4 w-4" />
                    My Profile
                </Link>
            </nav>

            <div className="border-t border-slate-900 pt-4 space-y-2">
                <div className="flex items-center gap-2 px-3 py-2 text-xs text-slate-500">
                    <User className="h-3.5 w-3.5" />
                    <span className="truncate">{user?.email}</span>
                </div>
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-2.5 text-slate-400 hover:text-white hover:bg-slate-900/50 rounded-xl h-10"
                    onClick={handleSignOut}
                >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                </Button>
            </div>
        </div>
    )

    return (
        <div className="flex h-screen bg-[#030712] text-white">
            {/* Sidebar - Desktop */}
            <aside className="w-64 bg-slate-950/60 border-r border-slate-900 p-6 hidden md:flex flex-col backdrop-blur-md">
                <SidebarContent />
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="max-w-7xl mx-auto p-6 sm:p-8 space-y-8">
                    <header className="flex justify-between items-center pb-6 border-b border-slate-900">
                        <div>
                            <h1 className="text-3xl font-black tracking-tight mb-2">
                                {activeSection === 'resumes' ? 'My Resumes' : 'AI Career Suite'}
                            </h1>
                            <p className="text-slate-400 text-sm">
                                {activeSection === 'resumes' 
                                    ? 'Create and manage your professional ATS-optimized resumes' 
                                    : 'Supercharge your application cycle with our intelligence-driven toolkit'}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="md:hidden text-slate-400 hover:text-white hover:bg-slate-900">
                                        <Menu className="h-5 w-5" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-64 p-6 bg-slate-950 border-slate-900 text-white">
                                    <SidebarContent />
                                </SheetContent>
                            </Sheet>

                            {activeSection === 'resumes' && (
                                <Button onClick={handleCreateNewClick} size="sm" className="gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl px-4 py-2">
                                    <Plus className="h-4 w-4" />
                                    <span className="hidden sm:inline">Create New Resume</span>
                                    <span className="sm:hidden">New</span>
                                </Button>
                            )}
                        </div>
                    </header>

                    {activeSection === 'resumes' ? (
                        isLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[1, 2, 3].map((i) => (
                                    <Card key={i} className="bg-slate-950/40 border-slate-900">
                                        <CardHeader>
                                            <Skeleton className="h-40 w-full bg-slate-900/50" />
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <Skeleton className="h-4 w-3/4 bg-slate-900/50" />
                                            <Skeleton className="h-3 w-1/2 bg-slate-900/50" />
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : resumes && resumes.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {resumes.map((resume) => (
                                    <Card
                                        key={resume.id}
                                        className="group bg-slate-950/40 hover:bg-slate-900/20 border-slate-900 hover:border-indigo-500/50 transition-all duration-300 cursor-pointer relative overflow-hidden rounded-2xl shadow-xl flex flex-col justify-between"
                                    >
                                        <div onClick={() => navigate(`/builder/${resume.id}`)} className="p-5 flex-1 flex flex-col">
                                            <div className="h-40 bg-gradient-to-br from-indigo-950/20 to-slate-900/40 border border-slate-800/40 rounded-xl flex items-center justify-center mb-4 transition-colors group-hover:from-indigo-950/30 group-hover:to-slate-900/60">
                                                <FileText className="h-16 w-16 text-indigo-400/40 group-hover:scale-105 transition-transform" />
                                            </div>
                                            <CardTitle className="flex items-center justify-between gap-2 text-base font-bold text-white mb-1">
                                                <span className="truncate">{resume.title}</span>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-900">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="bg-slate-950 border-slate-900 text-slate-300 w-40 font-sans p-1.5 rounded-xl">
                                                        <DropdownMenuItem onClick={(e) => {
                                                            e.stopPropagation()
                                                            navigate(`/builder/${resume.id}`)
                                                        }} className="hover:bg-slate-900 hover:text-white focus:bg-slate-900 focus:text-white cursor-pointer py-2 rounded-lg transition-colors">
                                                            <Pencil className="mr-2.5 h-4 w-4 text-slate-400" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={(e) => {
                                                            e.stopPropagation()
                                                            if (!isPro && resumes && resumes.length >= 1) {
                                                                setShowUpgradeDialog(true)
                                                                return
                                                            }
                                                            handleDuplicate(resume.id)
                                                        }} className="hover:bg-slate-900 hover:text-white focus:bg-slate-900 focus:text-white cursor-pointer py-2 rounded-lg transition-colors">
                                                            <Copy className="mr-2.5 h-4 w-4 text-slate-400" />
                                                            Duplicate
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                handleDelete(resume.id)
                                                            }}
                                                            className="text-red-400 hover:bg-red-500/10 hover:text-red-300 focus:bg-red-500/10 focus:text-red-300 cursor-pointer py-2 rounded-lg transition-colors"
                                                        >
                                                            <Trash2 className="mr-2.5 h-4 w-4" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </CardTitle>
                                            <CardDescription className="text-slate-500 text-xs">
                                                Updated {new Date(resume.updated_at).toLocaleDateString()}
                                            </CardDescription>
                                        </div>
                                        <div className="px-5 pb-5 pt-2 border-t border-slate-900/50 flex gap-2">
                                            <Badge className="bg-slate-900 border border-slate-800 text-slate-400 text-[10px] font-semibold tracking-wider hover:bg-slate-900 capitalize">{resume.template_id}</Badge>
                                            <Badge className={`border text-[10px] font-semibold tracking-wider uppercase ${resume.status === 'published' ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                                                {resume.status}
                                            </Badge>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Card className="p-16 text-center bg-slate-950/40 border-slate-900 backdrop-blur-md rounded-3xl max-w-2xl mx-auto space-y-6">
                                <div className="w-16 h-16 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-center mx-auto text-indigo-400">
                                    <FileText className="h-8 w-8" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-white">No resumes yet</h3>
                                    <p className="text-slate-400 text-sm max-w-sm mx-auto">
                                        Create your first professional resume to get started with AI guidance.
                                    </p>
                                </div>
                                <Button onClick={handleCreateNewClick} size="lg" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl px-6">
                                    <Plus className="mr-2 h-5 w-5" />
                                    Create Your First Resume
                                </Button>
                            </Card>
                        )
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
                            {tools.map((tool) => {
                                const Icon = tool.icon
                                return (
                                    <Card
                                        key={tool.slug}
                                        onClick={() => {
                                            if (tool.slug === 'resume-builder') {
                                                setActiveSection('resumes')
                                            } else if (tool.slug === 'resume-templates') {
                                                navigate('/create-resume')
                                            } else if (resumes && resumes.length > 0) {
                                                navigate(`/builder/${resumes[0].id}?tab=ats`)
                                            } else {
                                                handleCreateNewClick()
                                            }
                                        }}
                                        className="group bg-slate-950/40 hover:bg-slate-900/20 border-slate-900 hover:border-indigo-500/50 transition-all duration-300 cursor-pointer rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between"
                                    >
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                                                    <Icon className="w-5 h-5" />
                                                </div>
                                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest bg-slate-900 px-2.5 py-0.5 rounded-full border border-slate-800">
                                                    {tool.slug === 'resume-builder' ? 'Active Builder' : 'Open Tool'}
                                                </span>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
                                                    {tool.title}
                                                </h3>
                                                <p className="text-slate-400 text-xs mt-2 leading-relaxed line-clamp-3">
                                                    {tool.description}
                                                </p>
                                            </div>
                                            <div className="flex flex-wrap gap-1.5 pt-1">
                                                {tool.keywords.slice(0, 2).map((kw) => (
                                                    <span key={kw} className="text-[9px] text-slate-500 font-semibold px-2 py-0.5 bg-slate-900/50 border border-slate-800/80 rounded-full">
                                                        {kw}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="pt-4 mt-4 border-t border-slate-900/50 flex justify-between items-center">
                                            <span className="text-xs font-bold text-slate-450 group-hover:text-indigo-400 transition-colors">
                                                {tool.slug === 'resume-builder' 
                                                    ? 'Go to Resumes' 
                                                    : (tool.slug === 'resume-templates' ? 'Choose Template' : 'Launch Tool')}
                                            </span>
                                            <LucideIcons.ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                                        </div>
                                    </Card>
                                )
                            })}
                        </div>
                    )}
                </div>
            </main>

            {/* Upgrade Plan Dialog */}
            <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
                <DialogContent className="sm:max-w-md bg-slate-950 border-slate-900 text-white">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2.5 text-xl font-black">
                            <Crown className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                            Upgrade Your Plan
                        </DialogTitle>
                        <DialogDescription className="pt-2 text-sm text-slate-400 leading-relaxed">
                            You've reached the **1 resume limit** on the Free Plan. Unlock unlimited access today.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-850 text-sm space-y-3">
                        <p className="font-bold text-indigo-400">Pro Plan Includes:</p>
                        <ul className="space-y-2 text-slate-350">
                            <li className="flex items-center gap-2">✅ Create Unlimited Resumes</li>
                            <li className="flex items-center gap-2">✅ 12+ Premium Templates</li>
                            <li className="flex items-center gap-2">✅ Professional Profile Photos</li>
                            <li className="flex items-center gap-2">✅ AI Multi-Job Suggestions</li>
                            <li className="flex items-center gap-2">✅ High Priority Support</li>
                        </ul>
                    </div>
                    <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-2">
                        <Button variant="ghost" onClick={() => setShowUpgradeDialog(false)} className="sm:flex-1 text-slate-400 hover:text-white hover:bg-slate-900">
                            Maybe Later
                        </Button>
                        <Button
                            className="sm:flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-bold gap-2"
                            onClick={() => window.open('https://wa.me/918270374293?text=Hi!%20I\'m%20interested%20in%20upgrading%20to%20KS%20Resume%20Bilder%20Pro%20Plan', '_blank')}
                        >
                            Upgrade to Pro
                            <ExternalLink className="w-4 h-4" />
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Create Resume Dialog */}
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogContent className="bg-slate-950 border-slate-900 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">Create New Resume</DialogTitle>
                        <DialogDescription className="text-slate-400 text-sm">
                            Give your resume a title to get started
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-slate-300 text-sm font-semibold">Resume Title</Label>
                            <Input
                                id="title"
                                placeholder="e.g., Software Engineer Resume"
                                value={newResumeTitle}
                                onChange={(e) => setNewResumeTitle(e.target.value)}
                                className="bg-slate-900/60 border-slate-800 text-white placeholder-slate-600 focus:border-indigo-500 focus:ring-indigo-500/50"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleCreateResume()
                                }}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowCreateDialog(false)} className="border-slate-800 bg-transparent text-slate-350 hover:bg-slate-900 hover:text-white">
                            Cancel
                        </Button>
                        <Button
                            onClick={handleCreateResume}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white"
                            disabled={!newResumeTitle.trim() || createResume.isPending}
                        >
                            {createResume.isPending ? 'Creating...' : 'Create Resume'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div >
    )
}
