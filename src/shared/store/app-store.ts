import { create } from 'zustand'

export interface AppState {
  // Data
  casinos: any[]
  sports: any[]
  categories: any[]
  categorySports: any[]
  locations: any[]
  sportTypes: any[]
  
  // UI State
  loading: boolean
  error: string | null
  
  // Filters
  selectedCategory: string | null
  selectedLocation: string | null
  selectedSportType: string | null
  
  // Actions
  setCasinos: (casinos: any[]) => void
  setSports: (sports: any[]) => void
  setCategories: (categories: any[]) => void
  setCategorySports: (categorySports: any[]) => void
  setLocations: (locations: any[]) => void
  setSportTypes: (sportTypes: any[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setSelectedCategory: (category: string | null) => void
  setSelectedLocation: (location: string | null) => void
  setSelectedSportType: (sportType: string | null) => void
  clearFilters: () => void
}

export const useAppStore = create<AppState>((set) => ({
  // Initial state
  casinos: [],
  sports: [],
  categories: [],
  categorySports: [],
  locations: [],
  sportTypes: [],
  loading: false,
  error: null,
  selectedCategory: null,
  selectedLocation: null,
  selectedSportType: null,
  
  // Actions
  setCasinos: (casinos) => set({ casinos }),
  setSports: (sports) => set({ sports }),
  setCategories: (categories) => set({ categories }),
  setCategorySports: (categorySports) => set({ categorySports }),
  setLocations: (locations) => set({ locations }),
  setSportTypes: (sportTypes) => set({ sportTypes }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  setSelectedLocation: (selectedLocation) => set({ selectedLocation }),
  setSelectedSportType: (selectedSportType) => set({ selectedSportType }),
  clearFilters: () => set({ 
    selectedCategory: null, 
    selectedLocation: null, 
    selectedSportType: null 
  }),
}))
