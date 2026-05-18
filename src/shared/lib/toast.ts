import { toast } from 'react-toastify'

/**
 * Утилиты для показа уведомлений через react-toastify
 */
interface MaybeApolloError {
  message?: string
  graphQLErrors?: Array<{ message: string }>
  networkError?: unknown
}

const asMaybeApolloError = (error: unknown): MaybeApolloError | null => {
  if (typeof error === 'object' && error !== null) return error as MaybeApolloError
  return null
}

export const showError = (message: string, error?: unknown) => {
  console.error('API Error:', message, error)

  let errorMessage = message
  const apolloError = asMaybeApolloError(error)

  if (apolloError?.message) {
    errorMessage = `${message}: ${apolloError.message}`
  } else if (apolloError?.graphQLErrors && apolloError.graphQLErrors.length > 0) {
    errorMessage = `${message}: ${apolloError.graphQLErrors[0].message}`
  } else if (apolloError?.networkError) {
    errorMessage = `${message}: Network error`
  } else if (typeof error === 'string') {
    errorMessage = `${message}: ${error}`
  }

  toast.error(errorMessage, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  })
}

export const showSuccess = (message: string) => {
  toast.success(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  })
}

export const showWarning = (message: string) => {
  toast.warning(message, {
    position: "top-right",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  })
}

export const showInfo = (message: string) => {
  toast.info(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  })
}

/**
 * Обработчик ошибок GraphQL
 */
export const handleGraphQLError = (error: unknown, context: string = 'API') => {
  const apolloError = asMaybeApolloError(error)
  if (apolloError?.graphQLErrors && apolloError.graphQLErrors.length > 0) {
    showError(`${context} Error`, apolloError.graphQLErrors[0].message)
  } else if (apolloError?.networkError) {
    showError(`${context} Network Error`, 'Please check your internet connection')
  } else if (apolloError?.message) {
    showError(`${context} Error`, apolloError.message)
  } else {
    showError(`${context} Error`, 'An unexpected error occurred')
  }
}

/**
 * Обработчик ошибок загрузки изображений
 */
export const handleImageError = (error: unknown, imageUrl?: string) => {
  console.error('Image loading error:', error, imageUrl)
  showWarning(`Failed to load image${imageUrl ? `: ${imageUrl}` : ''}`)
}

/**
 * Обработчик ошибок скачивания
 */
export const handleDownloadError = (error: unknown, filename?: string) => {
  console.error('Download error:', error, filename)
  showError(`Failed to download${filename ? ` ${filename}` : ' file'}`)
}
