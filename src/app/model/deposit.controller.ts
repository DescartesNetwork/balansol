import { Address } from '@project-serum/anchor'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

/**
 * Interface & Utility
 */
export type DepositInfo = {
  amount: string
  address: string
}
export type DepositState = {
  poolAddress: string
  depositInfo: DepositInfo[]
}

/**
 * Store constructor
 */

const NAME = 'deposits'
const initialState: DepositState = {
  poolAddress: '',
  depositInfo: [],
}

/**
 * Actions
 */

export const setDepositState = createAsyncThunk<
  Partial<DepositState>,
  Partial<DepositState>
>(`${NAME}/setDepositState`, async (newState: Partial<DepositState>) => {
  return newState
})

/**
 * Usual procedure
 */

const slice = createSlice({
  name: NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    void builder.addCase(
      setDepositState.fulfilled,
      (state, { payload }) => void Object.assign(state, payload),
    ),
})

export default slice.reducer
