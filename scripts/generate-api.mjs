import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { generateApi } from 'swagger-typescript-api';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

generateApi({
  name: 'Api.ts',
  output: resolve(__dirname, '../src/api'),
  url: 'http://localhost/openapi.json',
  httpClientType: 'axios',
  generateClient: true,
  generateRouteTypes: true,
  generateResponses: true,
  toJS: false,
  extractRequestParams: true,
  extractRequestBody: true,
  extractEnums: true,
  unwrapResponseData: false,
  defaultResponseAsSuccess: false,
  generateUnionEnums: true,
  moduleNameFirstTag: false,
  generateResponsesTypes: true,
  singleHttpClient: true,
  cleanOutput: true,
  enumNamesAsValues: false,
  moduleNameIndex: 1,
  primitiveTypeConstructs: (constructs) => ({
    ...constructs,
  }),
}).catch((error) => {
  console.error('Ошибка генерации API:', error);
  process.exit(1);
});
