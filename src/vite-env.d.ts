/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_DATOCMS_API_TOKEN?: string;
  readonly VITE_DATOCMS_CMA_TOKEN?: string;
  readonly VITE_GRAPHQL_ENDPOINT?: string;
  readonly VITE_PUBLIC_POSTHOG_PROJECT_TOKEN: string;
  readonly VITE_PUBLIC_POSTHOG_HOST: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
