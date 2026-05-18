import 'dotenv/config';
import type { CodegenConfig } from '@graphql-codegen/cli';

const token = process.env.VITE_DATOCMS_API_TOKEN;

if (!token) {
  throw new Error(
    'VITE_DATOCMS_API_TOKEN is not set. Create .env (or .env.local) with the DatoCMS read-only token before running codegen.',
  );
}

const config: CodegenConfig = {
  overwrite: true,
  schema: [
    {
      'https://graphql.datocms.com/': {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    },
  ],
  documents: ['src/**/*.{ts,tsx}', '!src/shared/lib/graphql/__generated__/**/*'],
  generates: {
    './src/shared/lib/graphql/__generated__/': {
      preset: 'client',
      config: {
        useTypeImports: true,
        enumsAsTypes: true,
        scalars: {
          ItemId: 'string',
          DateTime: 'string',
          Date: 'string',
          IntType: 'number',
          FloatType: 'number',
          BooleanType: 'boolean',
          UploadId: 'string',
          MetaTagAttributes: 'Record<string, string>',
          CustomData: 'Record<string, unknown>',
          JsonField: 'unknown',
        },
      },
    },
  },
};

export default config;
