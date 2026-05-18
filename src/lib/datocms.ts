// Lightweight DatoCMS GraphQL client for browser (Vite)

export interface GraphQLErrorLocation {
  line: number
  column: number
}

export interface GraphQLError {
  message: string
  locations?: GraphQLErrorLocation[]
  path?: Array<string | number>
  extensions?: Record<string, unknown>
}

export interface GraphQLResponse<DataT> {
  data?: DataT
  errors?: GraphQLError[]
}

export type DatoCmsRequestOptions = {
  variables?: Record<string, unknown>
  preview?: boolean
  apiToken?: string
  includeDrafts?: boolean
  excludeInvalid?: boolean
}

/**
 * Execute a typed GraphQL request against DatoCMS.
 */
export async function fetchFromDatoCMS<DataT>(
  params: { query: string } & DatoCmsRequestOptions,
): Promise<DataT> {
  const {
    query,
    variables,
    preview = false,
    apiToken,
    includeDrafts = false,
    excludeInvalid = true,
  } = params

  const endpoint = preview
    ? 'https://graphql.datocms.com/preview'
    : 'https://graphql.datocms.com/'

  const token = apiToken ?? import.meta.env.VITE_DATOCMS_API_TOKEN

  if (!token) {
    throw new Error(
      'Missing VITE_DATOCMS_API_TOKEN. Add it to your .env.local file in project root.',
    )
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }

  if (includeDrafts) headers['X-Include-Drafts'] = 'true'
  if (excludeInvalid) headers['X-Exclude-Invalid'] = 'true'

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables: variables ?? {} }),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(
      `DatoCMS request failed: ${response.status} ${response.statusText} - ${text}`,
    )
  }

  const json = (await response.json()) as GraphQLResponse<DataT>

  if (json.errors && json.errors.length > 0) {
    const messages = json.errors.map((e) => e.message).join('; ')
    throw new Error(`DatoCMS GraphQL errors: ${messages}`)
  }

  if (!json.data) {
    throw new Error('DatoCMS GraphQL: response contained no data')
  }

  return json.data
}

/**
 * Convenience call to check connectivity and get site name.
 */
export async function getDatoSiteName(): Promise<string | null> {
  type SiteInfo = {
    _site: { globalSeo: { siteName: string | null } | null }
  }

  const query = /* GraphQL */ `
    query SiteInfo {
      _site {
        globalSeo {
          siteName
        }
      }
    }
  `

  const data = await fetchFromDatoCMS<SiteInfo>({ query })
  return data._site?.globalSeo?.siteName ?? null
}


