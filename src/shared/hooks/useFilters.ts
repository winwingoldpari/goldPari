import React from 'react'
import { useQuery } from '@apollo/client/react'
import { GET_FILTERS } from '@/shared/lib/graphql/queries'
import { handleGraphQLError } from '@/shared/lib/toast'
import { useAppStore } from '../store';

interface FilterItem {
  id: string;
  title: string;
}

interface GetFiltersResponse {
  allCategories: FilterItem[];
  allCategorySports: FilterItem[];
  allLocations: FilterItem[];
  allSportTypes: FilterItem[];
}

export function useFilters() {
  const { 
    setCategories,
    setCategorySports, 
    setLocations, 
    setSportTypes, 
    setLoading, 
    setError,
    categories,
    categorySports,
    locations,
    sportTypes,
    selectedCategory,
    selectedLocation,
    selectedSportType,
    setSelectedCategory,
    setSelectedLocation,
    setSelectedSportType,
    clearFilters
  } = useAppStore()
  
  const { data, loading, error, refetch } = useQuery<GetFiltersResponse>(GET_FILTERS)

  React.useEffect(() => {
    setLoading(loading)
  }, [loading, setLoading])

  React.useEffect(() => {
    if (data) {
      setCategories(data.allCategories || [])
      setCategorySports(data.allCategorySports || [])
      setLocations(data.allLocations || [])
      setSportTypes(data.allSportTypes || [])
    }
  }, [data, setCategories, setCategorySports, setLocations, setSportTypes])

  React.useEffect(() => {
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
    selectedCategory,
    selectedLocation,
    selectedSportType,
    setSelectedCategory,
    setSelectedLocation,
    setSelectedSportType,
    clearFilters,
    loading,
    error,
    refetch,
  }
}
