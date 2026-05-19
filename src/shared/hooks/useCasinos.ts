import { useEffect, useMemo } from 'react'
import { useQuery } from '@apollo/client/react'
import { GET_CASINOS, GET_CASINO_STORIES } from '@/shared/lib/graphql/queries'
import { useAppStore } from '@/shared/store'
import { handleGraphQLError } from '@/shared/lib/toast'
import { getUploadDateRange } from '@/shared/lib/upload-date'

export function useCasinos(enabled: boolean = true) {
  const { setCasinos, setLoading, setError, selectedCategory, selectedCasinoType, selectedLocation, selectedFormat, selectedUploadDate } = useAppStore()

  const baseSkip =
    !enabled ||
    !selectedFormat ||
    !selectedCategory ||
    selectedCategory.length === 0 ||
    !selectedLocation

  const isStories = selectedFormat === 'stories'

  const dateRange = useMemo(() => getUploadDateRange(selectedUploadDate), [selectedUploadDate])

  const variables = {
    category: selectedCategory && selectedCategory.length > 0 ? selectedCategory : undefined,
    casinoType: selectedCasinoType && selectedCasinoType.length > 0 ? selectedCasinoType : undefined,
    location: selectedLocation ? [selectedLocation] : undefined,
    publishedAtGte: dateRange.publishedAtGte,
    publishedAtLt: dateRange.publishedAtLt,
    first: 500,
  }

  const regular = useQuery(GET_CASINOS, {
    skip: baseSkip || isStories,
    variables,
    errorPolicy: 'all',
  })

  const stories = useQuery(GET_CASINO_STORIES, {
    skip: baseSkip || !isStories,
    variables,
    errorPolicy: 'all',
  })

  const active = isStories ? stories : regular
  const items = useMemo(
    () =>
      isStories
        ? stories.data?.allCasinoStories ?? []
        : regular.data?.allCasinos ?? [],
    [isStories, stories.data, regular.data],
  )

  useEffect(() => {
    if (!baseSkip) {
      setLoading(active.loading)
    } else {
      setLoading(false)
    }
  }, [active.loading, setLoading, baseSkip])

  useEffect(() => {
    if (!baseSkip && active.data) {
      setCasinos(items)
    } else if (baseSkip) {
      setCasinos([])
    }
  }, [active.data, setCasinos, baseSkip, items])

  useEffect(() => {
    if (active.error && !baseSkip) {
      setError(active.error.message)
      handleGraphQLError(active.error, 'Casinos')
    }
  }, [active.error, setError, baseSkip])

  return {
    casinos: baseSkip ? [] : items,
    loading: baseSkip ? false : active.loading,
    error: active.error,
    refetch: active.refetch,
  }
}
