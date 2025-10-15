import { createServerSupabaseClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface Props {
  params: { id: string }
}

export default async function TemplatePreviewPage({ params }: Props) {
  const supabase = createServerSupabaseClient()
  
  const { data: template } = await supabase
    .from('templates')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!template) {
    notFound()
  }

  // Sample data for preview
  const sampleData = {
    personalInfo: {
      fullName: 'John Doe',
      fullNameBn: 'জন ডো',
      profession: 'Software Developer',
      professionBn: 'সফটওয়্যার ডেভেলপার',
      location: 'Dhaka, Bangladesh',
    },
    experience: [
      {
        id: '1',
        company: 'Tech Company',
        position: 'Senior Developer',
        startDate: '2020-01-01',
        endDate: null,
        current: true,
        description: 'Leading development team and building scalable applications',
      },
    ],
    education: [
      {
        id: '1',
        institution: 'University of Dhaka',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        startDate: '2016-01-01',
        endDate: '2020-01-01',
        gpa: '3.8',
      },
    ],
    skills: [
      { id: '1', name: 'JavaScript', level: 'expert' as const },
      { id: '2', name: 'React', level: 'advanced' as const },
      { id: '3', name: 'Node.js', level: 'advanced' as const },
      { id: '4', name: 'TypeScript', level: 'intermediate' as const },
    ],
    contact: {
      email: 'john@example.com',
      phone: '+880 1XXX-XXXXXX',
      linkedin: 'https://linkedin.com/in/johndoe',
      github: 'https://github.com/johndoe',
    },
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="border-b bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/templates">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Templates
            </Button>
          </Link>
          <div className="text-center flex-1">
            <h1 className="text-xl font-semibold">{template.name}</h1>
            <p className="text-sm text-muted-foreground">Template Preview</p>
          </div>
          <Link href="/auth/signup">
            <Button>Use This Template</Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-12">
            {/* Template Preview */}
            <div className="prose max-w-none">
              <div className="text-center border-b-2 border-primary pb-6 mb-8">
                <h1 className="text-4xl font-bold text-primary mb-2">
                  {template.locale === 'bn' ? sampleData.personalInfo.fullNameBn : sampleData.personalInfo.fullName}
                </h1>
                <p className="text-xl text-muted-foreground">
                  {template.locale === 'bn' ? sampleData.personalInfo.professionBn : sampleData.personalInfo.profession}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  {sampleData.personalInfo.location} • {sampleData.contact.email} • {sampleData.contact.phone}
                </p>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-primary mb-4 border-b pb-2">
                  {template.locale === 'bn' ? 'কাজের অভিজ্ঞতা' : 'Work Experience'}
                </h2>
                {sampleData.experience.map((exp) => (
                  <div key={exp.id} className="mb-4 pl-4 border-l-2 border-primary">
                    <h3 className="text-lg font-semibold">{exp.position}</h3>
                    <p className="text-primary font-medium">{exp.company}</p>
                    <p className="text-sm text-muted-foreground">2020 - Present</p>
                    <p className="mt-2">{exp.description}</p>
                  </div>
                ))}
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-primary mb-4 border-b pb-2">
                  {template.locale === 'bn' ? 'শিক্ষাগত যোগ্যতা' : 'Education'}
                </h2>
                {sampleData.education.map((edu) => (
                  <div key={edu.id} className="mb-4 pl-4 border-l-2 border-primary">
                    <h3 className="text-lg font-semibold">{edu.degree} in {edu.field}</h3>
                    <p className="text-primary font-medium">{edu.institution}</p>
                    <p className="text-sm text-muted-foreground">2016 - 2020 • GPA: {edu.gpa}</p>
                  </div>
                ))}
              </div>

              <div>
                <h2 className="text-2xl font-bold text-primary mb-4 border-b pb-2">
                  {template.locale === 'bn' ? 'দক্ষতা' : 'Skills'}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {sampleData.skills.map((skill) => (
                    <span
                      key={skill.id}
                      className="px-4 py-2 bg-primary/10 text-primary rounded-full font-medium"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Template Info */}
          <div className="mt-8 text-center">
            <p className="text-muted-foreground mb-4">
              This is a preview with sample data. Create an account to customize it with your information.
            </p>
            <Link href="/auth/signup">
              <Button size="lg">Create Your Resume Now</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

