import React from 'react'
import { useQuery } from '@apollo/client/react'
import { GET_SPORTS, GET_SPORT_STORIES } from '@/shared/lib/graphql/queries'
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
  allSports?: Sport[];
  allSportStories?: Sport[];
}

export function useSports() {
  const { setSports, setLoading, setError, selectedSportType, selectedCategory, selectedLocation, selectedFormat } = useAppStore()
  
  const shouldSkip =
    !selectedFormat ||
    selectedSportType.length === 0 ||
    selectedCategory.length === 0 ||
    !selectedLocation

  const sportsQuery = selectedFormat === 'stories' ? GET_SPORT_STORIES : GET_SPORTS;
  
  const { data, loading, error, refetch } = useQuery<GetSportsResponse>(sportsQuery, {
    skip: shouldSkip,
    variables: {
      sportType: selectedSportType.length > 0 ? selectedSportType : undefined,
      categorySport: selectedCategory.length > 0 ? selectedCategory : undefined,
      location: selectedLocation || undefined,
      first: 500
    },
    errorPolicy: 'all',
    fetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: false
  })

  const items = React.useMemo(() => data?.allSportStories ?? data?.allSports ?? [], [data]);

  React.useEffect(() => {
    if (shouldSkip) {
      setLoading(false)
      setSports([])
      setError(null)
    } else {
      setLoading(loading)
    }
  }, [loading, setLoading, setSports, setError, shouldSkip])

  React.useEffect(() => {
    if (data && !shouldSkip) {
      setSports(items)
    }
  }, [data, setSports, shouldSkip, items])

  React.useEffect(() => {
    if (error && !shouldSkip) {
      setError(error.message)
      handleGraphQLError(error, 'Sports')
    }
  }, [error, setError, shouldSkip])

  return {
    sports: shouldSkip ? [] : items,
    loading: shouldSkip ? false : loading,
    error,
    refetch,
  }
}
