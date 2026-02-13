// import type { CodegenConfig } from "@graphql-codegen/cli";
// import * as dotenv from 'dotenv';


// // const schemaTypesPath = path.join(
// //   __dirname,
// //   "src/graphql/generated/graphql.ts",
// // );
// dotenv.config()
// console.log({nkdnf:process.env.PUBLIC_API_ENDPOINT})

//   const config: CodegenConfig = {
//   overwrite: true,
//   schema: process.env.PUBLIC_API_ENDPOINT,
//   documents: [
//     "src/modules/**/graphql/**/*.graphql",
//     // "src/graphql/common/**/*.graphql",
//   ],
//   generates: {
//     "src/graphql/generated/graphql.ts": {
//       plugins: [
//         "typescript",
//         "typescript-operations",
//         "typescript-react-query",
//       ],
//       config: {
//         importTypesNamespace: "Types",
//         // useTypeImports:   true,
//         documentMode: "documentNode",
//         // skipTypename: false,
//         // prettierConfig: { singleQuote: true, semi: true, printWidth: 80 },
//         // eslintDisable: false,
//         fetcher: {
//           // Path to your axios file (relative to the generated file)
//           func: "../../utils/axios#graphqlFetcher", 
//           isReactHook: false,
//         },
//         exposeQueryKeys: true,
//         // emitLegacyCommonJSImports: false,
//         exposeFetcher: true,
//          reactQueryVersion: 4,
//         // reactQueryOptions: {
//         //   useMutationOptions: true,
//         // }
//        },
//     },
//   },
// };

// export default  config


import path from 'path';
import * as dotenv from 'dotenv';
import type { CodegenConfig } from '@graphql-codegen/cli';

dotenv.config();

const schemaTypesPath = path.resolve(
  'src/graphql/generated/graphql-types.ts'
);

const config: CodegenConfig = {
  schema: process.env.PUBLIC_API_ENDPOINT,
  documents: ['src/modules/**/*.graphql'],
  overwrite: true,
  generates: {
    /**
     * Shared schema & scalar types
     */
    [schemaTypesPath]: {
      plugins: ['typescript'],
    },

    /**
     * Typed operations + DocumentNode
     * Generated next to each .graphql file
     */
    'src/': {
      preset: 'near-operation-file',
      presetConfig: {
        extension: '.generated.ts',
        baseTypesPath: path
          .relative('src', schemaTypesPath)
          .replace(/\\/g, '/'),
      },
      plugins: [
        'typescript-operations',
        'typed-document-node',
      ],
      config:{
        useTypeImports:true
      }
    },
  },
};

export default config;
