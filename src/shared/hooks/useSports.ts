import { useEffect, useMemo } from 'react'
import { useQuery } from '@apollo/client/react'
import { GET_SPORTS, GET_SPORT_STORIES } from '@/shared/lib/graphql/queries'
import { useAppStore } from '@/shared/store'
import { handleGraphQLError } from '@/shared/lib/toast'
import { getUploadDateRange } from '@/shared/lib/upload-date'

export function useSports(enabled: boolean = true) {
  const { setSports, setLoading, setError, selectedSportType, selectedCategorySport, selectedLocation, selectedFormat, selectedUploadDate } = useAppStore()

  const baseSkip =
    !enabled ||
    !selectedFormat ||
    !selectedSportType ||
    selectedSportType.length === 0 ||
    !selectedCategorySport ||
    selectedCategorySport.length === 0 ||
    !selectedLocation

  const isStories = selectedFormat === 'stories'

  const dateRange = useMemo(() => getUploadDateRange(selectedUploadDate), [selectedUploadDate])

  const variables = {
    sportType: selectedSportType && selectedSportType.length > 0 ? selectedSportType : undefined,
    categorySport: selectedCategorySport && selectedCategorySport.length > 0 ? selectedCategorySport : undefined,
    location: selectedLocation ?? undefined,
    publishedAtGte: dateRange.publishedAtGte,
    publishedAtLt: dateRange.publishedAtLt,
    first: 500,
  }

  const regular = useQuery(GET_SPORTS, {
    skip: baseSkip || isStories,
    variables,
    errorPolicy: 'all',
  })

  const stories = useQuery(GET_SPORT_STORIES, {
    skip: baseSkip || !isStories,
    variables,
    errorPolicy: 'all',
  })

  const active = isStories ? stories : regular
  const items = useMemo(
    () =>
      isStories
        ? stories.data?.allSportStories ?? []
        : regular.data?.allSports ?? [],
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
      setSports(items)
    } else if (baseSkip) {
      setSports([])
    }
  }, [active.data, setSports, baseSkip, items])

  useEffect(() => {
    if (active.error && !baseSkip) {
      setError(active.error.message)
      handleGraphQLError(active.error, 'Sports')
    }
  }, [active.error, setError, baseSkip])

  return {
    sports: baseSkip ? [] : items,
    loading: baseSkip ? false : active.loading,
    error: active.error,
    refetch: active.refetch,
  }
}
