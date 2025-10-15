'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { useSupabase } from '@/components/providers/SupabaseProvider'
import { Plus, Loader2, Edit, Trash2, ExternalLink, Upload } from 'lucide-react'
import type { Database } from '@/types/database'

type Profile = Database['public']['Tables']['profiles']['Row']
type PortfolioItem = Database['public']['Tables']['portfolio_items']['Row']

export default function PortfolioPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const { supabase } = useSupabase()
  
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null)
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null)
  const [showForm, setShowForm] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    project_url: '',
    tech_stack: [] as string[],
  })

  useEffect(() => {
    if (user) {
      loadProfiles()
    }
  }, [user])

  useEffect(() => {
    if (selectedProfileId) {
      loadPortfolioItems()
    }
  }, [selectedProfileId])

  const loadProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      setProfiles(data || [])
      if (data && data.length > 0) {
        setSelectedProfileId(data[0].id)
      }
    } catch (error) {
      console.error('Error loading profiles:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadPortfolioItems = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolio_items')
        .select('*')
        .eq('profile_id', selectedProfileId!)
        .order('sort_order', { ascending: true })

      if (error) throw error

      setPortfolioItems(data || [])
    } catch (error) {
      console.error('Error loading portfolio items:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingItem) {
        // Update existing item
        const { error } = await supabase
          .from('portfolio_items')
          .update({
            title: formData.title,
            description: formData.description,
            image_url: formData.image_url,
            project_url: formData.project_url,
            tech_stack: formData.tech_stack,
          })
          .eq('id', editingItem.id)

        if (error) throw error
      } else {
        // Create new item
        const { error } = await supabase
          .from('portfolio_items')
          .insert({
            profile_id: selectedProfileId!,
            title: formData.title,
            description: formData.description,
            image_url: formData.image_url,
            project_url: formData.project_url,
            tech_stack: formData.tech_stack,
            sort_order: portfolioItems.length,
          })

        if (error) throw error
      }

      // Reset form
      setFormData({
        title: '',
        description: '',
        image_url: '',
        project_url: '',
        tech_stack: [],
      })
      setEditingItem(null)
      setShowForm(false)
      loadPortfolioItems()
    } catch (error) {
      console.error('Error saving portfolio item:', error)
      alert('Failed to save portfolio item')
    }
  }

  const handleEdit = (item: PortfolioItem) => {
    setEditingItem(item)
    setFormData({
      title: item.title,
      description: item.description || '',
      image_url: item.image_url || '',
      project_url: item.project_url || '',
      tech_stack: item.tech_stack,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this portfolio item?')) return

    try {
      const { error } = await supabase
        .from('portfolio_items')
        .delete()
        .eq('id', id)

      if (error) throw error

      loadPortfolioItems()
    } catch (error) {
      console.error('Error deleting portfolio item:', error)
    }
  }

  const handleAddTech = (tech: string) => {
    if (tech && !formData.tech_stack.includes(tech)) {
      setFormData((prev) => ({
        ...prev,
        tech_stack: [...prev.tech_stack, tech],
      }))
    }
  }

  const handleRemoveTech = (tech: string) => {
    setFormData((prev) => ({
      ...prev,
      tech_stack: prev.tech_stack.filter((t) => t !== tech),
    }))
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Portfolio Items</h1>
          <p className="text-muted-foreground">
            Showcase your projects and work in your public profile
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Portfolio Item
        </Button>
      </div>

      {/* Profile Selector */}
      {profiles.length > 1 && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <Label>Select Profile</Label>
            <select
              value={selectedProfileId || ''}
              onChange={(e) => setSelectedProfileId(e.target.value)}
              className="w-full mt-2 px-3 py-2 rounded-md border border-input bg-background"
            >
              {profiles.map((profile) => (
                <option key={profile.id} value={profile.id}>
                  {profile.title || 'Untitled Resume'}
                </option>
              ))}
            </select>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              {editingItem ? 'Edit Portfolio Item' : 'Add Portfolio Item'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  required
                  placeholder="My Awesome Project"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  className="w-full min-h-[100px] px-3 py-2 rounded-md border border-input bg-background"
                  placeholder="Describe your project..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  type="url"
                  value={formData.image_url}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, image_url: e.target.value }))
                  }
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="project_url">Project URL</Label>
                <Input
                  id="project_url"
                  type="url"
                  value={formData.project_url}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, project_url: e.target.value }))
                  }
                  placeholder="https://example.com"
                />
              </div>

              <div className="space-y-2">
                <Label>Technologies</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add technology (e.g., React, Node.js)"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddTech(e.currentTarget.value)
                        e.currentTarget.value = ''
                      }
                    }}
                  />
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tech_stack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center gap-2"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => handleRemoveTech(tech)}
                        className="hover:text-destructive"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  {editingItem ? 'Update' : 'Add'} Portfolio Item
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false)
                    setEditingItem(null)
                    setFormData({
                      title: '',
                      description: '',
                      image_url: '',
                      project_url: '',
                      tech_stack: [],
                    })
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Portfolio Items List */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Portfolio Items</h2>
        
        {portfolioItems.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Upload className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Portfolio Items</h3>
              <p className="text-muted-foreground mb-6 text-center max-w-md">
                Start showcasing your work by adding your first portfolio item
              </p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Portfolio Item
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioItems.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition">
                {item.image_url && (
                  <div className="aspect-video bg-gray-100 dark:bg-gray-800 overflow-hidden rounded-t-lg">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="line-clamp-1">{item.title}</CardTitle>
                  {item.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  {item.tech_stack.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {item.tech_stack.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 bg-primary/10 text-primary rounded text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(item)}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    {item.project_url && (
                      <a
                        href={item.project_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </a>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
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

