import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const cryptoNewsHeaders = {
  'x-rapidapi-host': 'real-time-news-data.p.rapidapi.com',
  'x-rapidapi-key': process.env.REACT_APP_RAPID_API_KEY,
};

const baseUrl = 'https://real-time-news-data.p.rapidapi.com';

const createRequest = (url) => ({ url, headers: cryptoNewsHeaders });

export const cryptoNewsApi = createApi({
  reducerPath: 'cryptoNewsApi',
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    getCryptoNews: builder.query({
      query: ({ query, limit = 10, country = 'US', lang = 'en', time_published = 'anytime' }) =>
        createRequest(
          `/search?query=${encodeURIComponent(query)}&limit=${limit}` +
          `&country=${country}&lang=${lang}&time_published=${time_published}`
        ),
    }),
  }),
});

export const { useGetCryptoNewsQuery } = cryptoNewsApi;