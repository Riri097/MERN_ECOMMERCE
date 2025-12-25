import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../constants';

//for api requests
const baseQuery = fetchBaseQuery({ 
    baseUrl: BASE_URL 
});

//createApi is api manager
// apiSlice is Redux Toolkit Query that tells how this app talks to backend using a base URL
export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['Product', 'Order', 'User'], 
  endpoints: (builder) => ({}),
});