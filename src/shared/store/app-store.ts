import { create } from 'zustand'
import type { UploadDate } from '@/shared/lib/upload-date'
import type { EventCopiesMap } from '@/shared/lib/event-i18n'

export interface BannerEntry {
  id: string
  title?: string | null
  _publishedAt?: string | null
  image?: {
    url: string
    alt?: string | null
    responsiveImage?: { width: number; height: number } | null
  } | null
}

export interface FilterEntry {
  id: string
  title?: string | null
}

export interface MobcashEntry {
  code: string
  city: string
  street: string
}

export interface AppState {
  // Data
  casinos: BannerEntry[]
  sports: BannerEntry[]
  universals: BannerEntry[]
  categories: FilterEntry[]
  categorySports: FilterEntry[]
  locations: FilterEntry[]
  sportTypes: FilterEntry[]
  creativeFormats: FilterEntry[]
  universalCategories: FilterEntry[]
  casinoTypes: FilterEntry[]
  mobcashEntries: MobcashEntry[]
  mobcashLoaded: boolean
  mobcashError: string | null
  eventCopies: EventCopiesMap
  eventCopiesLoaded: boolean
  eventCopiesError: string | null

  // UI State
  loading: boolean
  error: string | null

  // Filters
  selectedCategory: string[] | null
  selectedCategorySport: string[] | null
  selectedLocation: string | null
  selectedSportType: string[] | null
  selectedCreativeFormat: string[] | null
  selectedUniversalCategory: string[] | null
  selectedCasinoType: string[] | null
  selectedFormat: string | null
  selectedUploadDate: UploadDate | null
  selectedLanguage: string | null

  // Actions
  setCasinos: (casinos: BannerEntry[]) => void
  setSports: (sports: BannerEntry[]) => void
  setUniversals: (universals: BannerEntry[]) => void
  setCategories: (categories: FilterEntry[]) => void
  setCategorySports: (categorySports: FilterEntry[]) => void
  setLocations: (locations: FilterEntry[]) => void
  setSportTypes: (sportTypes: FilterEntry[]) => void
  setCreativeFormats: (creativeFormats: FilterEntry[]) => void
  setUniversalCategories: (universalCategories: FilterEntry[]) => void
  setCasinoTypes: (casinoTypes: FilterEntry[]) => void
  setMobcashEntries: (entries: MobcashEntry[]) => void
  setMobcashLoaded: (loaded: boolean) => void
  setMobcashError: (error: string | null) => void
  setEventCopies: (entries: EventCopiesMap) => void
  setEventCopiesLoaded: (loaded: boolean) => void
  setEventCopiesError: (error: string | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setSelectedCategory: (category: string[] | null) => void
  setSelectedCategorySport: (categorySport: string[] | null) => void
  setSelectedLocation: (location: string | null) => void
  setSelectedSportType: (sportType: string[] | null) => void
  setSelectedCreativeFormat: (creativeFormat: string[] | null) => void
  setSelectedUniversalCategory: (universalCategory: string[] | null) => void
  setSelectedCasinoType: (casinoType: string[] | null) => void
  setSelectedFormat: (format: string | null) => void
  setSelectedUploadDate: (uploadDate: UploadDate | null) => void
  setSelectedLanguage: (language: string | null) => void
  clearFilters: () => void
}

export const useAppStore = create<AppState>((set) => ({
  // Initial state
  casinos: [],
  sports: [],
  universals: [],
  categories: [],
  categorySports: [],
  locations: [],
  sportTypes: [],
  creativeFormats: [],
  universalCategories: [],
  casinoTypes: [],
  mobcashEntries: [],
  mobcashLoaded: false,
  mobcashError: null,
  eventCopies: {},
  eventCopiesLoaded: false,
  eventCopiesError: null,
  loading: false,
  error: null,
  selectedCategory: null,
  selectedCategorySport: null,
  selectedLocation: null,
  selectedSportType: null,
  selectedCreativeFormat: null,
  selectedUniversalCategory: null,
  selectedCasinoType: null,
  selectedFormat: null,
  selectedUploadDate: null,
  selectedLanguage: null,

  // Actions
  setCasinos: (casinos) => set({ casinos }),
  setSports: (sports) => set({ sports }),
  setUniversals: (universals) => set({ universals }),
  setCategories: (categories) => set({ categories }),
  setCategorySports: (categorySports) => set({ categorySports }),
  setLocations: (locations) => set({ locations }),
  setSportTypes: (sportTypes) => set({ sportTypes }),
  setCreativeFormats: (creativeFormats) => set({ creativeFormats }),
  setUniversalCategories: (universalCategories) => set({ universalCategories }),
  setCasinoTypes: (casinoTypes) => set({ casinoTypes }),
  setMobcashEntries: (mobcashEntries) => set({ mobcashEntries }),
  setMobcashLoaded: (mobcashLoaded) => set({ mobcashLoaded }),
  setMobcashError: (mobcashError) => set({ mobcashError }),
  setEventCopies: (eventCopies) => set({ eventCopies }),
  setEventCopiesLoaded: (eventCopiesLoaded) => set({ eventCopiesLoaded }),
  setEventCopiesError: (eventCopiesError) => set({ eventCopiesError }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  setSelectedCategorySport: (selectedCategorySport) => set({ selectedCategorySport }),
  setSelectedLocation: (selectedLocation) => set({ selectedLocation }),
  setSelectedSportType: (selectedSportType) => set({ selectedSportType }),
  setSelectedCreativeFormat: (selectedCreativeFormat) => set({ selectedCreativeFormat }),
  setSelectedUniversalCategory: (selectedUniversalCategory) => set({ selectedUniversalCategory }),
  setSelectedCasinoType: (selectedCasinoType) => set({ selectedCasinoType }),
  setSelectedFormat: (selectedFormat) => set({ selectedFormat }),
  setSelectedUploadDate: (selectedUploadDate) => set({ selectedUploadDate }),
  setSelectedLanguage: (selectedLanguage) => set({ selectedLanguage }),
  clearFilters: () => set({
    selectedCategory: null,
    selectedCategorySport: null,
    selectedLocation: null,
    selectedSportType: null,
    selectedCreativeFormat: null,
    selectedUniversalCategory: null,
    selectedCasinoType: null,
    selectedFormat: null,
    selectedUploadDate: null,
    selectedLanguage: null,
  }),
}))
