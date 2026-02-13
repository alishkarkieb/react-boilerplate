export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
};

export type Book = {
  __typename?: 'Book';
  id: Scalars['ID']['output'];
  price: Scalars['Int']['output'];
  title: Scalars['String']['output'];
};

export type CreateUserInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  email?: Scalars['String']['input'];
  name?: Scalars['String']['input'];
  password?: Scalars['String']['input'];
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
};

export type DeleteUserResponse = {
  __typename?: 'DeleteUserResponse';
  id?: Maybe<Scalars['String']['output']>;
  message: Scalars['String']['output'];
};

export type ForgotPasswordDto = {
  deviceId: Scalars['String']['input'];
  email: Scalars['String']['input'];
};

export type ForgotPasswordResponse = {
  __typename?: 'ForgotPasswordResponse';
  message: Scalars['String']['output'];
};

export type ListUser = {
  limit?: Scalars['Float']['input'];
  order?: InputMaybe<Scalars['String']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  searchText?: InputMaybe<Scalars['String']['input']>;
  skip?: Scalars['Float']['input'];
};

export type LoginResponse = {
  __typename?: 'LoginResponse';
  message: Scalars['String']['output'];
  payload: TokenPayload;
};

export type LoginUserInput = {
  email?: Scalars['String']['input'];
  password?: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createUser: User;
  deleteUser: DeleteUserResponse;
  forgotPassword: ForgotPasswordResponse;
  login: LoginResponse;
  resetPassword: ForgotPasswordResponse;
  updateUser: User;
};


export type MutationCreateUserArgs = {
  createUserInput: CreateUserInput;
};


export type MutationDeleteUserArgs = {
  id: Scalars['String']['input'];
};


export type MutationForgotPasswordArgs = {
  forgotPasswordDto: ForgotPasswordDto;
};


export type MutationLoginArgs = {
  login: LoginUserInput;
};


export type MutationResetPasswordArgs = {
  resetPasswordDto: ResetPasswordDto;
};


export type MutationUpdateUserArgs = {
  id: Scalars['String']['input'];
  updateUserInput: UpdateUserInput;
};

export type PaginatedUsers = {
  __typename?: 'PaginatedUsers';
  items: Array<User>;
  totalCount: Scalars['Int']['output'];
};

export type Query = {
  __typename?: 'Query';
  books: Array<Book>;
  user: User;
  users: PaginatedUsers;
};


export type QueryUserArgs = {
  id: Scalars['String']['input'];
};


export type QueryUsersArgs = {
  input: ListUser;
};

export type ResetPasswordDto = {
  email: Scalars['String']['input'];
  otp: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type TokenPayload = {
  __typename?: 'TokenPayload';
  accessToken: Scalars['String']['output'];
  accessTokenExpiresIn: Scalars['DateTime']['output'];
  refreshToken: Scalars['String']['output'];
  refreshTokenExpiresIn: Scalars['DateTime']['output'];
};

export type UpdateUserInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  address: Scalars['String']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  phoneNumber?: Maybe<Scalars['String']['output']>;
  status: Scalars['Boolean']['output'];
};
