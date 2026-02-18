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
    Menu
} from "lucide-react"
import { useResumes, useCreateResume, useDeleteResume, useDuplicateResume } from "@/hooks/useResume"
import { useAuth } from "@/context/AuthContext"
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

export default function DashboardPage() {
    const navigate = useNavigate()
    const { user, signOut } = useAuth()
    const { data: resumes, isLoading } = useResumes()
    const createResume = useCreateResume()
    const deleteResume = useDeleteResume()
    const duplicateResume = useDuplicateResume()

    const [showCreateDialog, setShowCreateDialog] = useState(false)
    const [newResumeTitle, setNewResumeTitle] = useState("")

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
        <div className="flex flex-col h-full">
            <div className="flex items-center gap-2 font-bold text-xl mb-8 px-2">
                <img src={logo} alt="KS RESUME Bilder" className="h-8 w-8 object-contain" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">RESUME Bilder</span>
            </div>

            <nav className="space-y-2 flex-1">
                <Link
                    to="/dashboard"
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${location.pathname === '/dashboard' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted font-medium'}`}
                >
                    <FileText className="h-4 w-4" />
                    My Resumes
                </Link>
                <Link
                    to="/profile"
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${location.pathname === '/profile' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted font-medium'}`}
                >
                    <User className="h-4 w-4" />
                    My Profile
                </Link>
            </nav>

            <div className="border-t pt-4 space-y-2">
                <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span className="truncate">{user?.email}</span>
                </div>
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-2"
                    onClick={handleSignOut}
                >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                </Button>
            </div>
        </div>
    )

    return (
        <div className="flex h-screen bg-muted/20">
            {/* Sidebar - Desktop */}
            <aside className="w-64 bg-background border-r p-6 hidden md:flex flex-col">
                <SidebarContent />
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="max-w-7xl mx-auto p-4 sm:p-8">
                    <header className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">My Resumes</h1>
                            <p className="text-muted-foreground">
                                Create and manage your professional resumes
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="md:hidden">
                                        <Menu className="h-5 w-5" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-64 p-6">
                                    <SidebarContent />
                                </SheetContent>
                            </Sheet>

                            <Button onClick={() => navigate('/create-resume')} size="sm" className="gap-1 sm:gap-2">
                                <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                                <span className="hidden sm:inline">Create New Resume</span>
                                <span className="sm:hidden">New</span>
                            </Button>
                        </div>
                    </header>

                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map((i) => (
                                <Card key={i}>
                                    <CardHeader>
                                        <Skeleton className="h-40 w-full" />
                                    </CardHeader>
                                    <CardContent>
                                        <Skeleton className="h-4 w-3/4 mb-2" />
                                        <Skeleton className="h-3 w-1/2" />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : resumes && resumes.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {resumes.map((resume) => (
                                <Card
                                    key={resume.id}
                                    className="group hover:shadow-lg transition-shadow cursor-pointer relative"
                                >
                                    <div onClick={() => navigate(`/builder/${resume.id}`)}>
                                        <CardHeader>
                                            <div className="h-40 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center mb-4">
                                                <FileText className="h-16 w-16 text-primary/40" />
                                            </div>
                                            <CardTitle className="flex items-center justify-between">
                                                <span className="truncate">{resume.title}</span>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={(e) => {
                                                            e.stopPropagation()
                                                            navigate(`/builder/${resume.id}`)
                                                        }}>
                                                            <Pencil className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={(e) => {
                                                            e.stopPropagation()
                                                            handleDuplicate(resume.id)
                                                        }}>
                                                            <Copy className="mr-2 h-4 w-4" />
                                                            Duplicate
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                handleDelete(resume.id)
                                                            }}
                                                            className="text-destructive"
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </CardTitle>
                                            <CardDescription>
                                                Updated {new Date(resume.updated_at).toLocaleDateString()}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex gap-2">
                                                <Badge variant="secondary">{resume.template_id}</Badge>
                                                <Badge variant={resume.status === 'published' ? 'default' : 'outline'}>
                                                    {resume.status}
                                                </Badge>
                                            </div>
                                        </CardContent>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card className="p-12 text-center">
                            <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-xl font-semibold mb-2">No resumes yet</h3>
                            <p className="text-muted-foreground mb-6">
                                Create your first professional resume to get started
                            </p>
                            <Button onClick={() => navigate('/create-resume')} size="lg">
                                <Plus className="mr-2 h-5 w-5" />
                                Create Your First Resume
                            </Button>
                        </Card>
                    )}
                </div>
            </main>

            {/* Create Resume Dialog */}
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Resume</DialogTitle>
                        <DialogDescription>
                            Give your resume a title to get started
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Resume Title</Label>
                            <Input
                                id="title"
                                placeholder="e.g., Software Engineer Resume"
                                value={newResumeTitle}
                                onChange={(e) => setNewResumeTitle(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleCreateResume()
                                }}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleCreateResume}
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
