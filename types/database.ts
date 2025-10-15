export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          username: string
          name: string
          email: string
          avatar_url: string | null
          locale: 'bn' | 'en'
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          name: string
          email: string
          avatar_url?: string | null
          locale?: 'bn' | 'en'
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          name?: string
          email?: string
          avatar_url?: string | null
          locale?: 'bn' | 'en'
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          user_id: string
          title: string | null
          summary: string | null
          data: ProfileData
          template_id: string | null
          is_public: boolean
          views_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title?: string | null
          summary?: string | null
          data?: ProfileData
          template_id?: string | null
          is_public?: boolean
          views_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string | null
          summary?: string | null
          data?: ProfileData
          template_id?: string | null
          is_public?: boolean
          views_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      templates: {
        Row: {
          id: string
          name: string
          category: string
          html_template: string
          css_styles: string
          preview_image: string | null
          locale: 'bn' | 'en' | 'dual'
          is_official: boolean
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          category?: string
          html_template: string
          css_styles: string
          preview_image?: string | null
          locale?: 'bn' | 'en' | 'dual'
          is_official?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string
          html_template?: string
          css_styles?: string
          preview_image?: string | null
          locale?: 'bn' | 'en' | 'dual'
          is_official?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      portfolio_items: {
        Row: {
          id: string
          profile_id: string
          title: string
          description: string | null
          image_url: string | null
          project_url: string | null
          tech_stack: string[]
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          title: string
          description?: string | null
          image_url?: string | null
          project_url?: string | null
          tech_stack?: string[]
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          title?: string
          description?: string | null
          image_url?: string | null
          project_url?: string | null
          tech_stack?: string[]
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      exports: {
        Row: {
          id: string
          profile_id: string
          file_url: string
          type: 'pdf' | 'html'
          status: 'pending' | 'processing' | 'success' | 'failed'
          error_message: string | null
          created_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          file_url: string
          type: 'pdf' | 'html'
          status?: 'pending' | 'processing' | 'success' | 'failed'
          error_message?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          file_url?: string
          type?: 'pdf' | 'html'
          status?: 'pending' | 'processing' | 'success' | 'failed'
          error_message?: string | null
          created_at?: string
        }
      }
      profile_views: {
        Row: {
          id: string
          profile_id: string
          viewer_ip: string | null
          viewer_country: string | null
          user_agent: string | null
          viewed_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          viewer_ip?: string | null
          viewer_country?: string | null
          user_agent?: string | null
          viewed_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          viewer_ip?: string | null
          viewer_country?: string | null
          user_agent?: string | null
          viewed_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_profile_views: {
        Args: { profile_uuid: string }
        Returns: void
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Custom types for profile data structure
export interface ProfileData {
  personalInfo: PersonalInfo
  experience: Experience[]
  education: Education[]
  skills: Skill[]
  projects: Project[]
  certifications: Certification[]
  languages: Language[]
  contact: ContactInfo
}

export interface PersonalInfo {
  fullName?: string
  fullNameBn?: string
  profession?: string
  professionBn?: string
  location?: string
  locationBn?: string
  dateOfBirth?: string
  nationality?: string
  nationalityBn?: string
}

export interface Experience {
  id: string
  company: string
  companyBn?: string
  position: string
  positionBn?: string
  startDate: string
  endDate?: string | null
  current?: boolean
  description: string
  descriptionBn?: string
  location?: string
  achievements?: string[]
}

export interface Education {
  id: string
  institution: string
  institutionBn?: string
  degree: string
  degreeBn?: string
  field: string
  fieldBn?: string
  startDate: string
  endDate?: string | null
  gpa?: string
  description?: string
  descriptionBn?: string
}

export interface Skill {
  id: string
  name: string
  nameBn?: string
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  category?: string
}

export interface Project {
  id: string
  name: string
  nameBn?: string
  description: string
  descriptionBn?: string
  role?: string
  technologies?: string[]
  startDate?: string
  endDate?: string | null
  url?: string
  githubUrl?: string
}

export interface Certification {
  id: string
  name: string
  nameBn?: string
  issuer: string
  issuerBn?: string
  issueDate: string
  expiryDate?: string | null
  credentialId?: string
  credentialUrl?: string
}

export interface Language {
  id: string
  name: string
  nameBn?: string
  proficiency: 'basic' | 'conversational' | 'fluent' | 'native'
}

export interface ContactInfo {
  phone?: string
  email?: string
  website?: string
  linkedin?: string
  github?: string
  twitter?: string
  facebook?: string
  address?: string
  addressBn?: string
}

