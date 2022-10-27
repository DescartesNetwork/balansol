import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Program } from '@project-serum/anchor'
import { getAnchorProvider } from '@sentre/senhub'

import { BalancerAmm } from 'hooks/launchpad/balancer_amm'
import { DEFAULT_BALANCER_IDL } from 'constant'
import configs from 'configs'
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

const getBalancerProgram = () => {
  const provider = getAnchorProvider()!
  return new Program<BalancerAmm>(
    DEFAULT_BALANCER_IDL,
    configs.sol.balancerAddress,
    provider,
  )
}

export const getLaunchpads = createAsyncThunk(
  `${NAME}/getLaunchpads`,
  async () => {
    const balancerProgram = getBalancerProgram()
    const launchpads = await balancerProgram.account.launchpad.all()
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
