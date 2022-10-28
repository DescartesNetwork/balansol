import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { account } from '@senswap/sen-js'

/**
 * Interface & Utility
 */

export type LaunchpadsState = Record<string, any>

/**
 * Store constructor
 */

const NAME = 'launchpads'
const initialState: LaunchpadsState = {}

/**
 * Actions
 */

export const getLaunchpads = createAsyncThunk(
  `${NAME}/getLaunchpads`,
  async () => {
    const launchpads = await window.launchpad.program.account.launchpad.all()
    let bulk: LaunchpadsState = {}
    for (const launchpad of launchpads) {
      const launchpadData = launchpad.account
      bulk[launchpad.publicKey.toBase58()] = launchpadData
    }
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

/**
 * Usual procedure
 */

const slice = createSlice({
  name: NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    void builder
      .addCase(getLaunchpads.fulfilled, (state, { payload }) => payload)
      .addCase(
        upsetLaunchpad.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      ),
})

export default slice.reducer
