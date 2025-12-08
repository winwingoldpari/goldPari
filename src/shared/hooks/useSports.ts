import React from 'react'
import { useQuery } from '@apollo/client/react'
import { GET_SPORTS } from '@/shared/lib/graphql/queries'
import { useAppStore } from '@/shared/store'
import { handleGraphQLError } from '@/shared/lib/toast'

interface Sport {
  id: string;
  title: string;
  description?: string;
  image?: {
    url: string;
    alt?: string;
    responsiveImage?: {
      width: number;
      height: number;
    };
  };
  category?: {
    id: string;
    title: string;
  };
  date?: string;
  link?: string;
  sportType?: {
    id: string;
    title: string;
  };
  loc?: {
    id: string;
    title: string;
  };
}

interface GetSportsResponse {
  allSports: Sport[];
}

export function useSports() {
  const { setSports, setLoading, setError, selectedSportType, selectedCategory, selectedLocation } = useAppStore()
  
  const shouldSkip = !selectedSportType || !selectedCategory || !selectedLocation
  
  const { data, loading, error, refetch } = useQuery<GetSportsResponse>(GET_SPORTS, {
    skip: shouldSkip,
    variables: {
      ...(selectedSportType && { sportType: selectedSportType }),
      ...(selectedCategory && { categorySport: selectedCategory }),
      ...(selectedLocation && { location: selectedLocation }),
      first: 500
    },
    errorPolicy: 'all',
    fetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: false
  })

  React.useEffect(() => {
    if (shouldSkip) {
      setLoading(false)
      setSports([])
    } else {
      setLoading(loading)
    }
  }, [loading, setLoading, setSports, shouldSkip])

  React.useEffect(() => {
    if (data && !shouldSkip) {
      setSports(data.allSports || [])
    }
  }, [data, setSports, shouldSkip])

  React.useEffect(() => {
    if (error && !shouldSkip) {
      setError(error.message)
      handleGraphQLError(error, 'Sports')
    }
  }, [error, setError, shouldSkip])

  return {
    sports: shouldSkip ? [] : (data?.allSports || []),
    loading: shouldSkip ? false : loading,
    error,
    refetch,
  }
}
