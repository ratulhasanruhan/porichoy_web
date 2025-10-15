'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useSupabase } from '@/components/providers/SupabaseProvider'
import { FileText, Loader2 } from 'lucide-react'
import { isValidUsername } from '@/lib/utils'

export default function SignupPage() {
  const router = useRouter()
  const { supabase } = useSupabase()
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [usernameError, setUsernameError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (name === 'username') {
      if (value && !isValidUsername(value)) {
        setUsernameError('Username can only contain lowercase letters, numbers, hyphens, and underscores (3-30 characters)')
      } else {
        setUsernameError('')
      }
    }
  }

  const checkUsernameAvailability = async (username: string): Promise<boolean> => {
    try {
      const { data } = await supabase
        .from('users')
        .select('username')
        .eq('username', username)
        .single()

      return !data
    } catch {
      return true
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Validate
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match')
      }

      if (!isValidUsername(formData.username)) {
        throw new Error('Invalid username format')
      }

      // Check username availability
      const isAvailable = await checkUsernameAvailability(formData.username)
      if (!isAvailable) {
        throw new Error('This username is already taken')
      }

      // Sign up
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            username: formData.username,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (authError) throw authError

      if (authData.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            username: formData.username,
            name: formData.fullName,
            email: formData.email,
            locale: 'bn' as const,
            is_public: true,
          } as any)

        if (profileError) {
          console.error('Profile creation error:', profileError)
        }

        // Create default profile/resume
        const { error: resumeError } = await supabase
          .from('profiles')
          .insert({
            user_id: authData.user.id,
            title: 'My Resume',
            summary: '',
            data: {
              personalInfo: {
                fullName: formData.fullName,
              },
              experience: [],
              education: [],
              skills: [],
              projects: [],
              certifications: [],
              languages: [],
              contact: {
                email: formData.email,
              },
            },
          } as any)

        if (resumeError) {
          console.error('Resume creation error:', resumeError)
        }

        router.push('/dashboard')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during signup'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    setLoading(true)
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to signup with Google'
      setError(errorMessage)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <FileText className="h-8 w-8 text-primary" />
          <div className="text-center">
            <h1 className="text-2xl font-bold">Porichoy</h1>
            <p className="text-sm text-muted-foreground font-bengali">পরিচয়</p>
          </div>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Create Your Account</CardTitle>
            <CardDescription>
              Get started with your professional resume today
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 text-sm bg-destructive/10 text-destructive rounded-md">
                {error}
              </div>
            )}

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleSignup}
              disabled={loading}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with email
                </span>
              </div>
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">
                  Username
                  <span className="text-xs text-muted-foreground ml-2">
                    (for your public profile link)
                  </span>
                </Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="johndoe"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className={usernameError ? 'border-destructive' : ''}
                />
                {usernameError && (
                  <p className="text-xs text-destructive">{usernameError}</p>
                )}
                {formData.username && !usernameError && (
                  <p className="text-xs text-muted-foreground">
                    Your profile: porichoy.me/{formData.username}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  minLength={8}
                  disabled={loading}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading || !!usernameError}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Account
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-primary hover:underline font-medium">
                Login
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
