import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

/**
 * Interface & Utility
 */

export type DepositData = {
  amount: number
  address: string
}

export type DepositState = Record<string, DepositData>

/**
 * Store constructor
 */

const NAME = 'deposits'
const initialState: DepositState = {}

/**
 * Actions
 */

export const setDepositState = createAsyncThunk<
  Partial<DepositState>,
  Partial<DepositState>,
  { state: any }
>(
  `${NAME}/setDepositState`,
  async (newState: Partial<DepositState>, { getState }) => {
    return newState
  },
)

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
