import React from 'react'
import { useQuery } from '@apollo/client/react'
import { GET_CASINOS } from '@/shared/lib/graphql/queries'
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
  allCasinos: Casino[];
}

export function useCasinos() {
  const { setCasinos, setLoading, setError, selectedCategory, selectedLocation } = useAppStore()
  
  const shouldSkip = !selectedCategory || !selectedLocation
  
  const { data, loading, error, refetch } = useQuery<GetCasinosResponse>(GET_CASINOS, {
    skip: shouldSkip,
    variables: {
      ...(selectedCategory && { category: selectedCategory }),
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
      setCasinos([])
    } else {
      setLoading(loading)
    }
  }, [loading, setLoading, setCasinos, shouldSkip])

  React.useEffect(() => {
    if (data && !shouldSkip) {
      setCasinos(data.allCasinos || [])
    }
  }, [data, setCasinos, shouldSkip])

  React.useEffect(() => {
    if (error && !shouldSkip) {
      setError(error.message)
      handleGraphQLError(error, 'Casinos')
    }
  }, [error, setError, shouldSkip])

  return {
    casinos: shouldSkip ? [] : (data?.allCasinos || []),
    loading: shouldSkip ? false : loading,
    error,
    refetch,
  }
}
