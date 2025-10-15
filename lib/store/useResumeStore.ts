import { create } from 'zustand'
import type { ProfileData } from '@/types/database'
import { generateId } from '@/lib/utils'

interface ResumeState {
  profileId: string | null
  resumeData: ProfileData
  isDirty: boolean
  setProfileId: (id: string | null) => void
  setResumeData: (data: ProfileData) => void
  updateSection: <K extends keyof ProfileData>(
    section: K,
    data: ProfileData[K]
  ) => void
  addItem: <K extends keyof ProfileData>(
    section: K,
    item: ProfileData[K] extends Array<infer T> ? T : never
  ) => void
  updateItem: <K extends keyof ProfileData>(
    section: K,
    id: string,
    data: Partial<ProfileData[K] extends Array<infer T> ? T : never>
  ) => void
  removeItem: <K extends keyof ProfileData>(
    section: K,
    id: string
  ) => void
  reorderItems: <K extends keyof ProfileData>(
    section: K,
    items: ProfileData[K]
  ) => void
  markClean: () => void
  reset: () => void
}

const defaultResumeData: ProfileData = {
  personalInfo: {},
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
  contact: {},
}

export const useResumeStore = create<ResumeState>((set, get) => ({
  profileId: null,
  resumeData: defaultResumeData,
  isDirty: false,

  setProfileId: (id) => set({ profileId: id }),

  setResumeData: (data) => set({ resumeData: data, isDirty: false }),

  updateSection: (section, data) =>
    set((state) => ({
      resumeData: { ...state.resumeData, [section]: data },
      isDirty: true,
    })),

  addItem: (section, item) =>
    set((state) => {
      const currentSection = state.resumeData[section]
      if (!Array.isArray(currentSection)) return state

      const newItem = { ...item, id: item.id || generateId() }
      return {
        resumeData: {
          ...state.resumeData,
          [section]: [...currentSection, newItem],
        },
        isDirty: true,
      }
    }),

  updateItem: (section, id, data) =>
    set((state) => {
      const currentSection = state.resumeData[section]
      if (!Array.isArray(currentSection)) return state

      return {
        resumeData: {
          ...state.resumeData,
          [section]: currentSection.map((item: any) =>
            item.id === id ? { ...item, ...data } : item
          ),
        },
        isDirty: true,
      }
    }),

  removeItem: (section, id) =>
    set((state) => {
      const currentSection = state.resumeData[section]
      if (!Array.isArray(currentSection)) return state

      return {
        resumeData: {
          ...state.resumeData,
          [section]: currentSection.filter((item: any) => item.id !== id),
        },
        isDirty: true,
      }
    }),

  reorderItems: (section, items) =>
    set((state) => ({
      resumeData: { ...state.resumeData, [section]: items },
      isDirty: true,
    })),

  markClean: () => set({ isDirty: false }),

  reset: () => set({ profileId: null, resumeData: defaultResumeData, isDirty: false }),
}))

