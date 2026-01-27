import {
  BaseQueryFn,
  FetchArgs,
  createApi,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import {store} from '../store';
import Config from 'react-native-config';


const baseQuery = fetchBaseQuery({
  baseUrl: Config.API_URL,
  prepareHeaders: (headers, api) => {
    const auth = store.getState().auth;
    console.log("Auth State from API==> ", auth )
    const {
      token
    } = auth;
    headers.set(`Authorization`, `Bearer ${token}`)
  },
});

const baseQueryWithInterceptor: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const url = typeof args === 'string' ? args : args.url;
  const method = typeof args === 'string' ? 'GET' : args.method || 'GET';
  
  console.log(`🚀 [API Request] ${method} ${url}`, args);

  let result = await baseQuery(args, api, extraOptions);

  if (result.error) {
    console.log(`❌ [API Error] ${method} ${url}`, result.error);
    if (result.error.status === 401) {
      // Handle Unauthorized
    }
  } else {
    console.log(`✅ [API Success] ${method} ${url}`, result.data);
  }

  return result;
};

export const api = createApi({
  baseQuery: baseQueryWithInterceptor,
  tagTypes: ['Trade'],
  endpoints: () => ({}),
});
