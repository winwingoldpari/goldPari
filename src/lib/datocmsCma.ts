import { buildClient, LogLevel } from '@datocms/cma-client-browser'

export type BuildDatoCmaClientOptions = {
  environment?: string
  logLevel?: LogLevel
  apiToken?: string
}

export function buildDatoCmaClient(options?: BuildDatoCmaClientOptions) {
  const token = options?.apiToken ?? import.meta.env.VITE_DATOCMS_CMA_TOKEN

  if (!token) {
    throw new Error(
      'Missing VITE_DATOCMS_CMA_TOKEN. Create .env.local and set it to your DatoCMS CMA token.',
    )
  }

  return buildClient({
    apiToken: token,
    environment: options?.environment,
    logLevel: options?.logLevel ?? LogLevel.NONE,
  })
}

export async function getCmaSiteName(): Promise<string | null> {
  const client = buildDatoCmaClient()
  const site = await client.site.find()
  const name = (site as { name?: string | null }).name ?? null
  return name
}


