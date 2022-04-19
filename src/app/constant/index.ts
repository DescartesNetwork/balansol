import { BN, web3 } from '@project-serum/anchor'

export enum PoolTabs {
  Sentre = 'sentre-pools',
  Deposited = 'deposited-pools',
  YourPools = 'your-pools',
  Community = 'community-pools',
}

export const HOMEPAGE_TABS: Record<string, string> = {
  Swap: 'swap',
  Pools: 'pools',
}

export enum QueryParams {
  details = 'details',
  address = 'poolAddress',
  category = 'category',
  wrapTab = 'tab',
  tabInPools = 'tab-in-pools',
}

export enum PoolStatus {
  Frozen = 2,
  Active = 1,
}

export enum PoolCreatingStep {
  setupToken,
  addLiquidity,
  confirmCreatePool,
}

export const GENERAL_NORMALIZED_NUMBER = 10 ** 9
export const LPTDECIMALS = 9
export const GENERAL_DECIMALS = 9
export const PRECISION = 1000000000

export enum PriceImpact {
  goodSwap = 1,
  acceptableSwap = 5,
}

// Deposit types

export type PoolPairLpData = {
  balanceIn: BN
  balanceOut: BN
  weightIn: number
  decimalIn: number
  swapFee: BN
}

export type PoolPairData = {
  balanceIn: BN
  balanceOut: BN
  weightIn: number
  weightOut: number
  decimalIn: number
  decimalOut: number
  swapFee: BN
}

export type MintDataFromPool = {
  reserve: BN
  normalizedWeight: number
  treasury: web3.PublicKey
}

export enum FilterPools {
  AllPools = 'all-pools',
  DepositedPools = 'deposited-pools',
  YourPools = 'your-pools',
}
