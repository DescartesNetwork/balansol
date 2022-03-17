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
  setGradient = 'set-gradient',
  addLiquidity = 'fund',
  confirmCreatePool = 'confirm-create-pool',
}

export const allowedKeyCode = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', null]
