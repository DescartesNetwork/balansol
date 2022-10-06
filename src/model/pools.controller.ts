import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { PoolData, PoolState } from '@senswap/balancer'
import { account } from '@senswap/sen-js'

/**
 * Interface & Utility
 */

export type PoolsState = Record<string, PoolData>

/**
 * Store constructor
 */

const NAME = 'pools'
const initialState: PoolsState = {}

/**
 * Actions
 */

export const getPools = createAsyncThunk(`${NAME}/getPools`, async () => {
  const pools = await window.balansol.getAllPoolData()
  let bulk: PoolsState = {}
  for (const pool of pools) {
    const poolData = pool.account as PoolData
    const poolState = poolData.state as PoolState
    if (poolState['deleted']) continue
    bulk[pool.publicKey.toBase58()] = poolData
  }

  return bulk
})

export const getPool = createAsyncThunk<
  PoolsState,
  { address: string },
  { state: any }
>(`${NAME}/getPool`, async ({ address }, { getState }) => {
  if (!account.isAddress(address)) throw new Error('Invalid pool address')
  const {
    pools: { [address]: data },
  } = getState()
  if (data) return { [address]: data }

  const poolData = await window.balansol.getPoolData(address)
  return { [address]: poolData }
})

export const upsetPool = createAsyncThunk<
  PoolsState,
  { address: string; data: PoolData },
  { state: any }
>(`${NAME}/upsetPool`, async ({ address, data }) => {
  if (!account.isAddress(address)) throw new Error('Invalid pool address')
  if (!data) throw new Error('Data is empty')
  return { [address]: data }
})

export const removePool = createAsyncThunk<
  PoolsState,
  { address: string },
  { state: any }
>(`${NAME}/removePool`, async ({ address }, { getState }) => {
  const { pools } = getState()
  if (!account.isAddress(address)) throw new Error('Invalid pool address')
  if (!pools[address]) throw new Error('Pool address does not exist!')
  const newPools = { ...pools }
  delete newPools[address]
  return newPools
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
      .addCase(getPools.fulfilled, (state, { payload }) => payload)
      .addCase(
        getPool.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        upsetPool.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(removePool.fulfilled, (state, { payload }) => payload),
})

export default slice.reducer
