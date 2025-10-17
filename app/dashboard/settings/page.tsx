'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { useSupabase } from '@/components/providers/SupabaseProvider'
import { useTranslations } from '@/lib/hooks/useTranslations'
import { setLocale } from '@/lib/i18n'
import { Save, Loader2, Eye, EyeOff } from 'lucide-react'
import { isValidUsername, getPublicProfileUrl } from '@/lib/utils'
import type { Database } from '@/types/database'

export default function SettingsPage() {
  const router = useRouter()
  const { user, profile, setProfile } = useAuthStore()
  const { supabase } = useSupabase()
  const { t } = useTranslations({ namespace: 'common' })
  
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    locale: 'bn' as 'bn' | 'en',
    is_public: true,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [usernameError, setUsernameError] = useState('')

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name,
        username: profile.username,
        locale: profile.locale,
        is_public: profile.is_public,
      })
      setLoading(false)
    }
  }, [profile])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))

    if (name === 'username') {
      if (value && !isValidUsername(value)) {
        setUsernameError('Username can only contain lowercase letters, numbers, hyphens, and underscores (3-30 characters)')
      } else {
        setUsernameError('')
      }
    }
    
    // Handle language change immediately
    if (name === 'locale') {
      setLocale(value as 'bn' | 'en')
    }
  }

  const checkUsernameAvailability = async (username: string): Promise<boolean> => {
    try {
      const { data } = await supabase
        .from('users')
        .select('username')
        .eq('username', username)
        .neq('id', user?.id)
        .single()

      return !data
    } catch {
      return true
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSaving(true)

    try {
      // Validate username
      if (!isValidUsername(formData.username)) {
        throw new Error('Invalid username format')
      }

      // Check username availability if changed
      if (formData.username !== profile?.username) {
        const isAvailable = await checkUsernameAvailability(formData.username)
        if (!isAvailable) {
          throw new Error('This username is already taken')
        }
      }

      // Update user profile
      const updateData: Database['public']['Tables']['users']['Update'] = {
        name: formData.name,
        username: formData.username,
        locale: formData.locale,
        is_public: formData.is_public,
        updated_at: new Date().toISOString(),
      }
      
      const { error: updateError } = await (supabase as any)
        .from('users')
        .update(updateData)
        .eq('id', user?.id || '')

      if (updateError) throw updateError

      // Update profiles visibility
      const profilesUpdateData: Database['public']['Tables']['profiles']['Update'] = {
        is_public: formData.is_public
      }
      
      const { error: profilesError } = await (supabase as any)
        .from('profiles')
        .update(profilesUpdateData)
        .eq('user_id', user?.id || '')

      if (profilesError) throw profilesError

      // Update local state
      const { data: updatedProfile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user?.id || '')
        .single()

      if (updatedProfile) {
        setProfile(updatedProfile)
      }

      setSuccess('Settings saved successfully!')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save settings'
      setError(errorMessage)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      {error && (
        <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 rounded-md">
          {success}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Update your public profile information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">
                Username
                <span className="text-xs text-muted-foreground ml-2">
                  (used in your public profile URL)
                </span>
              </Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className={usernameError ? 'border-destructive' : ''}
              />
              {usernameError && (
                <p className="text-xs text-destructive">{usernameError}</p>
              )}
              {formData.username && !usernameError && (
                <p className="text-xs text-muted-foreground">
                  Your profile URL: {getPublicProfileUrl(formData.username)}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="locale">{t('language', 'Language')}</Label>
              <select
                id="locale"
                name="locale"
                value={formData.locale}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md border border-input bg-background"
              >
                <option value="bn">{t('bangla', 'বাংলা (Bangla)')}</option>
                <option value="en">{t('english', 'English')}</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Privacy Settings</CardTitle>
            <CardDescription>
              Control who can see your profile
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="is_public">Public Profile</Label>
                <p className="text-sm text-muted-foreground">
                  Make your profile visible to everyone
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={formData.is_public}
                onClick={() =>
                  setFormData((prev) => ({ ...prev, is_public: !prev.is_public }))
                }
                className={`
                  relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                  ${formData.is_public ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}
                `}
              >
                <span
                  className={`
                    inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                    ${formData.is_public ? 'translate-x-6' : 'translate-x-1'}
                  `}
                />
              </button>
            </div>

            {formData.is_public ? (
              <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-md text-sm">
                <Eye className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-green-800 dark:text-green-200">
                  Your profile is public and can be viewed by anyone
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-md text-sm">
                <EyeOff className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <span className="text-gray-800 dark:text-gray-200">
                  Your profile is private and hidden from public view
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>
              Your account details (read-only)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={user?.email || ''} disabled />
            </div>
            <div className="space-y-2">
              <Label>User ID</Label>
              <Input value={user?.id || ''} disabled className="font-mono text-xs" />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={saving || !!usernameError}>
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Changes
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/dashboard')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}

