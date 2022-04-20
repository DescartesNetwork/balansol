import { configureStore } from '@reduxjs/toolkit'
import { devTools } from 'shared/devTools'

import main from 'app/model/main.controller'
import pools from 'app/model/pools.controller'
import swap from 'app/model/swap.controller'
import searchPools from 'app/model/searchPools.controller'

/**
 * Isolated store
 */
const model = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: devTools(process.env.REACT_APP_ID as string),
  reducer: {
    main,
    pools,
    swap,
    searchPools
  },
})

export type AppState = ReturnType<typeof model.getState>
export type AppDispatch = typeof model.dispatch
export default model
