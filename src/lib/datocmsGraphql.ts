import axios, { type AxiosInstance } from 'axios'

export type DatoGraphqlClientOptions = {
  apiToken?: string
  preview?: boolean
  includeDrafts?: boolean
  excludeInvalid?: boolean
  baseURL?: string
}

export function createDatoGraphqlClient(options?: DatoGraphqlClientOptions): AxiosInstance {
  const token = options?.apiToken ?? import.meta.env.VITE_DATOCMS_API_TOKEN

  if (!token) {
    throw new Error('Missing VITE_DATOCMS_API_TOKEN in env')
  }

  const baseURL =
    options?.baseURL ?? (options?.preview ? 'https://graphql.datocms.com/preview' : 'https://graphql.datocms.com/')

  const instance = axios.create({
    baseURL,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(options?.includeDrafts ? { 'X-Include-Drafts': 'true' } : {}),
      ...(options?.excludeInvalid !== false ? { 'X-Exclude-Invalid': 'true' } : {}),
    },
  })

  return instance
}

export type GraphqlRequestParams<VarsT extends Record<string, unknown> | undefined = Record<string, unknown>> = {
  query: string
  variables?: VarsT
}

export async function datoGraphql<DataT, VarsT extends Record<string, unknown> | undefined = Record<string, unknown>>(
  client: AxiosInstance,
  params: GraphqlRequestParams<VarsT>,
): Promise<DataT> {
  const { data } = await client.post('', params)
  if (data.errors?.length) {
    const msg = data.errors.map((e: { message: string }) => e.message).join('; ')
    throw new Error(`Dato GraphQL error: ${msg}`)
  }
  return data.data as DataT
}

// Universal collection fetcher
// Usage: fetchCollection(client, { collection: 'offers', fields: ['id', 'title'] })
export type FetchCollectionOptions = {
  collection: string // API key of the model, eg: 'offer' or 'offers' (will normalize)
  fields: string[]
  filter?: string // raw GraphQL filter body, eg: "{ featured: { eq: true } }"
  first?: number
  skip?: number
  orderBy?: string
  locale?: string
}

export async function fetchCollection<T = unknown>(
  client: AxiosInstance,
  options: FetchCollectionOptions,
): Promise<T[]> {
  const { collection, fields, filter, first, skip, orderBy, locale } = options

  const normalized = collection.startsWith('all')
    ? collection
    : `all${collection[0].toUpperCase()}${collection.slice(1)}`

  const paginationArgs: string[] = []
  if (typeof first === 'number') paginationArgs.push(`first: ${first}`)
  if (typeof skip === 'number') paginationArgs.push(`skip: ${skip}`)
  if (orderBy) paginationArgs.push(`orderBy: ${orderBy}`)
  if (locale) paginationArgs.push(`locale: "${locale}"`)
  if (filter) paginationArgs.push(`filter: ${filter}`)

  const args = paginationArgs.length ? `(${paginationArgs.join(', ')})` : ''

  const query = `
    query FetchCollection {
      ${normalized}${args} {
        ${fields.join('\n        ')}
      }
    }
  `

  type DataShape = { [key: string]: T[] }
  const data = await datoGraphql<DataShape>(client, { query })
  const key = normalized as keyof DataShape
  return (data[key] ?? []) as T[]
}


