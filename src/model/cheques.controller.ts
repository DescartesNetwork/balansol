import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { ChequeData } from '@sentre/launchpad'

import { account } from '@senswap/sen-js'

/**
 * Interface & Utility
 */

export type ChequesState = Record<string, ChequeData>

/**
 * Store constructor
 */

const NAME = 'cheques'
const initialState: ChequesState = {}

/**
 * Actions
 */

export const initCheques = createAsyncThunk(
  `${NAME}/initCheques
  `,
  async (bulk: ChequesState) => {
    return bulk
  },
)

export const getCheques = createAsyncThunk<ChequesState, void, { state: any }>(
  `${NAME}/getLaunchpads`,
  async (_, { getState }) => {
    const { launchpads } = getState()
    return launchpads
  },
)

export const upsetCheque = createAsyncThunk<
  ChequesState,
  { address: string; data: any },
  { state: any }
>(`${NAME}/upsetCheque`, async ({ address, data }) => {
  if (!account.isAddress(address)) throw new Error('Invalid pool address')
  if (!data) throw new Error('Data is empty')
  return { [address]: data }
})

/**
 * Usual procedure
 */

const slice = createSlice({
  name: NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    void builder
      .addCase(initCheques.fulfilled, (state, { payload }) => payload)
      .addCase(
        upsetCheque.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      ),
})

export default slice.reducer
