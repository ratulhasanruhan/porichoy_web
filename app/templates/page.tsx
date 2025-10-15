'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Eye, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Navbar } from '@/components/navigation/Navbar'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { useSupabase } from '@/components/providers/SupabaseProvider'
import type { Database } from '@/types/database'

type Template = Database['public']['Tables']['templates']['Row']

export default function TemplatesPage() {
  const router = useRouter()
  const { user, profile: userProfile } = useAuthStore()
  const { supabase } = useSupabase()
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [creatingWithTemplate, setCreatingWithTemplate] = useState<string | null>(null)

  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .eq('is_official', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTemplates(data || [])
    } catch (error) {
      console.error('Error loading templates:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUseTemplate = async (templateId: string) => {
    if (!user) {
      router.push('/auth/signup')
      return
    }

    try {
      setCreatingWithTemplate(templateId)

      // Create a new resume with the selected template
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          user_id: user.id,
          title: `New Resume`,
          summary: '',
          template_id: templateId,
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
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating resume:', error)
        alert('Failed to create resume. Please try again.')
        setCreatingWithTemplate(null)
        return
      }

      if (data) {
        router.push(`/dashboard/edit/${data.id}`)
      }
    } catch (error) {
      console.error('Error creating resume:', error)
      alert('Failed to create resume. Please try again.')
      setCreatingWithTemplate(null)
    }
  }

  const categorizedTemplates = templates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = []
    }
    acc[template.category].push(template)
    return acc
  }, {} as Record<string, Template[]>)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading templates...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Resume Templates</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose from our collection of professional templates designed for both{' '}
            <span className="font-bengali font-semibold">বাংলা</span> and English resumes
          </p>
        </div>

        {/* Templates by Category */}
        {Object.entries(categorizedTemplates).map(([category, categoryTemplates]) => (
          <div key={category} className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <span className="h-1 w-8 bg-primary rounded"></span>
              {category}
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryTemplates.map((template) => (
                <Card key={template.id} className="group hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className="aspect-[3/4] bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                      {template.preview_image ? (
                        <img
                          src={template.preview_image}
                          alt={template.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center p-8">
                          <div className="text-6xl mb-4">📄</div>
                          <p className="text-sm text-muted-foreground">
                            {template.name}
                          </p>
                        </div>
                      )}
                    </div>
                    <CardTitle className="line-clamp-1">{template.name}</CardTitle>
                    <CardDescription className="flex gap-2 mt-2">
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                        {template.locale === 'dual' ? 'Bangla + English' : template.locale === 'bn' ? 'বাংলা' : 'English'}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                        {template.category}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Link href={`/templates/${template.id}/preview`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        onClick={() => handleUseTemplate(template.id)}
                        disabled={creatingWithTemplate === template.id}
                      >
                        {creatingWithTemplate === template.id ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          'Use Template'
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}

        {templates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No templates available yet.</p>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center bg-white dark:bg-gray-800 rounded-lg p-12 shadow-lg">
          <h2 className="text-3xl font-bold mb-4">Ready to Create Your Resume?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            {user
              ? 'Choose a template above to start building your professional resume'
              : 'Sign up for free and start building your professional resume with our beautiful templates'}
          </p>
          <div className="flex gap-4 justify-center">
            {user ? (
              <Link href="/dashboard">
                <Button size="lg">Go to Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/auth/signup">
                  <Button size="lg">Get Started Free</Button>
                </Link>
                <Link href="/auth/login">
                  <Button size="lg" variant="outline">Login</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
