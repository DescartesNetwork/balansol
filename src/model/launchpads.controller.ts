import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { LaunchpadData } from '@sentre/launchpad'

import { account } from '@senswap/sen-js'

/**
 * Interface & Utility
 */

export type LaunchpadsState = Record<string, LaunchpadData>

/**
 * Store constructor
 */

const NAME = 'launchpads'
const initialState: LaunchpadsState = {}

/**
 * Actions
 */

export const initLaunchpads = createAsyncThunk(
  `${NAME}/initLaunchpads
  `,
  async (bulk: LaunchpadsState) => {
    return bulk
  },
)

export const upsetLaunchpad = createAsyncThunk<
  LaunchpadsState,
  { address: string; data: any },
  { state: any }
>(`${NAME}/upsetLaunchpad`, async ({ address, data }) => {
  if (!account.isAddress(address)) throw new Error('Invalid pool address')
  if (!data) throw new Error('Data is empty')
  return { [address]: data }
})

export const getLaunchpads = createAsyncThunk<
  LaunchpadsState,
  void,
  { state: any }
>(`${NAME}/getLaunchpads`, async (_, { getState }) => {
  const { launchpads } = getState()
  return launchpads
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
      .addCase(initLaunchpads.fulfilled, (state, { payload }) => payload)
      .addCase(
        upsetLaunchpad.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      ),
})

export default slice.reducer
