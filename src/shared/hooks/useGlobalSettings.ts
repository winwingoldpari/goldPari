import React from 'react'
import { useQuery } from '@apollo/client/react'
import { GET_GLOBAL_SETTINGS } from '@/shared/lib/graphql/queries'
import { handleGraphQLError } from '@/shared/lib/toast'

interface GlobalSetting {
  starterPack: string;
  feedback: string;
}

interface GetGlobalSettingsResponse {
  globalSetting: GlobalSetting;
}

export function useGlobalSettings() {
  const { data, loading, error } = useQuery<GetGlobalSettingsResponse>(GET_GLOBAL_SETTINGS)

  React.useEffect(() => {
    if (error) {
      handleGraphQLError(error, 'Global Settings')
    }
  }, [error])

  return {
    starterPack: data?.globalSetting?.starterPack || '',
    feedback: data?.globalSetting?.feedback || '',
    loading,
    error,
  }
}
