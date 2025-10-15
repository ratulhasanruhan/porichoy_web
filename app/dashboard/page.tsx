'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { useSupabase } from '@/components/providers/SupabaseProvider'
import { Plus, FileText, Eye, Edit, Trash2, ExternalLink, Loader2 } from 'lucide-react'
import type { Database } from '@/types/database'
import { formatDate, formatNumber } from '@/lib/utils'

type Profile = Database['public']['Tables']['profiles']['Row']
type ProfileInsert = Database['public']['Tables']['profiles']['Insert']

export default function DashboardPage() {
  const router = useRouter()
  const { user, profile: userProfile } = useAuthStore()
  const { supabase } = useSupabase()
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [stats, setStats] = useState({
    totalViews: 0,
    totalProfiles: 0,
  })

  const loadProfiles = async () => {
    if (!user?.id) {
      setLoading(false)
      return
    }
    
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase error:', error)
        alert('Failed to load resumes. Please refresh the page.')
        return
      }

      setProfiles(data || [])
    } catch (error) {
      console.error('Error loading profiles:', error)
      alert('Failed to load resumes. Please refresh the page.')
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    if (!user?.id) return
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('views_count')
        .eq('user_id', user.id)

      if (error) {
        console.error('Stats error:', error)
        return
      }

      const totalViews = data?.reduce((sum: number, p: any) => sum + (p.views_count || 0), 0) || 0
      setStats({
        totalViews,
        totalProfiles: data?.length || 0,
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  useEffect(() => {
    if (user) {
      loadProfiles()
      loadStats()
    } else if (!user && !useAuthStore.getState().isLoading) {
      router.push('/auth/login')
    }
    // Only run when user changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  const handleCreateResume = async () => {
    if (!user?.id) {
      router.push('/auth/login')
      return
    }

    try {
      setCreating(true)

      // Create a new resume with properly typed data
      const newResume: ProfileInsert = {
        user_id: user.id,
        title: `Resume ${profiles.length + 1}`,
        summary: '',
        data: {
          personalInfo: {
            fullName: userProfile?.name || '',
            email: user?.email || '',
          },
          experience: [],
          education: [],
          skills: [],
          projects: [],
          certifications: [],
          languages: [],
          contact: {
            email: user?.email || '',
          },
        },
        is_public: false,
      }

      const { data, error } = await supabase
        .from('profiles')
        .insert(newResume)
        .select()
        .single()

      if (error) {
        console.error('Error creating resume:', error)
        alert(`Failed to create resume: ${error.message}. Please try again.`)
        setCreating(false)
        return
      }

      if (data) {
        // Redirect to the edit page for the new resume
        router.push(`/dashboard/edit/${data.id}`)
      } else {
        alert('Failed to create resume. Please try again.')
        setCreating(false)
      }
    } catch (error: any) {
      console.error('Error creating resume:', error)
      alert(`Failed to create resume: ${error?.message || 'Unknown error'}. Please try again.`)
      setCreating(false)
    }
  }

  const handleDeleteResume = async (id: string) => {
    const confirmed = confirm('Are you sure you want to delete this resume? This action cannot be undone.')
    if (!confirmed) return

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id || '')

      if (error) {
        console.error('Error deleting resume:', error)
        alert('Failed to delete resume. Please try again.')
        return
      }

      // Reload data after deletion
      await loadProfiles()
      await loadStats()
    } catch (error) {
      console.error('Error deleting resume:', error)
      alert('Failed to delete resume. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const locale = userProfile?.locale || 'en'

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className={`text-3xl font-bold mb-2 ${locale === 'bn' ? 'font-bengali' : ''}`}>
            {locale === 'bn' ? 'ড্যাশবোর্ড' : 'Dashboard'}
          </h1>
          <p className={`text-muted-foreground ${locale === 'bn' ? 'font-bengali' : ''}`}>
            {locale === 'bn' ? 'স্বাগতম' : 'Welcome back'}, {userProfile?.name || 'User'}!
          </p>
        </div>
        <Button onClick={handleCreateResume} disabled={creating}>
          {creating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {locale === 'bn' ? 'তৈরি হচ্ছে...' : 'Creating...'}
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              {locale === 'bn' ? 'নতুন রিজিউম তৈরি করুন' : 'Create New Resume'}
            </>
          )}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className={locale === 'bn' ? 'font-bengali' : ''}>
              {locale === 'bn' ? 'মোট রিজিউম' : 'Total Resumes'}
            </CardDescription>
            <CardTitle className="text-3xl">{stats.totalProfiles}</CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className={locale === 'bn' ? 'font-bengali' : ''}>
              {locale === 'bn' ? 'মোট প্রোফাইল ভিউ' : 'Total Profile Views'}
            </CardDescription>
            <CardTitle className="text-3xl">
              {formatNumber(stats.totalViews, locale)}
            </CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className={locale === 'bn' ? 'font-bengali' : ''}>
              {locale === 'bn' ? 'আপনার প্রোফাইল' : 'Your Profile'}
            </CardDescription>
            <CardTitle className="text-lg truncate">
              porichoy.me/{userProfile?.username || 'username'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {userProfile?.username ? (
              <Link href={`/${userProfile.username}`}>
                <Button variant="outline" size="sm" className="w-full">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  {locale === 'bn' ? 'পাবলিক প্রোফাইল দেখুন' : 'View Public Profile'}
                </Button>
              </Link>
            ) : (
              <Link href="/dashboard/settings">
                <Button variant="outline" size="sm" className="w-full">
                  {locale === 'bn' ? 'ইউজারনেম সেট করুন' : 'Set Username'}
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Resumes List */}
      <div>
        <h2 className={`text-2xl font-semibold mb-4 ${locale === 'bn' ? 'font-bengali' : ''}`}>
          {locale === 'bn' ? 'আমার রিজিউম' : 'My Resumes'}
        </h2>

        {profiles.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <FileText className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className={`text-xl font-semibold mb-2 ${locale === 'bn' ? 'font-bengali' : ''}`}>
                {locale === 'bn' ? 'এখনো কোনো রিজিউম নেই' : 'No Resumes Yet'}
              </h3>
              <p className={`text-muted-foreground mb-6 text-center max-w-md ${locale === 'bn' ? 'font-bengali' : ''}`}>
                {locale === 'bn'
                  ? 'আপনার প্রথম পেশাদার রিজিউম তৈরি করে শুরু করুন। এটি মাত্র কয়েক মিনিট সময় নেয়!'
                  : 'Get started by creating your first professional resume. It only takes a few minutes!'}
              </p>
              <Button onClick={handleCreateResume} disabled={creating}>
                {creating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {locale === 'bn' ? 'তৈরি হচ্ছে...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    {locale === 'bn' ? 'আপনার প্রথম রিজিউম তৈরি করুন' : 'Create Your First Resume'}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map((profile) => (
              <Card key={profile.id} className="hover:shadow-lg transition-all hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-1">
                        {profile.title || (locale === 'bn' ? 'শিরোনামহীন রিজিউম' : 'Untitled Resume')}
                      </CardTitle>
                      <CardDescription className="line-clamp-2 mt-1">
                        {profile.summary || (locale === 'bn' ? 'কোনো সারাংশ নেই' : 'No summary')}
                      </CardDescription>
                    </div>
                    <div className={`text-xs px-2 py-1 rounded ${
                      profile.is_public
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
                    }`}>
                      {profile.is_public
                        ? (locale === 'bn' ? 'পাবলিক' : 'Public')
                        : (locale === 'bn' ? 'প্রাইভেট' : 'Private')}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{formatNumber(profile.views_count || 0, locale)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      <span>{formatDate(profile.updated_at, locale)}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Link href={`/dashboard/edit/${profile.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Edit className="h-4 w-4 mr-2" />
                        {locale === 'bn' ? 'সম্পাদনা' : 'Edit'}
                      </Button>
                    </Link>
                    {profile.is_public && userProfile?.username && (
                      <Link href={`/${userProfile.username}`}>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteResume(profile.id)}
                      className="hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
