import React from 'react'
import { useQuery } from '@apollo/client/react'
import { GET_CASINOS, GET_CASINO_STORIES } from '@/shared/lib/graphql/queries'
import { useAppStore } from '@/shared/store'
import { handleGraphQLError } from '@/shared/lib/toast'

interface Casino {
  id: string;
  title: string;
  image?: {
    url: string;
    alt?: string;
    responsiveImage?: {
      width: number;
      height: number;
    };
  };
}

interface GetCasinosResponse {
  allCasinos?: Casino[];
  allCasinoStories?: Casino[];
}

export function useCasinos() {
  const { setCasinos, setLoading, setError, selectedCategory, selectedLocation, selectedFormat } = useAppStore()
  
  const shouldSkip = !selectedFormat || selectedCategory.length === 0 || !selectedLocation

  const casinosQuery = selectedFormat === 'stories' ? GET_CASINO_STORIES : GET_CASINOS;
  
  const { data, loading, error, refetch } = useQuery<GetCasinosResponse>(casinosQuery, {
    skip: shouldSkip,
    variables: {
      category: selectedCategory.length > 0 ? selectedCategory : undefined,
      location: selectedLocation || undefined,
      first: 500
    },
    errorPolicy: 'all',
    fetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: false
  })

  const items = React.useMemo(() => data?.allCasinoStories ?? data?.allCasinos ?? [], [data]);

  React.useEffect(() => {
    if (shouldSkip) {
      setLoading(false)
      setCasinos([])
      setError(null)
    } else {
      setLoading(loading)
    }
  }, [loading, setLoading, setCasinos, setError, shouldSkip])

  React.useEffect(() => {
    if (data && !shouldSkip) {
      setCasinos(items)
    }
  }, [data, setCasinos, shouldSkip, items])

  React.useEffect(() => {
    if (error && !shouldSkip) {
      setError(error.message)
      handleGraphQLError(error, 'Casinos')
    }
  }, [error, setError, shouldSkip])

  return {
    casinos: shouldSkip ? [] : items,
    loading: shouldSkip ? false : loading,
    error,
    refetch,
  }
}
