import { useEffect, useMemo } from 'react'
import { useQuery } from '@apollo/client/react'
import { GET_UNIVERSALS } from '@/shared/lib/graphql/queries'
import { useAppStore } from '@/shared/store'
import { handleGraphQLError } from '@/shared/lib/toast'
import { getUploadDateRange } from '@/shared/lib/upload-date'

export function useUniversals(enabled: boolean = true) {
  const {
    setUniversals,
    setLoading,
    setError,
    selectedUniversalCategory,
    selectedCreativeFormat,
    selectedLocation,
    selectedFormat,
    selectedUploadDate,
  } = useAppStore()

  const baseSkip =
    !enabled ||
    !selectedFormat ||
    !selectedLocation

  const dateRange = useMemo(() => getUploadDateRange(selectedUploadDate), [selectedUploadDate])

  const variables = {
    universalCategory: selectedUniversalCategory && selectedUniversalCategory.length > 0 ? selectedUniversalCategory : undefined,
    creativeFormat: selectedCreativeFormat && selectedCreativeFormat.length > 0 ? selectedCreativeFormat : undefined,
    location: selectedLocation ?? undefined,
    publishedAtGte: dateRange.publishedAtGte,
    publishedAtLt: dateRange.publishedAtLt,
    first: 500,
  }

  const query = useQuery(GET_UNIVERSALS, {
    skip: baseSkip,
    variables,
    errorPolicy: 'all',
  })

  const items = useMemo(() => query.data?.allUniversals ?? [], [query.data])

  useEffect(() => {
    if (!baseSkip) {
      setLoading(query.loading)
    } else {
      setLoading(false)
    }
  }, [query.loading, setLoading, baseSkip])

  useEffect(() => {
    if (!baseSkip && query.data) {
      setUniversals(items)
    } else if (baseSkip) {
      setUniversals([])
    }
  }, [query.data, setUniversals, baseSkip, items])

  useEffect(() => {
    if (query.error && !baseSkip) {
      setError(query.error.message)
      handleGraphQLError(query.error, 'Universals')
    }
  }, [query.error, setError, baseSkip])

  return {
    universals: baseSkip ? [] : items,
    loading: baseSkip ? false : query.loading,
    error: query.error,
    refetch: query.refetch,
  }
}
