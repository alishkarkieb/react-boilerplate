import type * as Types from './generated/graphql-types';

import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type RegisterFcmTokenMutationVariables = Types.Exact<{
  registerFcmTokenInput: Types.RegisterTokenInput;
}>;


export type RegisterFcmTokenMutation = { __typename?: 'Mutation', registerFcmToken: { __typename?: 'FCMToken', _id: string, deviceType: string, token: string, userId: string } };


export const RegisterFcmTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RegisterFcmToken"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"registerFcmTokenInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RegisterTokenInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registerFcmToken"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"registerFcmTokenInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"deviceType"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}}]}}]} as unknown as DocumentNode<RegisterFcmTokenMutation, RegisterFcmTokenMutationVariables>;