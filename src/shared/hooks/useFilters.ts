import { useEffect } from 'react'
import { useQuery } from '@apollo/client/react'
import { GET_FILTERS } from '@/shared/lib/graphql/queries'
import { handleGraphQLError } from '@/shared/lib/toast'
import { useAppStore } from '../store';

export function useFilters() {
  const {
    setCategories,
    setCategorySports,
    setLocations,
    setSportTypes,
    setCreativeFormats,
    setUniversalCategories,
    setCasinoTypes,
    setError,
    categories,
    categorySports,
    locations,
    sportTypes,
    creativeFormats,
    universalCategories,
    casinoTypes,
    selectedCategory,
    selectedCategorySport,
    selectedLocation,
    selectedSportType,
    selectedCreativeFormat,
    selectedUniversalCategory,
    selectedCasinoType,
    selectedFormat,
    selectedUploadDate,
    selectedLanguage,
    setSelectedCategory,
    setSelectedCategorySport,
    setSelectedLocation,
    setSelectedSportType,
    setSelectedCreativeFormat,
    setSelectedUniversalCategory,
    setSelectedCasinoType,
    setSelectedFormat,
    setSelectedUploadDate,
    setSelectedLanguage,
    clearFilters
  } = useAppStore()

  const { data, loading, error, refetch } = useQuery(GET_FILTERS)

  useEffect(() => {
    if (data) {
      setCategories(data.allCategories ?? [])
      setCategorySports(data.allCategorySports ?? [])
      setLocations(data.allLocations ?? [])
      setSportTypes(data.allSportTypes ?? [])
      setCreativeFormats(data.allCreativeFormats ?? [])
      setUniversalCategories(data.allUniversalCategories ?? [])
      setCasinoTypes(data.allCasinoTypes ?? [])
    }
  }, [data, setCategories, setCategorySports, setLocations, setSportTypes, setCreativeFormats, setUniversalCategories, setCasinoTypes])

  useEffect(() => {
    if (error) {
      setError(error.message)
      handleGraphQLError(error, 'Filters')
    }
  }, [error, setError])

  return {
    categories,
    categorySports,
    locations,
    sportTypes,
    creativeFormats,
    universalCategories,
    casinoTypes,
    selectedCategory,
    selectedCategorySport,
    selectedLocation,
    selectedSportType,
    selectedCreativeFormat,
    selectedUniversalCategory,
    selectedCasinoType,
    selectedFormat,
    selectedUploadDate,
    selectedLanguage,
    setSelectedCategory,
    setSelectedCategorySport,
    setSelectedLocation,
    setSelectedSportType,
    setSelectedCreativeFormat,
    setSelectedUniversalCategory,
    setSelectedCasinoType,
    setSelectedFormat,
    setSelectedUploadDate,
    setSelectedLanguage,
    clearFilters,
    loading,
    error,
    refetch,
  }
}
