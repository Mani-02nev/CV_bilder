import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
    LayoutDashboard,
    Users,
    CreditCard,
    BarChart3,
    FileStack,
    Banknote,
    Settings,
    ClipboardList,
    LifeBuoy,
    Search,
    Bell,
    User,
    LogOut,
    Menu,
    X,
    MoreVertical,
    Download,
    RefreshCcw,
    ShieldCheck,
    Filter,
    ArrowUpRight,
    AlertCircle,
    ChevronDown,
    Crown,
    Calendar,
    Eye,
    XCircle,
    Plus,
    CheckCircle2,
    Trash2,
    Palette,
    Monitor,
    Smartphone,
    Paintbrush,
    Component,
    Globe,
    Columns,
    Type
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import logo from "@/assets/logo.png"

// Utilities
const exportToCSV = (data: any[], filename: string) => {
    if (!data || data.length === 0) {
        toast.error("No data available to export")
        return
    }
    const headers = Object.keys(data[0])
    const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => {
            const val = row[header] === null || row[header] === undefined ? '' : row[header]
            return `"${val.toString().replace(/"/g, '""')}"`
        }).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success(`${filename} exported successfully`)
}

// Types
interface UserData {
    id: string
    email: string
    created_at: string
    is_pro: boolean
    full_name: string | null
    phone: string | null
    location: string | null
    last_active?: string
    status?: 'active' | 'suspended'
}

type AdminView = 'overview' | 'users' | 'subscriptions' | 'analytics' | 'templates' | 'payments' | 'settings' | 'logs' | 'support'

export default function AdminDashboardPage() {
    const [activeView, setActiveView] = useState<AdminView>('overview')
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
    const [users, setUsers] = useState<UserData[]>([])
    const [templates, setTemplates] = useState([
        { id: '1', name: 'Modern Blue', usage: 4520, status: 'Active', color: 'bg-blue-600', score: 92, layout: { columns: 2, sidebar: 'left', header: 'modern', primaryColor: '#2563eb', secondaryColor: '#94a3b8', fontFamily: 'font-sans', spacing: 'normal' } },
        { id: '2', name: 'Minimalist Gray', usage: 2840, status: 'Active', color: 'bg-gray-600', score: 88, layout: { columns: 1, sidebar: 'none', header: 'centered', primaryColor: '#4b5563', secondaryColor: '#94a3b8', fontFamily: 'font-sans', spacing: 'normal' } },
        { id: '3', name: 'Executive Gold', usage: 1250, status: 'Premium', color: 'bg-amber-600', score: 95, layout: { columns: 2, sidebar: 'right', header: 'compact', primaryColor: '#d97706', secondaryColor: '#94a3b8', fontFamily: 'font-serif', spacing: 'normal' } },
        { id: '4', name: 'Creative Pulse', usage: 890, status: 'Draft', color: 'bg-purple-600', score: 78, layout: { columns: 2, sidebar: 'left', header: 'modern', primaryColor: '#9333ea', secondaryColor: '#94a3b8', fontFamily: 'font-sans', spacing: 'normal' } },
        { id: '5', name: 'Silicon Executive', usage: 2100, status: 'Active', color: 'bg-slate-800', score: 94, layout: { columns: 1, sidebar: 'none', header: 'modern', primaryColor: '#1e293b', secondaryColor: '#94a3b8', fontFamily: 'font-sans', spacing: 'normal' } },
        { id: '6', name: 'London Classic', usage: 1560, status: 'Active', color: 'bg-indigo-700', score: 89, layout: { columns: 2, sidebar: 'right', header: 'modern', primaryColor: '#4338ca', secondaryColor: '#94a3b8', fontFamily: 'font-serif', spacing: 'normal' } },
        { id: '7', name: 'Startup Bold', usage: 3200, status: 'Active', color: 'bg-rose-600', score: 91, layout: { columns: 2, sidebar: 'left', header: 'centered', primaryColor: '#e11d48', secondaryColor: '#94a3b8', fontFamily: 'font-sans', spacing: 'normal' } },
        { id: '8', name: 'Academic Elite', usage: 420, status: 'Premium', color: 'bg-teal-700', score: 96, layout: { columns: 2, sidebar: 'right', header: 'compact', primaryColor: '#0f766e', secondaryColor: '#94a3b8', fontFamily: 'font-serif', spacing: 'normal' } },
        { id: '9', name: 'Modern Dark', usage: 2780, status: 'Active', color: 'bg-zinc-900', score: 87, layout: { columns: 1, sidebar: 'none', header: 'centered', primaryColor: '#18181b', secondaryColor: '#94a3b8', fontFamily: 'font-sans', spacing: 'normal' } },
        { id: '10', name: 'Nature Green', usage: 940, status: 'Active', color: 'bg-emerald-600', score: 90, layout: { columns: 2, sidebar: 'left', header: 'modern', primaryColor: '#059669', secondaryColor: '#94a3b8', fontFamily: 'font-sans', spacing: 'normal' } },
        { id: '11', name: 'Tokyo Minimal', usage: 1120, status: 'Active', color: 'bg-violet-600', score: 93, layout: { columns: 2, sidebar: 'left', header: 'compact', primaryColor: '#7c3aed', secondaryColor: '#94a3b8', fontFamily: 'font-sans', spacing: 'normal' } },
        { id: '12', name: 'California Sun', usage: 670, status: 'Draft', color: 'bg-orange-500', score: 85, layout: { columns: 1, sidebar: 'none', header: 'centered', primaryColor: '#f97316', secondaryColor: '#94a3b8', fontFamily: 'font-sans', spacing: 'normal' } }
    ])
    const [transactions, setTransactions] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const navigate = useNavigate()

    // Load system data on mount
    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            // Enriched data with stable "random" values based on ID
            const enrichedUsers = (data || []).map(u => {
                // Seeded "random" values so they don't change every refresh
                const seed = u.id.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0)
                return {
                    ...u,
                    last_active: new Date(new Date(u.created_at).getTime() + (seed % 100000000)).toISOString(),
                    status: (seed % 10) > 1 ? 'active' : 'suspended'
                }
            })
            setUsers(enrichedUsers)
        } catch (error) {
            console.error('Error:', error)
            toast.error('Failed to load system data')
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = () => {
        sessionStorage.removeItem('isAdmin')
        localStorage.removeItem('isAdmin')
        toast.info("Logged out successfully")
        navigate('/admin/login')
    }

    const navigationItems = [
        { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
        { id: 'users', icon: Users, label: 'Users' },
        { id: 'subscriptions', icon: CreditCard, label: 'Subscriptions' },
        { id: 'analytics', icon: BarChart3, label: 'Analytics' },
        { id: 'templates', icon: FileStack, label: 'Templates' },
        { id: 'payments', icon: Banknote, label: 'Payments' },
        { id: 'settings', icon: Settings, label: 'Settings' },
        { id: 'logs', icon: ClipboardList, label: 'Logs / Activity' },
        { id: 'support', icon: LifeBuoy, label: 'Support Tickets' },
    ]

    if (loading && users.length === 0) {
        return (
            <div className="flex h-screen bg-[#F8F9FB] animate-pulse">
                <div className="w-[280px] bg-white border-r border-[#E2E8F0] p-6 space-y-8 hidden md:block">
                    <div className="h-8 w-32 bg-gray-100 rounded-lg mb-10" />
                    <div className="space-y-4">
                        {Array(7).fill(0).map((_, i) => (
                            <div key={i} className="h-11 bg-gray-50 rounded-xl" />
                        ))}
                    </div>
                </div>
                <div className="flex-1 flex flex-col">
                    <header className="h-20 bg-white border-b border-[#E2E8F0] px-8 flex items-center justify-between">
                        <div className="h-10 w-64 bg-gray-100 rounded-xl" />
                        <div className="flex gap-4">
                            <div className="h-10 w-10 bg-gray-100 rounded-xl" />
                            <div className="h-10 w-32 bg-gray-100 rounded-full" />
                        </div>
                    </header>
                    <main className="p-8 space-y-8">
                        <div className="grid grid-cols-4 gap-6">
                            {Array(4).fill(0).map((_, i) => (
                                <div key={i} className="h-32 bg-white rounded-2xl shadow-sm border border-gray-50" />
                            ))}
                        </div>
                        <div className="grid lg:grid-cols-7 gap-8">
                            <div className="lg:col-span-4 h-[400px] bg-white rounded-2xl border border-gray-50" />
                            <div className="lg:col-span-3 h-[400px] bg-white rounded-2xl border border-gray-50" />
                        </div>
                    </main>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#F8F9FB] flex overflow-hidden font-sans selection:bg-indigo-100 selection:text-indigo-900">
            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: sidebarCollapsed ? 80 : 280 }}
                role="navigation"
                aria-label="Desktop Sidebar"
                className={`hidden md:flex flex-col bg-white border-r border-[#E2E8F0] z-50 transition-all duration-300 ease-in-out`}
            >
                <div className="h-20 flex items-center px-6 border-b border-[#F1F5F9]">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <img src={logo} alt="KS Logo" className="h-8 w-8 min-w-[32px] object-contain" />
                        {!sidebarCollapsed && (
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="font-black text-lg tracking-tight text-[#0F172A] whitespace-nowrap uppercase italic"
                            >
                                KS Admin
                            </motion.span>
                        )}
                    </div>
                </div>

                <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto overflow-x-hidden">
                    {navigationItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveView(item.id as AdminView)}
                            aria-label={`Switch to ${item.label} view`}
                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative
                                ${activeView === item.id
                                    ? 'bg-[#0F172A] text-white shadow-xl shadow-[#0F172A]/10'
                                    : 'text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
                                }
                            `}
                        >
                            <item.icon className={`h-5 w-5 min-w-[20px] ${activeView === item.id ? 'text-white' : 'group-hover:text-[#0F172A]'}`} />
                            {!sidebarCollapsed && (
                                <span className="font-medium text-sm">{item.label}</span>
                            )}
                            {sidebarCollapsed && activeView === item.id && (
                                <div className="absolute left-0 w-1 h-6 bg-[#0F172A] rounded-r-full" />
                            )}
                        </button>
                    ))}
                </div>

                <div className="p-4 border-t border-[#F1F5F9]">
                    <button
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        className="w-full h-10 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9] text-[#64748B] transition-colors"
                    >
                        {sidebarCollapsed ? <ChevronDown className="rotate-270" /> : <X className="h-5 w-5" />}
                    </button>
                </div>
            </motion.aside>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="fixed inset-0 bg-black/50 z-[60] md:hidden backdrop-blur-sm"
                    />
                )}
            </AnimatePresence>

            {/* Mobile Sidebar */}
            <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: isMobileMenuOpen ? 0 : '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 left-0 bottom-0 w-72 bg-white z-[70] md:hidden shadow-2xl flex flex-col"
            >
                <div className="h-20 flex items-center justify-between px-6 border-b border-[#F1F5F9]">
                    <div className="flex items-center gap-3">
                        <img src={logo} alt="KS" className="h-8 w-8" />
                        <span className="font-bold text-lg text-[#0F172A]">KS Admin</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>
                <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
                    {navigationItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => { setActiveView(item.id as AdminView); setIsMobileMenuOpen(false); }}
                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all
                                ${activeView === item.id
                                    ? 'bg-[#0F172A] text-white shadow-lg shadow-[#0F172A]/10'
                                    : 'text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
                                }
                            `}
                        >
                            <item.icon className={`h-5 w-5 ${activeView === item.id ? 'text-white' : ''}`} />
                            <span className="font-medium text-sm">{item.label}</span>
                        </button>
                    ))}
                </div>
            </motion.aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Nav */}
                <header
                    role="banner"
                    className="h-20 bg-white/80 backdrop-blur-md border-b border-[#E2E8F0] shrink-0 z-40 px-6 sm:px-8"
                >
                    <div className="h-full flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="md:hidden"
                                onClick={() => setIsMobileMenuOpen(true)}
                                aria-label="Open sidebar"
                            >
                                <Menu className="h-5 w-5" />
                            </Button>
                            <div className="relative max-w-md w-full hidden sm:block">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
                                <Input
                                    placeholder="Search command or user..."
                                    className="pl-10 h-10 bg-[#F8F9FB] border-[#E2E8F0] focus-visible:ring-1 focus-visible:ring-[#0F172A] rounded-lg"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                aria-label="View notifications"
                                className="relative text-[#64748B] hover:bg-[#F1F5F9] rounded-lg"
                            >
                                <Bell className="h-5 w-5" />
                                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white animate-pulse" />
                            </Button>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-[#F1F5F9] transition-colors border border-[#E2E8F0] sm:border-none">
                                        <div className="w-8 h-8 rounded-full bg-[#0F172A] text-white flex items-center justify-center font-bold text-xs">MA</div>
                                        <div className="hidden lg:block text-left mr-2">
                                            <p className="text-xs font-bold text-[#0F172A]">Mani Admin</p>
                                            <p className="text-[10px] text-[#64748B]">Super Admin</p>
                                        </div>
                                        <ChevronDown className="h-4 w-4 text-[#64748B]" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 mt-2 rounded-2xl p-2 border-[#E2E8F0] shadow-xl">
                                    <DropdownMenuLabel className="font-bold px-3 pt-2 text-xs text-[#94A3B8] uppercase tracking-widest">Administrator</DropdownMenuLabel>
                                    <DropdownMenuSeparator className="bg-[#F1F5F9] my-2" />
                                    <DropdownMenuItem className="rounded-xl gap-2 cursor-pointer px-3 py-3 font-medium text-sm focus:bg-indigo-50 transition-colors">
                                        <User className="w-4 h-4" /> Profile Settings
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="rounded-xl gap-2 cursor-pointer px-3 py-3 font-medium text-sm focus:bg-indigo-50 transition-colors">
                                        <ShieldCheck className="w-4 h-4" /> Security Audit
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-[#F1F5F9] my-2" />
                                    <DropdownMenuItem
                                        onClick={handleLogout}
                                        className="rounded-xl gap-2 cursor-pointer px-3 py-3 font-bold text-sm text-[#F43F5E] focus:text-[#F43F5E] focus:bg-[#FFF1F2]"
                                    >
                                        <LogOut className="w-4 h-4" /> Terminate Session
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </header>

                {/* Dynamic Content */}
                <main
                    role="main"
                    id="main-content"
                    className="flex-1 overflow-auto p-6 sm:p-8 outline-none"
                    tabIndex={-1}
                >
                    <div className="max-w-[1700px] mx-auto">
                        <AnimatePresence mode="wait">
                            {activeView === 'overview' && <OverviewView users={users} templates={templates} key="overview" />}
                            {activeView === 'users' && <UserManagementView users={users} setUsers={setUsers} setTransactions={setTransactions} loading={loading} onRefresh={fetchUsers} key="users" />}
                            {activeView === 'subscriptions' && <SubscriptionsView users={users} key="subscriptions" />}
                            {activeView === 'analytics' && <AnalyticsView users={users} key="analytics" />}
                            {activeView === 'templates' && <TemplatesView templates={templates} setTemplates={setTemplates} key="templates" />}
                            {activeView === 'payments' && <PaymentsView transactions={transactions} key="payments" />}
                            {activeView === 'settings' && <SettingsView key="settings" />}
                            {activeView === 'logs' && <LogsView key="logs" />}
                            {activeView === 'support' && <SupportView key="support" />}
                        </AnimatePresence>
                    </div>
                </main>
            </div>
        </div>
    )
}

function KPISection({ users, templates }: { users: UserData[], templates: any[] }) {
    const stats = [
        { label: 'Total Users', value: users.length, growth: '+12.5%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Pro Subscriptions', value: users.filter(u => u.is_pro).length, growth: '+8.2%', icon: Crown, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'System Templates', value: templates.length, growth: '+2', icon: FileStack, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Monthly Revenue', value: `₹${(users.filter(u => u.is_pro).length * 59).toLocaleString()}`, growth: '+22.4%', icon: Banknote, color: 'text-[#0F172A]', bg: 'bg-indigo-50' },
    ]

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                >
                    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all rounded-2xl overflow-hidden">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                                    <stat.icon className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-0.5">
                                    <ArrowUpRight className="w-3 h-3" /> {stat.growth}
                                </span>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-[#64748B]">{stat.label}</p>
                                <h3 className="text-2xl font-bold text-[#0F172A] tabular-nums">{stat.value}</h3>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </div>
    )
}

function OverviewView({ users, templates }: { users: UserData[], templates: any[] }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
        >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#0F172A]">Good Morning, Mani</h1>
                    <p className="text-[#64748B] text-sm">Here's what's happening with KS Resume platform today.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="h-10 rounded-lg gap-2 text-xs font-bold bg-white border-[#E2E8F0] shadow-sm">
                        <Calendar className="w-4 h-4" /> Last 30 Days
                    </Button>
                    <Button className="h-10 rounded-lg gap-2 text-xs font-bold bg-[#0F172A] shadow-lg shadow-[#0F172A]/10">
                        <Download className="w-4 h-4" /> Export Report
                    </Button>
                </div>
            </div>

            <KPISection users={users} templates={templates} />

            <div className="grid lg:grid-cols-7 gap-8">
                <Card className="lg:col-span-4 border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] rounded-2xl">
                    <CardHeader>
                        <CardTitle className="text-lg">User Growth over time</CardTitle>
                        <CardDescription>Metrics across all segments in the last 6 months.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-end justify-between gap-2 pt-10">
                        {/* Custom SVG/CSS Bar Chart Mock */}
                        {[40, 60, 45, 90, 65, 85, 55, 75, 95, 80, 100, 70].map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    className="w-full bg-[#F1F5F9] group-hover:bg-[#0F172A] rounded-t-lg transition-colors relative"
                                >
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#0F172A] text-white text-[10px] px-1.5 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">+{h} users</div>
                                </motion.div>
                                <span className="text-[10px] text-[#94A3B8] font-medium hidden sm:block">Jan</span>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="lg:col-span-3 border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] rounded-2xl">
                    <CardHeader>
                        <CardTitle className="text-lg">Free vs Pro Distribution</CardTitle>
                        <CardDescription>Breakdown of current user plans.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-10">
                        <div className="relative w-40 h-40 mx-auto">
                            <div className="absolute inset-0 rounded-full border-[12px] border-[#F1F5F9]" />
                            <svg className="w-full h-full -rotate-90">
                                <circle
                                    cx="80" cy="80" r="68" fill="none" stroke="#0F172A" strokeWidth="12"
                                    strokeDasharray={`${(users.filter(u => u.is_pro).length / Math.max(users.length, 1)) * 427} 427`}
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <p className="text-2xl font-bold">{Math.round((users.filter(u => u.is_pro).length / Math.max(users.length, 1)) * 100)}%</p>
                                <p className="text-[10px] text-[#64748B] font-bold uppercase tracking-widest">Active Pro</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-8">
                            <div className="p-4 rounded-xl bg-indigo-50/50 space-y-1">
                                <div className="flex items-center gap-2 text-indigo-600">
                                    <div className="w-2 h-2 rounded-full bg-indigo-600" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">Pro Tier</span>
                                </div>
                                <p className="text-lg font-bold text-[#0F172A]">{users.filter(u => u.is_pro).length}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-slate-50 space-y-1">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <div className="w-2 h-2 rounded-full bg-slate-300" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">Free Tier</span>
                                </div>
                                <p className="text-lg font-bold text-[#0F172A]">{users.filter(u => !u.is_pro).length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </motion.div>
    )
}

function UserManagementView({ users, setUsers, setTransactions, loading, onRefresh }: { users: UserData[], setUsers: React.Dispatch<React.SetStateAction<UserData[]>>, setTransactions: React.Dispatch<React.SetStateAction<any[]>>, loading: boolean, onRefresh: () => void }) {
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState<'all' | 'pro' | 'free'>('all')
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null)

    const filtered = users.filter(u => {
        const matchesSearch = u.email.toLowerCase().includes(search.toLowerCase()) || (u.full_name?.toLowerCase().includes(search.toLowerCase()))
        if (filter === 'pro') return matchesSearch && u.is_pro
        if (filter === 'free') return matchesSearch && !u.is_pro
        return matchesSearch
    })

    const [isUpgradeOpen, setIsUpgradeOpen] = useState(false)
    const [upgradeUser, setUpgradeUser] = useState<UserData | null>(null)
    const [txId, setTxId] = useState('')

    const handleProAction = (user: UserData) => {
        if (user.is_pro) {
            togglePro(user) // Just toggle down to free
        } else {
            setUpgradeUser(user)
            setIsUpgradeOpen(true)
            setTxId(`TX-${Math.random().toString(36).substring(7).toUpperCase()}`)
        }
    }

    const confirmUpgrade = async () => {
        if (!txId) return toast.error("Transaction ID is required")
        if (!upgradeUser) return

        try {
            await supabase.from('profiles').update({ is_pro: true }).eq('id', upgradeUser.id)

            setUsers(prev => prev.map(u => u.id === upgradeUser.id ? { ...u, is_pro: true } : u))
            setTransactions(prev => [{
                id: txId,
                user: upgradeUser.email,
                amount: '₹59.00',
                date: new Date().toLocaleDateString(),
                status: 'Successful'
            }, ...prev])

            toast.success(`${upgradeUser.full_name || upgradeUser.email} upgraded to Pro`)
            setIsUpgradeOpen(false)
            setUpgradeUser(null)
        } catch (e) {
            toast.error("Upgrade failed")
        }
    }

    const togglePro = async (user: UserData) => {
        try {
            const { error } = await supabase.from('profiles').update({ is_pro: !user.is_pro }).eq('id', user.id)
            if (error) throw error

            setUsers(prev => prev.map(u => u.id === user.id ? { ...u, is_pro: !u.is_pro } : u))
            toast.success(`User downgraded to Free Tier`)
        } catch (e) {
            toast.error("Operation failed")
        }
    }

    const toggleSuspension = async (user: UserData) => {
        const isCurrentlySuspended = user.status === 'suspended'
        const newStatus = isCurrentlySuspended ? 'active' : 'suspended'

        try {
            // Simulated delay for premium feel
            await new Promise(r => setTimeout(r, 800))

            // Note: In production you would update Supabase here
            // const { error } = await supabase.from('profiles').update({ status: newStatus }).eq('id', user.id)
            // if (error) throw error

            setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: newStatus } : u))

            if (isCurrentlySuspended) {
                toast.success("Account access restored")
            } else {
                toast.error("Account access suspended")
            }
        } catch (e) {
            toast.error("Status update failed")
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
        >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#0F172A]">User Management</h1>
                    <p className="text-[#64748B] text-sm">Direct control and monitoring of all user accounts.</p>
                </div>
                <Button onClick={onRefresh} variant="outline" className="rounded-lg h-10 gap-2 border-[#E2E8F0] bg-white group shadow-sm">
                    <RefreshCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" /> Refresh Data
                </Button>
            </div>

            <Card className="border-none shadow-[0_4px_20px_rgb(0,0,0,0.02)] rounded-2xl overflow-hidden bg-white">
                <div className="p-6 border-b border-[#F1F5F9] flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name or email..."
                            className="pl-10 h-10 bg-[#F8F9FB] border-[#E2E8F0] rounded-lg"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex bg-[#F8F9FB] rounded-lg p-1 border border-[#E2E8F0]">
                            {(['all', 'pro', 'free'] as const).map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all
                                        ${filter === f ? 'bg-white text-[#0F172A] shadow-sm' : 'text-[#64748B] hover:text-[#0F172A]'}
                                    `}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                        <Button
                            onClick={() => exportToCSV(filtered, 'user_registry')}
                            variant="outline"
                            className="h-10 border-[#E2E8F0] bg-white rounded-lg gap-2 text-xs font-bold text-[#64748B]"
                        >
                            <Download className="w-4 h-4" /> Export
                        </Button>
                        <Button variant="outline" className="h-10 border-[#E2E8F0] bg-white rounded-lg gap-2 text-xs font-bold text-[#64748B]">
                            <Filter className="w-4 h-4" /> Filters
                        </Button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#F8F9FB]/50 border-b border-[#F1F5F9]">
                                <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-[#64748B] pl-8">Name</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Email</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Plan</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Joined</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Status</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-[#64748B] text-right pr-8">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse border-b border-[#F8F9FB]">
                                        <td className="p-4 pl-8"><div className="h-4 w-32 bg-[#F1F5F9] rounded" /></td>
                                        <td className="p-4"><div className="h-4 w-40 bg-[#F1F5F9] rounded" /></td>
                                        <td className="p-4"><div className="h-6 w-16 bg-[#F1F5F9] rounded-full" /></td>
                                        <td className="p-4"><div className="h-4 w-24 bg-[#F1F5F9] rounded" /></td>
                                        <td className="p-4 text-right pr-8"><div className="h-4 w-10 bg-[#F1F5F9] rounded ml-auto" /></td>
                                    </tr>
                                ))
                            ) : filtered.map((user) => (
                                <tr key={user.id} className="group hover:bg-[#F8F9FB]/80 transition-colors border-b border-[#F8F9FB] last:border-0">
                                    <td className="p-4 pl-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-[#E2E8F0] text-[#0F172A] flex items-center justify-center font-bold text-[10px]">
                                                {user.full_name?.substring(0, 2).toUpperCase() || user.email.substring(0, 1).toUpperCase()}
                                            </div>
                                            <span className="font-bold text-sm text-[#0F172A]">{user.full_name || 'System User'}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-[#64748B]">{user.email}</td>
                                    <td className="p-4">
                                        {user.is_pro ? (
                                            <Badge className="bg-[#0F172A] text-white border-none hover:bg-[#0F172A] px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-tight">PRO PLAN</Badge>
                                        ) : (
                                            <Badge variant="outline" className="border-[#E2E8F0] text-[#64748B] px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-tight">FREE TIER</Badge>
                                        )}
                                    </td>
                                    <td className="p-4 text-xs text-[#64748B] font-medium">{new Date(user.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                                    <td className="p-4">
                                        {user.status === 'active' ? (
                                            <span className="flex items-center gap-1.5 text-emerald-600 font-bold text-[10px] uppercase tracking-wider">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" /> Active
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1.5 text-red-500 font-bold text-[10px] uppercase tracking-wider">
                                                <div className="w-1.5 h-1.5 rounded-full bg-red-500" /> Suspended
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4 text-right pr-8">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-white transition-all">
                                                    <MoreVertical className="h-4 w-4 text-[#94A3B8]" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48 rounded-xl p-2 shadow-xl border-[#E2E8F0]">
                                                <DropdownMenuItem onClick={() => setSelectedUser(user)} className="rounded-lg gap-2 cursor-pointer font-medium text-sm">
                                                    <Eye className="w-4 h-4 text-blue-500" /> View Statistics
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleProAction(user)} className="rounded-lg gap-2 cursor-pointer font-medium text-sm">
                                                    {user.is_pro ? <XCircle className="w-4 h-4 text-orange-500" /> : <Crown className="w-4 h-4 text-indigo-500" />}
                                                    {user.is_pro ? 'Downgrade to Free' : 'Upgrade to Pro'}
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="bg-[#F1F5F9]" />
                                                <DropdownMenuItem
                                                    onClick={() => toggleSuspension(user)}
                                                    className={`rounded-lg gap-2 cursor-pointer font-medium text-sm ${user.status === 'suspended' ? 'text-emerald-600 focus:text-emerald-600 focus:bg-emerald-50' : 'text-[#F43F5E] focus:text-[#F43F5E] focus:bg-[#FFF1F2]'}`}
                                                >
                                                    {user.status === 'suspended' ? (
                                                        <>
                                                            <ShieldCheck className="w-4 h-4" /> Restore Access
                                                        </>
                                                    ) : (
                                                        <>
                                                            <AlertCircle className="w-4 h-4" /> Suspend Account
                                                        </>
                                                    )}
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-6 border-t border-[#F1F5F9] flex items-center justify-between">
                    <p className="text-xs text-[#94A3B8] font-medium">Showing <span className="text-[#0F172A]">{filtered.length}</span> of <span className="text-[#0F172A]">{users.length}</span> users</p>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="h-9 px-4 rounded-lg border-[#E2E8F0] shadow-sm text-xs font-bold" disabled>Previous</Button>
                        <Button variant="outline" size="sm" className="h-9 px-4 rounded-lg border-[#E2E8F0] bg-white shadow-sm text-xs font-bold shadow-indigo-500/5">Next</Button>
                    </div>
                </div>
            </Card>

            {/* Manual Upgrade Dialog */}
            <Dialog open={isUpgradeOpen} onOpenChange={setIsUpgradeOpen}>
                <DialogContent className="max-w-md border-none rounded-[32px] p-8 shadow-2xl">
                    <DialogTitle className="sr-only">Upgrade to Pro</DialogTitle>
                    <DialogDescription className="sr-only">Verify manual payment to unlock premium features for this account.</DialogDescription>
                    <div className="space-y-6">
                        <DialogHeader className="text-center space-y-2 pt-4">
                            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto text-indigo-600 shadow-sm">
                                <Crown className="w-8 h-8" />
                            </div>
                            <DialogTitle className="text-xl font-bold text-[#0F172A]">Upgrade to Pro</DialogTitle>
                            <DialogDescription className="text-sm text-[#64748B]">Verify manual payment to unlock premium features for this account.</DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-[#94A3B8]">Transaction ID</Label>
                                <Input
                                    placeholder="Enter manual payment ref..."
                                    value={txId}
                                    onChange={(e) => setTxId(e.target.value)}
                                    className="h-12 rounded-xl bg-[#F8F9FB] border-none font-mono focus-visible:ring-1 focus-visible:ring-indigo-500"
                                />
                            </div>
                            <div className="p-4 rounded-xl bg-gray-50 flex items-center justify-between">
                                <span className="text-xs font-bold text-gray-400">Upgrade Amount</span>
                                <span className="text-sm font-black text-[#0F172A]">₹59.00 INR</span>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Button variant="ghost" onClick={() => setIsUpgradeOpen(false)} className="flex-1 rounded-xl h-12 font-bold">Cancel</Button>
                            <Button onClick={confirmUpgrade} className="flex-1 rounded-xl h-12 bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-200">Verify & Upgrade</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* User Details Modal */}
            <UserDetailDialog user={selectedUser} open={!!selectedUser} onOpenChange={(o) => o ? null : setSelectedUser(null)} />
        </motion.div>
    )
}

function SubscriptionsView({ users }: { users: UserData[] }) {
    const proUsers = users.filter(u => u.is_pro)
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#0F172A]">Subscription Intelligence</h1>
                    <p className="text-[#64748B] text-sm">Managing recurring revenue and tier transitions.</p>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                <Card className="md:col-span-2 border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] rounded-2xl">
                    <CardHeader>
                        <CardTitle>Recent Payment Ledger</CardTitle>
                        <CardDescription>Real-time stream of platform transactions.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {proUsers.slice(0, 5).map((u, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-[#F8F9FB] border border-[#F1F5F9]">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2.5 rounded-lg bg-white border border-[#E2E8F0] text-emerald-600">
                                            <Banknote className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-[#0F172A]">{u.email}</p>
                                            <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">MONTHLY PRO • SUCCESSFUL</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-black text-[#0F172A]">₹59.00</p>
                                        <p className="text-[10px] text-[#94A3B8]">Today, 2:45 PM</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-8">
                    <Card className="border-none bg-[#0F172A] text-white shadow-xl shadow-[#0F172A]/20 rounded-2xl overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full -mr-10 -mt-10" />
                        <CardHeader>
                            <CardTitle className="text-blue-400">ARR Intelligence</CardTitle>
                            <p className="text-white/60 text-xs">Projected vs Actual Revenue</p>
                        </CardHeader>
                        <CardContent className="pt-2">
                            <h2 className="text-4xl font-black mb-1">₹{(proUsers.length * 59 * 12).toLocaleString()}</h2>
                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-[4px]">Annual Run Rate</p>
                            <div className="mt-8 pt-8 border-t border-white/10 flex items-center justify-between">
                                <div>
                                    <p className="text-2xl font-bold">{proUsers.length}</p>
                                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Active Pro</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold">₹59</p>
                                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider">ARPU</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] rounded-2xl">
                        <CardHeader>
                            <CardTitle className="text-lg">Platform Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 rounded-xl border border-[#F1F5F9] hover:bg-[#F8F9FB] transition-colors cursor-pointer group">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold text-[#0F172A]">Global Pricing Price</span>
                                    <ArrowUpRight className="w-4 h-4 text-[#CBD5E1] group-hover:text-[#0F172A] transition-colors" />
                                </div>
                                <p className="text-xs text-[#64748B] mt-1">Configure first-month offer vs renewal.</p>
                            </div>
                            <div className="p-4 rounded-xl border border-[#F1F5F9] hover:bg-[#F8F9FB] transition-colors cursor-pointer group">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold text-[#0F172A]">Feature Flags</span>
                                    <ArrowUpRight className="w-4 h-4 text-[#CBD5E1] group-hover:text-[#0F172A] transition-colors" />
                                </div>
                                <p className="text-xs text-[#64748B] mt-1">Enable AI v4.2 globally for all Pro.</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </motion.div>
    )
}

function UserDetailDialog({ user, open, onOpenChange }: { user: UserData | null, open: boolean, onOpenChange: (o: boolean) => void }) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl border-none p-0 rounded-3xl overflow-hidden shadow-2xl">
                <DialogTitle className="sr-only">User Details Viewer</DialogTitle>
                <DialogDescription className="sr-only">Detailed view of user profile, analytics, and available security actions.</DialogDescription>
                {user && (
                    <div className="flex flex-col">
                        <div className="bg-[#0F172A] p-10 text-white relative h-48 overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full -mr-20 -mt-20" />
                            <div className="relative z-10 flex items-end gap-6 h-full">
                                <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-3xl font-black">
                                    {user.full_name?.substring(0, 2).toUpperCase() || user.email.substring(0, 1).toUpperCase()}
                                </div>
                                <div className="mb-2">
                                    <h2 className="text-2xl font-black">{user.full_name || 'System Account'}</h2>
                                    <p className="text-blue-400 font-bold text-xs uppercase tracking-[3px]">{user.is_pro ? 'PRO MEMBER' : 'FREE ACCOUNT'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 space-y-8 bg-white">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">Email Access</p>
                                    <p className="text-sm font-bold truncate">{user.email}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">Phone</p>
                                    <p className="text-sm font-bold">{user.phone || '--'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">Joined</p>
                                    <p className="text-sm font-bold">{new Date(user.created_at).toLocaleDateString()}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">Last Login</p>
                                    <p className="text-sm font-bold">{user.last_active ? new Date(user.last_active).toLocaleDateString() : 'N/A'}</p>
                                </div>
                            </div>

                            <Separator className="bg-[#F1F5F9]" />

                            <div className="grid md:grid-cols-2 gap-8">
                                <section>
                                    <h4 className="text-xs font-black uppercase tracking-[2px] text-[#0F172A] mb-4">Account Analytics</h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center p-3 rounded-xl bg-[#F8F9FB] border border-[#F1F5F9]">
                                            <span className="text-xs text-[#64748B] font-medium">Resumes Created</span>
                                            <span className="text-sm font-bold">12</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 rounded-xl bg-[#F8F9FB] border border-[#F1F5F9]">
                                            <span className="text-xs text-[#64748B] font-medium">AI Tokens Used</span>
                                            <span className="text-sm font-bold">4.2k</span>
                                        </div>
                                    </div>
                                </section>
                                <section>
                                    <h4 className="text-xs font-black uppercase tracking-[2px] text-[#0F172A] mb-4">Security Actions</h4>
                                    <div className="flex gap-2">
                                        <Button variant="outline" className="flex-1 rounded-xl h-10 text-xs font-bold border-[#E2E8F0]">Reset Path</Button>
                                        <Button variant="outline" className="flex-1 rounded-xl h-10 text-xs font-bold border-[#E2E8F0] text-[#F43F5E] hover:bg-[#FFF1F2]">Flag Risk</Button>
                                    </div>
                                </section>
                            </div>
                        </div>

                        <div className="p-6 bg-[#F8F9FB] border-t border-[#F1F5F9] flex justify-end gap-3">
                            <Button variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl font-bold text-xs h-10 px-6">Close</Button>
                            <Button className="rounded-xl font-bold text-xs h-10 px-6 bg-[#0F172A]">Edit Profile</Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}

function AnalyticsView({ users }: { users: UserData[] }) {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Platform Analytics</h1>
                <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() => exportToCSV([
                        { Metric: 'Total Users', Value: users.length, Change: '+12%' },
                        { Metric: 'Pro Conversion', Value: '18.5%', Change: '+2.1%' },
                        { Metric: 'Avg. ATS Score', Value: '84%', Change: '+5%' },
                        { Metric: 'System Uptime', Value: '99.9%', Change: 'Stable' }
                    ], 'analytics_report')}
                >
                    <Download className="w-4 h-4" /> Export Report
                </Button>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
                <Card className="border-none shadow-sm rounded-2xl">
                    <CardHeader><CardTitle>AI Performance</CardTitle></CardHeader>
                    <CardContent className="space-y-6">
                        <div className="p-4 rounded-xl bg-blue-50 space-y-2">
                            <div className="flex justify-between text-sm font-bold"><span>Avg. ATS Score</span><span className="text-blue-600">84%</span></div>
                            <div className="h-2 bg-blue-200 rounded-full overflow-hidden"><div className="h-full bg-blue-600 w-[84%]" /></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 border border-gray-100 rounded-xl">
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Tokens Generated</p>
                                <p className="text-2xl font-bold">1.2M</p>
                            </div>
                            <div className="p-4 border border-gray-100 rounded-xl">
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Avg. Generation Time</p>
                                <p className="text-2xl font-bold">4.2s</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm rounded-2xl">
                    <CardHeader><CardTitle>User Intent</CardTitle></CardHeader>
                    <CardContent className="h-[250px] flex items-center justify-center">
                        <div className="text-center text-gray-400">
                            <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-20" />
                            <p className="text-sm">Engagement heatmaps are being calculated...</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </motion.div>
    )
}

function TemplatesView({ templates, setTemplates }: { templates: any[], setTemplates: React.Dispatch<React.SetStateAction<any[]>> }) {
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isStudioOpen, setIsStudioOpen] = useState(false)
    const [editingTemplate, setEditingTemplate] = useState<any>(null)
    const [templateForm, setTemplateForm] = useState({
        name: '',
        status: 'Draft',
        color: 'bg-indigo-600',
        score: 0,
        layout: {
            columns: 2,
            sidebar: 'left',
            header: 'modern',
            primaryColor: '#4F46E5',
            secondaryColor: '#94A3B8',
            fontFamily: 'font-sans',
            spacing: 'normal'
        }
    })

    const handleAddTemplate = (shouldOpenStudio = false) => {
        if (!templateForm.name) return toast.error("Template name required")
        const id = Date.now().toString() // Use reliable IDs
        const newT = {
            id,
            name: templateForm.name,
            usage: 0,
            status: templateForm.status as any,
            color: templateForm.color,
            score: Number(templateForm.score),
            layout: templateForm.layout
        }
        setTemplates(prev => [...prev, newT])
        setIsAddOpen(false)
        resetForm()

        if (shouldOpenStudio) {
            openStudio(newT)
        } else {
            toast.success("New template added to library")
        }
    }

    const handleEditTemplate = () => {
        if (!templateForm.name) return toast.error("Template name required")
        setTemplates(prev => prev.map(t =>
            t.id === editingTemplate.id
                ? { ...t, ...templateForm, score: Number(templateForm.score) }
                : t
        ))
        setIsEditOpen(false)
        setEditingTemplate(null)
        resetForm()
        toast.success("Template settings updated")
    }

    const resetForm = () => {
        setTemplateForm({
            name: '',
            status: 'Draft',
            color: 'bg-indigo-600',
            score: 0,
            layout: {
                columns: 2,
                sidebar: 'left',
                header: 'modern',
                primaryColor: '#4F46E5',
                secondaryColor: '#94A3B8',
                fontFamily: 'font-sans',
                spacing: 'normal'
            }
        })
    }

    const openEdit = (template: any) => {
        setEditingTemplate(template)
        setTemplateForm({
            name: template.name,
            status: template.status,
            color: template.color,
            score: template.score,
            layout: template.layout || {
                columns: 2,
                sidebar: 'left',
                header: 'modern',
                primaryColor: '#4F46E5',
                secondaryColor: '#94A3B8',
                fontFamily: 'font-sans',
                spacing: 'normal'
            }
        })
        setIsEditOpen(true)
    }

    const openStudio = (template: any) => {
        setEditingTemplate(template)
        setIsStudioOpen(true)
    }

    const deleteTemplate = (id: string) => {
        setTemplates(templates.filter(t => t.id !== id))
        toast.info("Template removed from production")
    }

    const toggleStatus = (id: string) => {
        setTemplates(templates.map(t => {
            if (t.id === id) {
                const newStatus = t.status === 'Active' ? 'Draft' : 'Active'
                toast.success(`${t.name} is now ${newStatus}`)
                return { ...t, status: newStatus }
            }
            return t
        }))
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-[#0F172A]">Resume Templates</h1>
                    <p className="text-sm text-[#64748B]">Managing <span className="text-[#0F172A] font-bold">{templates.length} core layouts</span> in production.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        onClick={() => exportToCSV(templates, 'template_manifest')}
                        variant="outline"
                        className="h-11 rounded-xl gap-2 font-bold text-gray-500 border-gray-200"
                    >
                        <Download className="w-4 h-4" /> Export Library
                    </Button>
                    <Button onClick={() => { resetForm(); setIsAddOpen(true); }} className="bg-[#0F172A] gap-2 h-11 px-6 rounded-xl shadow-lg shadow-[#0F172A]/10">
                        <Plus className="w-4 h-4" /> New Template
                    </Button>
                </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <AnimatePresence>
                    {templates.map(t => (
                        <motion.div
                            key={t.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                        >
                            <Card className="border-none shadow-[0_4px_20px_rgb(0,0,0,0.03)] rounded-2xl overflow-hidden group hover:shadow-xl transition-all duration-300 bg-white">
                                <div
                                    className={`h-40 relative overflow-hidden flex items-center justify-center transition-colors duration-500 ${!t.layout?.primaryColor ? t.color : ''}`}
                                    style={t.layout?.primaryColor ? { backgroundColor: t.layout.primaryColor } : {}}
                                >
                                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent" />
                                    <FileStack className="w-12 h-12 text-white/20 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-[#0F172A]/80 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm">
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            className="w-32 rounded-lg font-bold"
                                            onClick={() => openStudio(t)}
                                        >
                                            Design Studio
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="w-32 rounded-lg font-bold text-white hover:bg-white/10"
                                            onClick={() => toggleStatus(t.id)}
                                        >
                                            {t.status === 'Active' ? 'Set as Draft' : 'Go Active'}
                                        </Button>
                                    </div>
                                </div>
                                <CardContent className="p-5">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="min-w-0">
                                            <h4 className="font-bold text-sm text-[#0F172A] truncate">{t.name}</h4>
                                            <p className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-wider">{t.usage.toLocaleString()} Global Uses</p>
                                        </div>
                                        <Badge variant="secondary" className={`
                                            text-[9px] px-2 py-0.5 rounded-full font-black tracking-tight shrink-0
                                            ${t.status === 'Active' ? 'bg-emerald-50 text-emerald-600' :
                                                t.status === 'Premium' ? 'bg-indigo-50 text-indigo-600' : 'bg-orange-50 text-orange-600'}
                                        `}>
                                            {t.status}
                                        </Badge>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center text-[10px] font-bold text-[#64748B]">
                                            <span>ATS Optimization</span>
                                            <span className="text-[#0F172A]">{t.score}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-[#F1F5F9] rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${t.score}%` }}
                                                className="h-full bg-emerald-500 rounded-full"
                                            />
                                        </div>

                                        <div className="pt-2 flex justify-between items-center border-t border-[#F1F5F9]">
                                            <div className="flex -space-x-2">
                                                {[1, 2, 3].map(i => (
                                                    <div key={i} className="w-5 h-5 rounded-full border-2 border-white bg-[#F1F5F9]" />
                                                ))}
                                            </div>
                                            <div className="flex gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-[#94A3B8] hover:text-[#0F172A] hover:bg-gray-100 rounded-lg"
                                                    onClick={() => openEdit(t)}
                                                >
                                                    <Settings className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-lg"
                                                    onClick={() => deleteTemplate(t.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Template Form Dialog (Add/Edit) */}
            <Dialog
                open={isAddOpen || isEditOpen}
                onOpenChange={(o) => {
                    if (!o) { setIsAddOpen(false); setIsEditOpen(false); setEditingTemplate(null); }
                }}
            >
                <DialogContent className="max-w-md border-none rounded-3xl p-8 shadow-2xl">
                    <DialogTitle className="sr-only">{isEditOpen ? 'Edit Template' : 'Add New Template'}</DialogTitle>
                    <DialogDescription className="sr-only">Form to manage resume template metadata and core library settings.</DialogDescription>
                    <div className="space-y-6">
                        <div className="text-center space-y-2">
                            <div className={`w-16 h-16 ${templateForm.color} rounded-2xl flex items-center justify-center mx-auto text-white shadow-xl transition-colors duration-500`}>
                                <FileStack className="w-8 h-8" />
                            </div>
                            <h2 className="text-xl font-bold">{isEditOpen ? 'Customize Template' : 'New Layout Engine'}</h2>
                            <p className="text-sm text-[#64748B]">Define visual and technical metadata for the core library.</p>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">Layout Identity</Label>
                                <Input
                                    placeholder="Template name..."
                                    value={templateForm.name}
                                    onChange={e => setTemplateForm({ ...templateForm, name: e.target.value })}
                                    className="h-12 rounded-xl bg-[#F8F9FB] border-none focus-visible:ring-1 focus-visible:ring-[#0F172A]"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">Status</Label>
                                    <select
                                        value={templateForm.status}
                                        onChange={e => setTemplateForm({ ...templateForm, status: e.target.value })}
                                        className="w-full h-12 rounded-xl bg-[#F8F9FB] border-none px-3 text-sm font-bold text-[#0F172A] focus:ring-1 focus:ring-[#0F172A]"
                                    >
                                        <option value="Draft">Draft</option>
                                        <option value="Active">Active</option>
                                        <option value="Premium">Premium</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">ATS Score (%)</Label>
                                    <Input
                                        type="number"
                                        min="0" max="100"
                                        value={templateForm.score}
                                        onChange={e => setTemplateForm({ ...templateForm, score: Number(e.target.value) })}
                                        className="h-12 rounded-xl bg-[#F8F9FB] border-none focus-visible:ring-1 focus-visible:ring-[#0F172A]"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">Visual Theme (CSS Class)</Label>
                                <Input
                                    placeholder="bg-blue-600, bg-slate-800..."
                                    value={templateForm.color}
                                    onChange={e => setTemplateForm({ ...templateForm, color: e.target.value })}
                                    className="h-12 rounded-xl bg-[#F8F9FB] border-none focus-visible:ring-1 focus-visible:ring-[#0F172A]"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex gap-3">
                                <Button
                                    variant="ghost"
                                    onClick={() => { setIsAddOpen(false); setIsEditOpen(false); }}
                                    className="flex-1 rounded-xl h-12 font-bold hover:bg-gray-100"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={isEditOpen ? handleEditTemplate : () => handleAddTemplate(false)}
                                    className="flex-1 rounded-xl h-12 bg-[#0F172A] text-white font-bold shadow-lg shadow-[#0F172A]/20"
                                >
                                    {isEditOpen ? 'Quick Save' : 'Launch Base'}
                                </Button>
                            </div>
                            <Button
                                variant="outline"
                                onClick={() => handleAddTemplate(true)}
                                className="w-full h-11 rounded-xl border-dashed border-2 gap-2 font-bold text-indigo-600 border-indigo-100 hover:bg-indigo-50 hover:border-indigo-200"
                            >
                                <Paintbrush className="w-4 h-4" /> Create & Design in Studio
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Visual Studio Modal */}
            <VisualStudioModal
                open={isStudioOpen}
                onOpenChange={setIsStudioOpen}
                template={editingTemplate}
                onSave={(updatedTemplate) => {
                    setTemplates(prev => prev.map(t =>
                        t.id === updatedTemplate.id ? updatedTemplate : t
                    ));
                    toast.success(`${updatedTemplate.name} updated in library`);
                    setIsStudioOpen(false);
                }}
            />
        </motion.div>
    )
}

function VisualStudioModal({ open, onOpenChange, template, onSave }: { open: boolean, onOpenChange: (o: boolean) => void, template: any, onSave: (updatedTemplate: any) => void }) {
    const [layout, setLayout] = useState<any>(null)
    const [meta, setMeta] = useState({ name: '', status: '', score: 0 })

    useEffect(() => {
        if (template) {
            setLayout(template.layout || {
                columns: 2,
                sidebar: 'left',
                header: 'modern',
                primaryColor: '#4F46E5',
                secondaryColor: '#94A3B8',
                fontFamily: 'font-sans',
                spacing: 'normal'
            })
            setMeta({
                name: template.name || 'Unnamed Template',
                status: template.status || 'Draft',
                score: template.score || 85
            })
        }
    }, [template])

    if (!template || !layout) return null

    const themes = [
        { name: 'Royal Indigo', primary: '#4F46E5', secondary: '#94A3B8' },
        { name: 'Midnight Slate', primary: '#0F172A', secondary: '#64748B' },
        { name: 'Forest Emerald', primary: '#059669', secondary: '#64748B' },
        { name: 'Sunset Rose', primary: '#E11D48', secondary: '#94A3B8' },
        { name: 'Deep Violet', primary: '#7C3AED', secondary: '#94A3B8' },
    ]

    const fonts = [
        { name: 'Modern Sans', value: 'font-sans' },
        { name: 'Classic Serif', value: 'font-serif' },
        { name: 'Tech Mono', value: 'font-mono' },
    ]

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-none w-screen h-screen p-0 border-none rounded-none overflow-hidden bg-white z-[100]">
                <DialogTitle className="sr-only">Template Visual Studio</DialogTitle>
                <DialogDescription className="sr-only">Configure and customize resume template layouts and styles.</DialogDescription>
                <div className="flex h-full">
                    {/* Left Toolbar */}
                    <div className="w-[340px] bg-white border-r border-[#E2E8F0] flex flex-col shrink-0">
                        <div className="p-6 border-b border-[#F1F5F9] flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-sm`} style={{ backgroundColor: layout.primaryColor }}>
                                    <Paintbrush className="w-4 h-4" />
                                </div>
                                <span className="font-bold text-[#0F172A]">Design Studio</span>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="rounded-full">
                                <X className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                            {/* Layout Selection */}
                            <section className="space-y-4">
                                <div className="flex items-center gap-2 text-[#64748B]">
                                    <Columns className="w-3.5 h-3.5" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Architecture</span>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => setLayout({ ...layout, columns: 1, sidebar: 'none' })}
                                        className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${layout.columns === 1 ? 'border-[#0F172A] bg-[#F1F5F9]' : 'border-transparent bg-gray-50'}`}
                                    >
                                        <div className="w-full aspect-[3/4] bg-white rounded border border-gray-200 p-2 space-y-1">
                                            <div className="h-1 bg-gray-200 w-full" />
                                            <div className="h-1 bg-gray-100 w-full" />
                                        </div>
                                        <span className="text-[10px] font-bold">Single</span>
                                    </button>
                                    <button
                                        onClick={() => setLayout({ ...layout, columns: 2, sidebar: layout.sidebar === 'none' ? 'left' : layout.sidebar })}
                                        className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${layout.columns === 2 ? 'border-[#0F172A] bg-[#F1F5F9]' : 'border-transparent bg-gray-50'}`}
                                    >
                                        <div className="w-full aspect-[3/4] bg-white rounded border border-gray-200 flex gap-1 p-1">
                                            <div className="w-1/3 bg-gray-100 h-full" />
                                            <div className="w-2/3 bg-gray-50 h-full" />
                                        </div>
                                        <span className="text-[10px] font-bold">Dual</span>
                                    </button>
                                </div>
                            </section>

                            {/* Theme & Colors */}
                            <section className="space-y-4">
                                <div className="flex items-center gap-2 text-[#64748B]">
                                    <Palette className="w-3.5 h-3.5" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Color Palette</span>
                                </div>
                                <div className="grid grid-cols-5 gap-2">
                                    {themes.map(t => (
                                        <button
                                            key={t.name}
                                            onClick={() => setLayout({ ...layout, primaryColor: t.primary, secondaryColor: t.secondary })}
                                            className={`group relative w-full aspect-square rounded-full border-2 p-0.5 transition-all ${layout.primaryColor === t.primary ? 'border-[#0F172A] scale-110 shadow-md' : 'border-transparent hover:scale-110'}`}
                                        >
                                            <div className="w-full h-full rounded-full overflow-hidden flex rotate-45">
                                                <div className="w-1/2 h-full" style={{ backgroundColor: t.primary }} />
                                                <div className="w-1/2 h-full" style={{ backgroundColor: t.secondary }} />
                                            </div>
                                            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-[#0F172A] text-white text-[8px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-10 transition-opacity">
                                                {t.name}
                                            </div>
                                        </button>
                                    ))}
                                    <div className="w-full aspect-square rounded-full border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:border-gray-400">
                                        <Plus className="w-3 h-3 text-gray-400" />
                                    </div>
                                </div>
                                <div className="space-y-3 pt-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase">Primary Accent</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-mono font-bold text-[#0F172A]">{layout.primaryColor}</span>
                                            <input
                                                type="color"
                                                value={layout.primaryColor}
                                                onChange={e => setLayout({ ...layout, primaryColor: e.target.value })}
                                                className="w-6 h-6 rounded-md border-none cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Typography */}
                            <section className="space-y-4">
                                <div className="flex items-center gap-2 text-[#64748B]">
                                    <Type className="w-3.5 h-3.5" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Typography</span>
                                </div>
                                <div className="space-y-2">
                                    {fonts.map(f => (
                                        <button
                                            key={f.value}
                                            onClick={() => setLayout({ ...layout, fontFamily: f.value })}
                                            className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all ${layout.fontFamily === f.value ? 'border-[#0F172A] bg-[#F1F5F9]' : 'border-transparent bg-gray-50'}`}
                                        >
                                            <span className={`text-xs font-bold ${f.value}`}>{f.name}</span>
                                            {layout.fontFamily === f.value && <CheckCircle2 className="w-3.5 h-3.5" />}
                                        </button>
                                    ))}
                                </div>
                            </section>

                            {/* Header Styles */}
                            <section className="space-y-4">
                                <div className="flex items-center gap-2 text-[#64748B]">
                                    <Component className="w-3.5 h-3.5" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Component Styling</span>
                                </div>
                                <div className="flex bg-gray-100 p-1 rounded-xl">
                                    {['modern', 'centered', 'compact'].map(h => (
                                        <button
                                            key={h}
                                            onClick={() => setLayout({ ...layout, header: h })}
                                            className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all capitalize ${layout.header === h ? 'bg-white shadow-sm text-[#0F172A]' : 'text-gray-400'}`}
                                        >
                                            {h}
                                        </button>
                                    ))}
                                </div>
                            </section>
                        </div>

                        <div className="p-6 border-t border-[#F1F5F9] bg-white space-y-4">
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8]">Template Identity</Label>
                                <Input
                                    value={meta.name}
                                    onChange={(e) => setMeta({ ...meta, name: e.target.value })}
                                    className="h-10 rounded-xl bg-[#F8F9FB] border-none text-sm font-bold"
                                    placeholder="Template name..."
                                />
                                <div className="grid grid-cols-2 gap-2">
                                    <select
                                        value={meta.status}
                                        onChange={(e) => setMeta({ ...meta, status: e.target.value })}
                                        className="h-10 rounded-xl bg-[#F8F9FB] border-none text-[10px] font-black uppercase px-2"
                                    >
                                        <option value="Draft">Draft</option>
                                        <option value="Active">Active</option>
                                        <option value="Premium">Premium</option>
                                    </select>
                                    <div className="flex h-10 items-center px-3 bg-[#F8F9FB] rounded-xl gap-2 font-bold text-[10px]">
                                        <span className="text-gray-400">ATS</span> {meta.score}%
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        console.log('Layout Schema:', JSON.stringify({ ...layout, meta }, null, 2));
                                        toast.info("Layout schema exported to console");
                                    }}
                                    className="flex-1 h-12 rounded-2xl font-bold border-gray-200 text-xs"
                                >
                                    Schema
                                </Button>
                                <Button
                                    onClick={() => onSave({ ...template, name: meta.name, status: meta.status, layout })}
                                    className="flex-[2] h-12 bg-[#0F172A] text-white font-bold rounded-2xl shadow-lg shadow-[#0F172A]/20 gap-2 text-xs"
                                >
                                    <Globe className="w-4 h-4" /> Save & Update Library
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Preview Area */}
                    <div className="flex-1 flex flex-col">
                        <div className="h-16 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-8 shrink-0">
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-[#F1F5F9] rounded-lg">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[10px] font-bold text-[#0F172A]">LIVE RENDERING ENGINE</span>
                                </div>
                                <div className="flex bg-gray-100 p-1 rounded-lg">
                                    <button className="p-1 px-3 bg-white shadow-xs rounded-md"><Monitor className="w-3.5 h-3.5" /></button>
                                    <button className="p-1 px-3 opacity-30"><Smartphone className="w-3.5 h-3.5" /></button>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-bold text-gray-400">AUTOSAVE ENABLED</span>
                                <div className="h-4 w-px bg-gray-200 mx-2" />
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-[#0F172A] uppercase tracking-wider">{template.name}</p>
                                    <p className="text-[9px] text-[#64748B]">Layout v4.0</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-12 flex justify-center bg-[#EBEDF2]/40 custom-scrollbar">
                            <motion.div
                                layout
                                className={`w-full max-w-[850px] min-h-[1100px] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-sm flex flex-col p-16 gap-10 ${layout.fontFamily} transition-all duration-500 my-8`}
                            >
                                {/* Header Preview */}
                                <div className={`flex flex-col gap-2 ${layout.header === 'centered' ? 'items-center text-center' : ''} ${layout.header === 'compact' ? 'flex-row items-center justify-between border-b-2 pb-6' : ''}`} style={{ borderColor: layout.primaryColor + '20' }}>
                                    <div className="space-y-1">
                                        <h1 className="text-4xl font-black tracking-tight" style={{ color: '#0F172A' }}>Mani Admin</h1>
                                        <p className="font-bold tracking-[0.2em] text-sm uppercase" style={{ color: layout.primaryColor }}>Senior Systems Developer</p>
                                    </div>
                                    <div className={`flex gap-4 text-[11px] text-gray-500 font-medium ${layout.header === 'centered' ? 'justify-center border-t border-b py-3 w-full' : ''}`} style={{ borderColor: '#F1F5F9' }}>
                                        <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: layout.primaryColor }} /> mani@admin.com</span>
                                        <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: layout.primaryColor }} /> +91 98765 43210</span>
                                        <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: layout.primaryColor }} /> Tamil Nadu, IN</span>
                                    </div>
                                </div>

                                {/* Body Preview */}
                                <div className={`flex-1 flex gap-12 ${layout.sidebar === 'right' ? 'flex-row-reverse' : ''}`}>
                                    {layout.columns === 2 && (
                                        <div className="w-[260px] space-y-8">
                                            <section className="space-y-4">
                                                <h3 className="text-[11px] font-black uppercase tracking-[4px] py-1 border-b-2 inline-block" style={{ color: '#0F172A', borderColor: layout.primaryColor }}>Expertise</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {['React Native', 'Supabase', 'Cloud Ops', 'Framer Motion', 'TypeScript'].map(s => (
                                                        <span key={s} className="px-3 py-1.5 text-[10px] font-bold rounded-lg" style={{ backgroundColor: layout.primaryColor + '10', color: layout.primaryColor }}>{s}</span>
                                                    ))}
                                                </div>
                                            </section>
                                            <section className="space-y-4">
                                                <h3 className="text-[11px] font-black uppercase tracking-[4px] py-1 border-b-2 inline-block" style={{ color: '#0F172A', borderColor: layout.primaryColor }}>Languages</h3>
                                                <div className="space-y-3">
                                                    <div className="space-y-1">
                                                        <div className="flex justify-between text-[10px] font-bold"><span>English</span><span>Native</span></div>
                                                        <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden"><div className="h-full w-full" style={{ backgroundColor: layout.primaryColor }} /></div>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="flex justify-between text-[10px] font-bold"><span>German</span><span>Fluent</span></div>
                                                        <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden"><div className="h-full w-3/4" style={{ backgroundColor: layout.primaryColor }} /></div>
                                                    </div>
                                                </div>
                                            </section>
                                        </div>
                                    )}

                                    <div className="flex-1 space-y-8">
                                        <section className="space-y-6">
                                            <div className="flex items-center gap-4">
                                                <h3 className="text-[11px] font-black uppercase tracking-[4px]" style={{ color: '#0F172A' }}>Work History</h3>
                                                <div className="flex-1 h-px" style={{ backgroundColor: '#F1F5F9' }} />
                                            </div>
                                            {[1, 2].map(i => (
                                                <div key={i} className="space-y-3 relative pl-6 border-l-2" style={{ borderColor: layout.primaryColor + '20' }}>
                                                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full border-4 border-white shadow-sm" style={{ backgroundColor: layout.primaryColor }} />
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <p className="font-black text-sm" style={{ color: '#0F172A' }}>Lead Product Administrator</p>
                                                            <p className="text-[11px] font-bold" style={{ color: layout.primaryColor }}>KS Global Solutions</p>
                                                        </div>
                                                        <span className="text-[10px] font-black bg-gray-50 px-2 py-1 rounded text-gray-400">2021 — 2024</span>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <div className="h-2 bg-gray-50 w-full rounded" />
                                                        <div className="h-2 bg-gray-50 w-4/5 rounded" />
                                                    </div>
                                                </div>
                                            ))}
                                        </section>
                                        <section className="space-y-6">
                                            <div className="flex items-center gap-4">
                                                <h3 className="text-[11px] font-black uppercase tracking-[4px]" style={{ color: '#0F172A' }}>Education</h3>
                                                <div className="flex-1 h-px" style={{ backgroundColor: '#F1F5F9' }} />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="font-black text-sm">B.Sc Computer Science</p>
                                                <p className="text-[11px] font-bold" style={{ color: layout.primaryColor }}>University of Madurai</p>
                                            </div>
                                        </section>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

function PaymentsView({ transactions }: { transactions: any[] }) {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <h1 className="text-2xl font-bold">Payment Ledger</h1>
            <Card className="border-none shadow-sm rounded-2xl">
                <CardHeader className="flex flex-row items-center justify-between border-b border-gray-50 pb-6">
                    <div>
                        <CardTitle>Recent Transactions</CardTitle>
                        <CardDescription>Full audit trail of platform revenue.</CardDescription>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => exportToCSV(transactions, 'platform_revenue')}
                    >
                        <Download className="w-4 h-4" /> CSV Export
                    </Button>
                </CardHeader>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                                <th className="p-4 pl-8">Transaction ID</th>
                                <th className="p-4">User</th>
                                <th className="p-4">Amount</th>
                                <th className="p-4">Date</th>
                                <th className="p-4 pr-8 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm font-medium">
                            {transactions.map(tx => (
                                <tr key={tx.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                                    <td className="p-4 pl-8 font-mono text-xs">{tx.id}</td>
                                    <td className="p-4">{tx.user}</td>
                                    <td className="p-4 text-[#0F172A] font-bold">{tx.amount}</td>
                                    <td className="p-4 text-gray-400">{tx.date}</td>
                                    <td className="p-4 pr-8 text-right text-emerald-600 font-bold">
                                        <div className="flex items-center justify-end gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> {tx.status}</div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </motion.div>
    )
}

function SettingsView() {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl space-y-10">
            <h1 className="text-2xl font-bold">Platform Configuration</h1>
            <div className="space-y-8">
                <section className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Model Preferences</h3>
                    <Card className="border-none shadow-sm rounded-2xl">
                        <CardContent className="p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <div><p className="font-bold">Active AI Model</p><p className="text-xs text-gray-400">Select the core engine for resume generation.</p></div>
                                <Button variant="outline" size="sm" className="gap-2">Claude 3.5 Sonnet <ChevronDown className="w-3 h-3" /></Button>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div><p className="font-bold">Maintenance Mode</p><p className="text-xs text-gray-400">Temporarily disable public access during updates.</p></div>
                                <div className="w-12 h-6 bg-gray-200 rounded-full cursor-pointer relative"><div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full" /></div>
                            </div>
                        </CardContent>
                    </Card>
                </section>
                <section className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Public Branding</h3>
                    <Card className="border-none shadow-sm rounded-2xl">
                        <CardContent className="p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <div><p className="font-bold">Portal Name</p><p className="text-xs text-gray-400">Display name for the administrator portal.</p></div>
                                <Input className="w-64 h-9 text-right" defaultValue="KS Admin Dashboard" />
                            </div>
                        </CardContent>
                    </Card>
                </section>
            </div>
        </motion.div>
    )
}

function LogsView() {
    const logs = [
        { id: 1, action: 'ADMIN_LOGIN', user: 'mani@admin.com', time: '2 mins ago', ip: '122.164.x.x' },
        { id: 2, action: 'TIER_UPGRADE', user: 'sarah.j@gmail.com', time: '14 mins ago', ip: '45.12.x.x' },
        { id: 3, action: 'REVENUE_EXPORT', user: 'mani@admin.com', time: '1 hour ago', ip: '122.164.x.x' },
        { id: 4, action: 'USER_SUSPEND', user: 'mani@admin.com', time: '3 hours ago', ip: '122.164.x.x' }
    ]
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <h1 className="text-2xl font-bold">System Audit Logs</h1>
            <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                                <th className="p-4 pl-8">Action Type</th>
                                <th className="p-4">Entity/User</th>
                                <th className="p-4">Timestamp</th>
                                <th className="p-4 pr-8 text-right">Access IP</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm font-medium">
                            {logs.map(log => (
                                <tr key={log.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4 pl-8">
                                        <Badge className={`${log.action === 'USER_SUSPEND' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-600'} border-none rounded px-2`}>
                                            {log.action}
                                        </Badge>
                                    </td>
                                    <td className="p-4 font-bold text-[#0F172A]">{log.user}</td>
                                    <td className="p-4 text-gray-400">{log.time}</td>
                                    <td className="p-4 pr-8 text-right font-mono text-[10px] text-gray-400">{log.ip}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </motion.div>
    )
}

function SupportView() {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[32px] flex items-center justify-center">
                <LifeBuoy className="w-10 h-10" />
            </div>
            <div className="max-w-sm space-y-2">
                <h2 className="text-2xl font-bold text-[#0F172A]">Support Command Center</h2>
                <p className="text-sm text-[#64748B]">You have <span className="text-[#0F172A] font-bold">0 active tickets</span>. Your system is perfectly healthy and all users are operating normally.</p>
            </div>
            <Button variant="outline" className="rounded-xl px-10 h-11 border-blue-200 text-blue-600 hover:bg-blue-50 font-bold transition-all">Go to Documentation</Button>
        </motion.div>
    )
}
