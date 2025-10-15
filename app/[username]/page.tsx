import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, Phone, Globe, Linkedin, Github, Twitter, MapPin, Calendar, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import type { Database } from '@/types/database'
import { formatDateRange } from '@/lib/utils'

type UserProfile = Database['public']['Tables']['users']['Row']
type Profile = Database['public']['Tables']['profiles']['Row']

interface Props {
  params: { username: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createServerSupabaseClient()
  
  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('username', params.username)
    .eq('is_public', true)
    .single()

  if (!user) {
    return {
      title: 'Profile Not Found',
    }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_public', true)
    .single()

  return {
    title: `${user.name} - Porichoy`,
    description: profile?.summary || `Professional resume of ${user.name}`,
    openGraph: {
      title: `${user.name} - ${profile?.title || 'Professional Resume'}`,
      description: profile?.summary || `View ${user.name}'s professional resume and portfolio`,
      type: 'profile',
      images: user.avatar_url ? [user.avatar_url] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${user.name} - ${profile?.title || 'Professional Resume'}`,
      description: profile?.summary || `View ${user.name}'s professional resume`,
    },
  }
}

export default async function PublicProfilePage({ params }: Props) {
  const supabase = createServerSupabaseClient()
  
  // Fetch user
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('username', params.username)
    .eq('is_public', true)
    .single()

  if (userError || !user) {
    notFound()
  }

  // Fetch profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_public', true)
    .single()

  if (profileError || !profile) {
    notFound()
  }

  // Increment view count
  await supabase.rpc('increment_profile_views', { profile_uuid: profile.id })

  // Track view
  await supabase.from('profile_views').insert({
    profile_id: profile.id,
    viewer_ip: null, // Would need to get from headers in real implementation
    viewer_country: null,
    user_agent: null,
  })

  const data = profile.data
  const isBangla = user.locale === 'bn'

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="border-b bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-primary font-semibold hover:underline">
              ← Back to Porichoy
            </Link>
            <Button asChild>
              <Link href="/api/export/pdf?profile_id=${profile.id}">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Personal Info Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {user.avatar_url && (
              <img
                src={user.avatar_url}
                alt={user.name}
                className="w-24 h-24 rounded-full object-cover"
              />
            )}
            <div className="flex-1">
              <h1 className={`text-4xl font-bold mb-2 ${isBangla ? 'font-bengali' : ''}`}>
                {isBangla && data.personalInfo.fullNameBn
                  ? data.personalInfo.fullNameBn
                  : data.personalInfo.fullName || user.name}
              </h1>
              {(data.personalInfo.profession || data.personalInfo.professionBn) && (
                <p className={`text-xl text-primary mb-4 ${isBangla ? 'font-bengali' : ''}`}>
                  {isBangla && data.personalInfo.professionBn
                    ? data.personalInfo.professionBn
                    : data.personalInfo.profession}
                </p>
              )}
              {profile.summary && (
                <p className={`text-muted-foreground ${isBangla ? 'font-bengali' : ''}`}>
                  {profile.summary}
                </p>
              )}
              
              {/* Contact Icons */}
              <div className="flex flex-wrap gap-3 mt-4">
                {data.contact.email && (
                  <a
                    href={`mailto:${data.contact.email}`}
                    className="flex items-center gap-2 text-sm hover:text-primary transition"
                  >
                    <Mail className="h-4 w-4" />
                    {data.contact.email}
                  </a>
                )}
                {data.contact.phone && (
                  <a
                    href={`tel:${data.contact.phone}`}
                    className="flex items-center gap-2 text-sm hover:text-primary transition"
                  >
                    <Phone className="h-4 w-4" />
                    {data.contact.phone}
                  </a>
                )}
                {data.personalInfo.location && (
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {data.personalInfo.location}
                  </span>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2 mt-3">
                {data.contact.linkedin && (
                  <a
                    href={data.contact.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                )}
                {data.contact.github && (
                  <a
                    href={data.contact.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                )}
                {data.contact.twitter && (
                  <a
                    href={data.contact.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition"
                  >
                    <Twitter className="h-4 w-4" />
                  </a>
                )}
                {data.contact.website && (
                  <a
                    href={data.contact.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition"
                  >
                    <Globe className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className={isBangla ? 'font-bengali' : ''}>
                {isBangla ? 'কাজের অভিজ্ঞতা' : 'Work Experience'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {data.experience.map((exp) => (
                <div key={exp.id} className="border-l-2 border-primary pl-4">
                  <h3 className={`font-semibold text-lg ${isBangla ? 'font-bengali' : ''}`}>
                    {isBangla && exp.positionBn ? exp.positionBn : exp.position}
                  </h3>
                  <p className={`text-primary ${isBangla ? 'font-bengali' : ''}`}>
                    {isBangla && exp.companyBn ? exp.companyBn : exp.company}
                  </p>
                  <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                    <Calendar className="h-3 w-3" />
                    {formatDateRange(exp.startDate, exp.endDate, user.locale, isBangla ? 'বর্তমান' : 'Present')}
                  </p>
                  {exp.description && (
                    <p className={`mt-2 text-muted-foreground ${isBangla ? 'font-bengali' : ''}`}>
                      {isBangla && exp.descriptionBn ? exp.descriptionBn : exp.description}
                    </p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className={isBangla ? 'font-bengali' : ''}>
                {isBangla ? 'শিক্ষাগত যোগ্যতা' : 'Education'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {data.education.map((edu) => (
                <div key={edu.id} className="border-l-2 border-primary pl-4">
                  <h3 className={`font-semibold text-lg ${isBangla ? 'font-bengali' : ''}`}>
                    {isBangla && edu.degreeBn ? edu.degreeBn : edu.degree}
                  </h3>
                  <p className={`text-primary ${isBangla ? 'font-bengali' : ''}`}>
                    {isBangla && edu.institutionBn ? edu.institutionBn : edu.institution}
                  </p>
                  <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                    <Calendar className="h-3 w-3" />
                    {formatDateRange(edu.startDate, edu.endDate, user.locale)}
                  </p>
                  {edu.gpa && (
                    <p className="text-sm mt-1">
                      GPA: <span className="font-semibold">{edu.gpa}</span>
                    </p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className={isBangla ? 'font-bengali' : ''}>
                {isBangla ? 'দক্ষতা' : 'Skills'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill) => (
                  <span
                    key={skill.id}
                    className={`px-3 py-1 bg-primary/10 text-primary rounded-full text-sm ${
                      isBangla ? 'font-bengali' : ''
                    }`}
                  >
                    {isBangla && skill.nameBn ? skill.nameBn : skill.name}
                    {skill.level && (
                      <span className="ml-2 opacity-75">
                        {skill.level === 'expert' && '★★★★'}
                        {skill.level === 'advanced' && '★★★'}
                        {skill.level === 'intermediate' && '★★'}
                        {skill.level === 'beginner' && '★'}
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className={isBangla ? 'font-bengali' : ''}>
                {isBangla ? 'প্রজেক্ট' : 'Projects'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.projects.map((project) => (
                <div key={project.id} className="border rounded-lg p-4">
                  <h3 className={`font-semibold text-lg ${isBangla ? 'font-bengali' : ''}`}>
                    {isBangla && project.nameBn ? project.nameBn : project.name}
                  </h3>
                  {project.description && (
                    <p className={`text-muted-foreground mt-2 ${isBangla ? 'font-bengali' : ''}`}>
                      {isBangla && project.descriptionBn ? project.descriptionBn : project.description}
                    </p>
                  )}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {project.technologies.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  {(project.url || project.githubUrl) && (
                    <div className="flex gap-3 mt-3">
                      {project.url && (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline flex items-center gap-1"
                        >
                          <Globe className="h-3 w-3" />
                          View Project
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline flex items-center gap-1"
                        >
                          <Github className="h-3 w-3" />
                          GitHub
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Languages */}
        {data.languages && data.languages.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className={isBangla ? 'font-bengali' : ''}>
                {isBangla ? 'ভাষা' : 'Languages'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {data.languages.map((lang) => (
                  <div key={lang.id} className="flex items-center justify-between">
                    <span className={isBangla ? 'font-bengali' : ''}>
                      {isBangla && lang.nameBn ? lang.nameBn : lang.name}
                    </span>
                    <span className="text-sm text-muted-foreground capitalize">
                      {lang.proficiency}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t mt-12 py-6 text-center text-sm text-muted-foreground">
        <p>
          Created with{' '}
          <Link href="/" className="text-primary hover:underline">
            Porichoy <span className="font-bengali">(পরিচয়)</span>
          </Link>
        </p>
      </footer>
    </div>
  )
}

