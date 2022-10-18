import { BN, web3 } from '@project-serum/anchor'

export enum PoolTabs {
  Sentre = 'sentre-pools',
  Deposited = 'deposited-pools',
  YourPools = 'your-pools',
  Community = 'community-pools',
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
  goodSwap = 0.01,
  acceptableSwap = 0.05,
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

// Launchpad
export const DATE_FORMAT = 'MMM DD, YYYY HH:mm'
export enum LaunchpadSate {
  active = 'active',
  upcoming = 'upcoming',
  completed = 'completed',
}
export enum InitLaunchpadStep {
  projectInfo,
  projectPhoto,
  configuration,
}

export type ProjectInfoData = {
  projectName: string
  description: string
  website: string
  github: string
  whitepaper: string
  vCs: { logo: string | ArrayBuffer | null; link: string }[]
  socials: string[]
  coverPhoto: string | ArrayBuffer | null
}

export type Launchpad = {
  projectInfo: ProjectInfoData
  token_a: string
  purchaseToken: string
  total_raise: number
  fundraising: number
  fee: number
  category: string[]
  startPrice: number
  floorPrice: number
  startTime: number
  endTime: number
}

export const CATEGORY = {
  defi: [49, 100, 0],
  gamefi: [4, 100, 253],
  DAO: [114, 100, 7],
  multisig: [248, 100, 176],
  lending: [147, 100, 156],
  portfolio: [72, 100, 5],
  liquidity: [242, 100, 21],
  AMM: [161, 100, 253],
  privacy: [136, 100, 35],
  payment: [108, 100, 145],
  utility: [156, 100, 45],
  NFT: [4, 100, 253],
}
export const SOL_DECIMALS = 9
