import { useEffect } from 'react'
import { useQuery } from '@apollo/client/react'
import { GET_GLOBAL_SETTINGS } from '@/shared/lib/graphql/queries'
import { handleGraphQLError } from '@/shared/lib/toast'

export function useGlobalSettings() {
  const { data, loading, error } = useQuery(GET_GLOBAL_SETTINGS)

  useEffect(() => {
    if (error) {
      handleGraphQLError(error, 'Global Settings')
    }
  }, [error])

  return {
    starterPack: data?.globalSetting?.starterPack ?? '',
    feedback: data?.globalSetting?.feedback ?? '',
    link: data?.globalSetting?.link ?? '',
    sendRequest: data?.globalSetting?.sendRequest ?? '',
    loading,
    error,
  }
}
