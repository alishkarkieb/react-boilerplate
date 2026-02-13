// src/utils/axios.ts
import axios from "axios";
import { print } from "graphql"; // Optional: helps turn DocumentNode into string

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_API_ENDPOINT,
  headers: { 
    "Content-Type": "application/json",
    // "Authorization":`Bearer ${localStorage.getItem('token')}`

  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  console.log({accesstoken:token})
  if (token && config.headers) config.headers.Authorization = `${token}`;
  return config;
});

export const graphqlRequest = async <TData, TVariables>(
  document: any,
  variables?: TVariables,
): Promise<TData> => {
  // We extract the query string from the generated DocumentNode object
  const res = await apiClient.post("", {
    query: document.loc?.source.body || print(document),
    variables,
  });
  if (res.data.errors?.[0]?.extensions?.code === "UNAUTHENTICATED") {
    localStorage.removeItem("token");

    // Optional: Dispatch an event so AuthContext knows to update
    window.dispatchEvent(new Event("storage"));

    throw new Error("Session expired. Please login again.");
  }

  if (res.data.errors) {
    throw res.data.errors[0]; // Throw the first error found
  }

  return res.data.data;
};
