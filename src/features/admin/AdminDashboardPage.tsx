import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, Crown, Search, LogOut, CheckCircle, XCircle, Eye, Mail, Phone, MapPin, FileText, Calendar, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

interface User {
    id: string
    email: string
    created_at: string
    is_pro: boolean
}

export default function AdminDashboardPage() {
    const [users, setUsers] = useState<User[]>([])
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [userResumes, setUserResumes] = useState<any[]>([])
    const [loadingResumes, setLoadingResumes] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        // Check if admin is logged in
        const isAdmin = localStorage.getItem('isAdmin')
        if (!isAdmin) {
            navigate('/admin/login')
            return
        }

        fetchUsers()
    }, [navigate])

    const fetchUsers = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('profiles')
                .select('*') // Get all fields
                .order('created_at', { ascending: false })

            if (error) throw error
            setUsers(data || [])
        } catch (error) {
            console.error('Error fetching users:', error)
            toast.error('Failed to load users')
        } finally {
            setLoading(false)
        }
    }

    const fetchUserResumes = async (userId: string) => {
        try {
            setLoadingResumes(true)
            const { data, error } = await supabase
                .from('resumes')
                .select('id, title, updated_at, template_id, status')
                .eq('user_id', userId)

            if (error) throw error
            setUserResumes(data || [])
        } catch (error) {
            console.error('Error fetching resumes:', error)
            toast.error('Failed to load user resumes')
        } finally {
            setLoadingResumes(false)
        }
    }

    const handleViewUser = (user: User) => {
        setSelectedUser(user)
        fetchUserResumes(user.id)
    }

    const toggleProStatus = async (userId: string, currentStatus: boolean) => {
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ is_pro: !currentStatus })
                .eq('id', userId)

            if (error) throw error

            toast.success(`User ${!currentStatus ? 'upgraded to' : 'downgraded from'} Pro!`)
            fetchUsers() // Refresh the list
        } catch (error) {
            console.error('Error updating user:', error)
            toast.error('Failed to update user status')
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('isAdmin')
        navigate('/admin/login')
    }

    const filteredUsers = users.filter(user =>
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between px-4 md:px-6">
                    <div className="flex items-center gap-2 font-bold text-xl">
                        <Shield className="h-6 w-6 text-primary" />
                        <span>Admin Dashboard</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
                        <LogOut className="h-4 w-4" />
                        Logout
                    </Button>
                </div>
            </header>

            <main className="container px-4 md:px-6 py-8">
                {/* Stats */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardDescription>Total Users</CardDescription>
                            <CardTitle className="text-3xl">{users.length}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-3">
                            <CardDescription>Pro Users</CardDescription>
                            <CardTitle className="text-3xl text-primary">
                                {users.filter(u => u.is_pro).length}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-3">
                            <CardDescription>Free Users</CardDescription>
                            <CardTitle className="text-3xl">
                                {users.filter(u => !u.is_pro).length}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                {/* User Management */}
                <Card>
                    <CardHeader>
                        <CardTitle>User Management</CardTitle>
                        <CardDescription>
                            Upgrade or downgrade users to Pro plan
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        {/* User List */}
                        {loading ? (
                            <div className="text-center py-8 text-muted-foreground">
                                Loading users...
                            </div>
                        ) : filteredUsers.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                No users found
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {filteredUsers.map((user) => (
                                    <div
                                        key={user.id}
                                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium">{user.email}</p>
                                                {user.is_pro && (
                                                    <span className="flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                                        <Crown className="h-3 w-3" />
                                                        Pro
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                Joined: {new Date(user.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleViewUser(user)}
                                                className="gap-2"
                                            >
                                                <Eye className="h-4 w-4" />
                                                View Data
                                            </Button>
                                            <Button
                                                variant={user.is_pro ? "outline" : "default"}
                                                size="sm"
                                                onClick={() => toggleProStatus(user.id, user.is_pro)}
                                                className="gap-2"
                                            >
                                                {user.is_pro ? (
                                                    <>
                                                        <XCircle className="h-4 w-4" />
                                                        Downgrade
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircle className="h-4 w-4" />
                                                        Upgrade to Pro
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* User Details Modal */}
                <Dialog open={!!selectedUser} onOpenChange={(open: boolean) => !open && setSelectedUser(null)}>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-xl">
                                <User className="h-5 w-5 text-primary" />
                                User Details
                            </DialogTitle>
                            <DialogDescription>
                                Full profile and resumes for {selectedUser?.email}
                            </DialogDescription>
                        </DialogHeader>

                        {selectedUser && (
                            <div className="space-y-6 pt-4">
                                {/* Profile Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 rounded-lg bg-muted/50 space-y-3">
                                        <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Profile Bio</h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center gap-2">
                                                <User className="h-4 w-4 text-primary" />
                                                <span className="font-medium text-foreground">{(selectedUser as any).full_name || 'No Name Set'}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Mail className="h-4 w-4 text-primary" />
                                                <span>{selectedUser.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Phone className="h-4 w-4 text-primary" />
                                                <span>{(selectedUser as any).phone || 'Not provided'}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4 text-primary" />
                                                <span>{(selectedUser as any).location || 'Not provided'}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-primary" />
                                                <span>Joined: {new Date(selectedUser.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-lg bg-muted/50 space-y-3">
                                        <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Account Status</h4>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm">Plan:</span>
                                                <Badge variant={selectedUser.is_pro ? "default" : "outline"}>
                                                    {selectedUser.is_pro ? "PRO" : "FREE"}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm">Active:</span>
                                                <span className="text-sm font-medium">True</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* User Resumes */}
                                <div className="space-y-3">
                                    <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                        <FileText className="h-4 w-4" />
                                        Created Resumes ({userResumes.length})
                                    </h4>

                                    {loadingResumes ? (
                                        <div className="text-center py-4 text-sm text-muted-foreground italic">
                                            Loading resumes...
                                        </div>
                                    ) : userResumes.length === 0 ? (
                                        <div className="text-center py-4 bg-muted/20 rounded-lg text-sm text-muted-foreground">
                                            This user hasn't created any resumes yet.
                                        </div>
                                    ) : (
                                        <div className="grid gap-2">
                                            {userResumes.map((resume) => (
                                                <div key={resume.id} className="flex items-center justify-between p-3 border rounded-md text-sm">
                                                    <div>
                                                        <p className="font-medium">{resume.title}</p>
                                                        <p className="text-[10px] text-muted-foreground">
                                                            Template: {resume.template_id} • Updated: {new Date(resume.updated_at).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <Badge variant="outline" className="text-[10px]">{resume.status}</Badge>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        <DialogFooter>
                            <Button onClick={() => setSelectedUser(null)}>Close</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </main>
        </div>
    )
}
