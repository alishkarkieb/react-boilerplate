import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client';
 

export const httpLink = new HttpLink({
  uri: import.meta.env.VITE_PUBLIC_API_ENDPOINT,
  credentials: 'include'
});


const authLink = new ApolloLink((operation,forward)=>{
  if (!forward) throw new Error('Forward function is missing');
  const token = localStorage.getItem('token');

 operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        authorization: token ?  token : '',
        
      }
    }));
  

  return forward(operation);
})

 

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});
