import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Save, Crown, Loader2, User, Mail, Phone, MapPin } from 'lucide-react'
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

    const handleSave = async () => {
        if (!user) return

        setIsSaving(true)
        try {
            const updateData: any = {
                updated_at: new Date().toISOString()
            }

            // Only add fields if they are intended to be supported
            // This is still going to fail with 400 if columns don't exist
            // but we can catch it and explain.
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
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-muted/20">
            {/* Header */}
            <header className="h-16 border-b flex items-center justify-between px-6 bg-background">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Dashboard
                    </Button>
                    <Separator orientation="vertical" className="h-6" />
                    <h1 className="text-lg font-semibold">My Profile</h1>
                </div>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                    Sign Out
                </Button>
            </header>

            {/* Content */}
            <div className="max-w-4xl mx-auto p-6 space-y-6">
                {/* Account Status */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Account Status</CardTitle>
                                <CardDescription>Your current subscription plan</CardDescription>
                            </div>
                            {profile?.is_pro ? (
                                <Badge className="gap-1">
                                    <Crown className="h-3 w-3" />
                                    Pro Plan
                                </Badge>
                            ) : (
                                <Badge variant="secondary">Free Plan</Badge>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        {!profile?.is_pro && (
                            <div className="bg-muted/50 p-4 rounded-lg">
                                <p className="text-sm text-muted-foreground mb-3">
                                    Upgrade to Pro to unlock premium templates and unlimited resumes
                                </p>
                                <a
                                    href="https://wa.me/918270374293?text=Hi!%20I'm%20interested%20in%20upgrading%20to%20Pro%20plan"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Button size="sm" className="gap-2">
                                        <Crown className="h-4 w-4" />
                                        Upgrade to Pro
                                    </Button>
                                </a>
                            </div>
                        )}
                        {profile?.is_pro && (
                            <div className="bg-primary/10 p-4 rounded-lg">
                                <p className="text-sm font-medium">
                                    ✨ You have access to all premium features!
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Personal Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>Update your profile details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">
                                <Mail className="h-4 w-4 inline mr-2" />
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={user?.email || ''}
                                disabled
                                className="bg-muted"
                            />
                            <p className="text-xs text-muted-foreground">
                                Email cannot be changed
                            </p>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                            <Label htmlFor="full_name">
                                <User className="h-4 w-4 inline mr-2" />
                                Full Name
                            </Label>
                            <Input
                                id="full_name"
                                value={formData.full_name}
                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                placeholder="John Doe"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">
                                <Phone className="h-4 w-4 inline mr-2" />
                                Phone Number
                            </Label>
                            <Input
                                id="phone"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="+1 (555) 123-4567"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="location">
                                <MapPin className="h-4 w-4 inline mr-2" />
                                Location
                            </Label>
                            <Input
                                id="location"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                placeholder="San Francisco, CA"
                            />
                        </div>

                        <div className="pt-4">
                            <Button onClick={handleSave} disabled={isSaving} className="w-full sm:w-auto">
                                {isSaving ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4 mr-2" />
                                        Save Changes
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Account Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Account Information</CardTitle>
                        <CardDescription>Your account details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Account Created</span>
                            <span className="font-medium">
                                {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
                            </span>
                        </div>
                        <Separator />
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Last Updated</span>
                            <span className="font-medium">
                                {profile?.updated_at ? new Date(profile.updated_at).toLocaleDateString() : 'N/A'}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
