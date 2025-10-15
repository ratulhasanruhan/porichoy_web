'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { useSupabase } from '@/components/providers/SupabaseProvider'
import { useResumeStore } from '@/lib/store/useResumeStore'
import { Save, Loader2, Plus, Trash2, GripVertical } from 'lucide-react'
import type { Database, Experience, Skill } from '@/types/database'
import { generateId } from '@/lib/utils'

type Profile = Database['public']['Tables']['profiles']['Row']

export default function EditResumePage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuthStore()
  const { supabase } = useSupabase()
  const { resumeData, setResumeData, updateSection, addItem, removeItem, isDirty, markClean } = useResumeStore()
  
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('personalInfo')

  useEffect(() => {
    if (user && params.id) {
      loadProfile()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, params.id])

  const loadProfile = async () => {
    if (!user?.id) {
      router.push('/dashboard')
      return
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', params.id as string)
        .eq('user_id', user.id)
        .single()

      if (error) throw error

      if (data) {
        setProfile(data)
        setResumeData((data as any).data || {})
      }
    } catch (error) {
      console.error('Error loading profile:', error)
      router.push('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)

    try {
      const { error } = await (supabase as any)
        .from('profiles')
        .update({
          data: resumeData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', params.id as string)

      if (error) throw error

      markClean()
      alert('Resume saved successfully!')
    } catch (error) {
      console.error('Error saving resume:', error)
      alert('Failed to save resume')
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
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Edit Resume</h1>
          <p className="text-muted-foreground">
            {profile?.title || 'Untitled Resume'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push('/dashboard')}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!isDirty || saving}>
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[300px_1fr] gap-6">
        {/* Sidebar - Sections */}
        <div className="space-y-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Resume Sections</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {[
                { id: 'personalInfo', label: 'Personal Info' },
                { id: 'experience', label: 'Experience' },
                { id: 'education', label: 'Education' },
                { id: 'skills', label: 'Skills' },
                { id: 'projects', label: 'Projects' },
                { id: 'certifications', label: 'Certifications' },
                { id: 'languages', label: 'Languages' },
                { id: 'contact', label: 'Contact' },
              ].map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition ${
                    activeSection === section.id
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Editor */}
        <div className="space-y-6">
          {/* Personal Info */}
          {activeSection === 'personalInfo' && (
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name (English)</Label>
                    <Input
                      value={resumeData.personalInfo.fullName || ''}
                      onChange={(e) =>
                        updateSection('personalInfo', {
                          ...resumeData.personalInfo,
                          fullName: e.target.value,
                        })
                      }
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bengali">Full Name (বাংলা)</Label>
                    <Input
                      value={resumeData.personalInfo.fullNameBn || ''}
                      onChange={(e) =>
                        updateSection('personalInfo', {
                          ...resumeData.personalInfo,
                          fullNameBn: e.target.value,
                        })
                      }
                      placeholder="জন ডো"
                      className="font-bengali"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Profession (English)</Label>
                    <Input
                      value={resumeData.personalInfo.profession || ''}
                      onChange={(e) =>
                        updateSection('personalInfo', {
                          ...resumeData.personalInfo,
                          profession: e.target.value,
                        })
                      }
                      placeholder="Software Developer"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bengali">Profession (বাংলা)</Label>
                    <Input
                      value={resumeData.personalInfo.professionBn || ''}
                      onChange={(e) =>
                        updateSection('personalInfo', {
                          ...resumeData.personalInfo,
                          professionBn: e.target.value,
                        })
                      }
                      placeholder="সফটওয়্যার ডেভেলপার"
                      className="font-bengালি"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input
                      value={resumeData.personalInfo.location || ''}
                      onChange={(e) =>
                        updateSection('personalInfo', {
                          ...resumeData.personalInfo,
                          location: e.target.value,
                        })
                      }
                      placeholder="Dhaka, Bangladesh"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Date of Birth</Label>
                    <Input
                      type="date"
                      value={resumeData.personalInfo.dateOfBirth || ''}
                      onChange={(e) =>
                        updateSection('personalInfo', {
                          ...resumeData.personalInfo,
                          dateOfBirth: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Experience */}
          {activeSection === 'experience' && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Work Experience</CardTitle>
                <Button
                  size="sm"
                  onClick={() =>
                    addItem('experience', {
                      id: generateId(),
                      company: '',
                      position: '',
                      startDate: '',
                      description: '',
                    } as Experience)
                  }
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Experience
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {resumeData.experience.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No work experience added yet
                  </p>
                ) : (
                  resumeData.experience.map((exp, index) => (
                    <div key={exp.id} className="border rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Experience {index + 1}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem('experience', exp.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Company</Label>
                          <Input
                            value={exp.company}
                            onChange={(e) => {
                              const updated = resumeData.experience.map((item) =>
                                item.id === exp.id
                                  ? { ...item, company: e.target.value }
                                  : item
                              )
                              updateSection('experience', updated)
                            }}
                            placeholder="Company Name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Position</Label>
                          <Input
                            value={exp.position}
                            onChange={(e) => {
                              const updated = resumeData.experience.map((item) =>
                                item.id === exp.id
                                  ? { ...item, position: e.target.value }
                                  : item
                              )
                              updateSection('experience', updated)
                            }}
                            placeholder="Job Title"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Start Date</Label>
                          <Input
                            type="date"
                            value={exp.startDate}
                            onChange={(e) => {
                              const updated = resumeData.experience.map((item) =>
                                item.id === exp.id
                                  ? { ...item, startDate: e.target.value }
                                  : item
                              )
                              updateSection('experience', updated)
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>End Date</Label>
                          <Input
                            type="date"
                            value={exp.endDate || ''}
                            onChange={(e) => {
                              const updated = resumeData.experience.map((item) =>
                                item.id === exp.id
                                  ? { ...item, endDate: e.target.value || null, current: false }
                                  : item
                              )
                              updateSection('experience', updated)
                            }}
                            disabled={exp.current}
                          />
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={exp.current || false}
                              onChange={(e) => {
                                const updated = resumeData.experience.map((item) =>
                                  item.id === exp.id
                                    ? { ...item, current: e.target.checked, endDate: null }
                                    : item
                                )
                                updateSection('experience', updated)
                              }}
                            />
                            Currently working here
                          </label>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Description</Label>
                        <textarea
                          className="w-full min-h-[100px] px-3 py-2 rounded-md border border-input bg-background"
                          value={exp.description}
                          onChange={(e) => {
                            const updated = resumeData.experience.map((item) =>
                              item.id === exp.id
                                ? { ...item, description: e.target.value }
                                : item
                            )
                            updateSection('experience', updated)
                          }}
                          placeholder="Describe your responsibilities and achievements..."
                        />
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          )}

          {/* Skills */}
          {activeSection === 'skills' && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Skills</CardTitle>
                <Button
                  size="sm"
                  onClick={() =>
                    addItem('skills', {
                      id: generateId(),
                      name: '',
                      level: 'intermediate',
                    } as Skill)
                  }
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Skill
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {resumeData.skills.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No skills added yet
                  </p>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {resumeData.skills.map((skill) => (
                      <div key={skill.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <Input
                            value={skill.name}
                            onChange={(e) => {
                              const updated = resumeData.skills.map((item) =>
                                item.id === skill.id
                                  ? { ...item, name: e.target.value }
                                  : item
                              )
                              updateSection('skills', updated)
                            }}
                            placeholder="Skill name"
                            className="flex-1 mr-2"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem('skills', skill.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                        <select
                          value={skill.level}
                          onChange={(e) => {
                            const updated = resumeData.skills.map((item) =>
                              item.id === skill.id
                                ? { ...item, level: e.target.value as Skill['level'] }
                                : item
                            )
                            updateSection('skills', updated)
                          }}
                          className="w-full px-3 py-2 rounded-md border border-input bg-background"
                        >
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                          <option value="expert">Expert</option>
                        </select>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Contact */}
          {activeSection === 'contact' && (
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={resumeData.contact.email || ''}
                      onChange={(e) =>
                        updateSection('contact', {
                          ...resumeData.contact,
                          email: e.target.value,
                        })
                      }
                      placeholder="your@email.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      type="tel"
                      value={resumeData.contact.phone || ''}
                      onChange={(e) =>
                        updateSection('contact', {
                          ...resumeData.contact,
                          phone: e.target.value,
                        })
                      }
                      placeholder="+880 1XXX-XXXXXX"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Website</Label>
                    <Input
                      type="url"
                      value={resumeData.contact.website || ''}
                      onChange={(e) =>
                        updateSection('contact', {
                          ...resumeData.contact,
                          website: e.target.value,
                        })
                      }
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>LinkedIn</Label>
                    <Input
                      type="url"
                      value={resumeData.contact.linkedin || ''}
                      onChange={(e) =>
                        updateSection('contact', {
                          ...resumeData.contact,
                          linkedin: e.target.value,
                        })
                      }
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>GitHub</Label>
                    <Input
                      type="url"
                      value={resumeData.contact.github || ''}
                      onChange={(e) =>
                        updateSection('contact', {
                          ...resumeData.contact,
                          github: e.target.value,
                        })
                      }
                      placeholder="https://github.com/username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Twitter</Label>
                    <Input
                      type="url"
                      value={resumeData.contact.twitter || ''}
                      onChange={(e) =>
                        updateSection('contact', {
                          ...resumeData.contact,
                          twitter: e.target.value,
                        })
                      }
                      placeholder="https://twitter.com/username"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
