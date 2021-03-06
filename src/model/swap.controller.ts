import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

/**
 * Interface & Utility
 */

export type SwapState = {
  bidMint: string
  bidAmount: string
  askMint: string
  askAmount: string
  isReverse: boolean
  slippageTolerance: number
  loading: boolean
}

/**
 * Store constructor
 */

const NAME = 'swap'
const initialState: SwapState = {
  bidMint: '',
  bidAmount: '',
  askMint: '',
  askAmount: '',
  isReverse: false,
  slippageTolerance: 0.5,
  loading: false,
}

/**
 * Actions
 */

export const setSwapState = createAsyncThunk<
  Partial<SwapState>,
  Partial<SwapState>
>(`${NAME}/setSwapState`, async (newState: Partial<SwapState>) => {
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
      setSwapState.fulfilled,
      (state, { payload }) => void Object.assign(state, payload),
    ),
})

export default slice.reducer
