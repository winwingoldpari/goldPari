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
  
  const { data, loading, error, refetch } = useQuery<GetSportsResponse>(GET_SPORTS, {
    variables: {
      ...(selectedSportType && { sportType: selectedSportType }),
      ...(selectedCategory && { categorySport: selectedCategory }),
      ...(selectedLocation && { location: selectedLocation }),
      first: 500
    }
  })

  React.useEffect(() => {
    setLoading(loading)
  }, [loading, setLoading])

  React.useEffect(() => {
    if (data) {
      setSports(data.allSports || [])
    }
  }, [data, setSports])

  React.useEffect(() => {
    if (error) {
      setError(error.message)
      handleGraphQLError(error, 'Sports')
    }
  }, [error, setError])

  return {
    sports: data?.allSports || [],
    loading,
    error,
    refetch,
  }
}
