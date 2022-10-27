import { configureStore } from '@reduxjs/toolkit'
import { devTools } from 'model/devTools'

import main from 'model/main.controller'
import pools from 'model/pools.controller'
import swap from 'model/swap.controller'
import searchPools from 'model/searchPools.controller'
import launchpads from 'model/launchpads.controller'

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
    searchPools,
    launchpads,
  },
})

export type AppState = ReturnType<typeof model.getState>
export type AppDispatch = typeof model.dispatch
export default model
