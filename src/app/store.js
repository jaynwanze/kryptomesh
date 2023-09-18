import { configureStore } from '@reduxjs/toolkit';

import { cryptoApi } from '../services/cryptoApi';
import { cryptoNewsApi } from '../services/cryptoNewsApi.js';

export default configureStore({
  reducer: {
    [cryptoApi.reducerPath]: cryptoApi.reducer,
    [cryptoNewsApi.reducerPath]: cryptoNewsApi.reducer,

  },

middleware:
        (getdefaultMiddleware) =>
            getdefaultMiddleware()
            .concat([
              cryptoApi.middleware, 
              cryptoNewsApi.middleware
                   ])
  
});