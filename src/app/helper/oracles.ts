import { Address, BN, web3 } from '@project-serum/anchor'
import { PoolData } from '@senswap/balancer'

import { GENERAL_NORMALIZED_NUMBER } from 'app/constant'
import { PRECISION } from 'app/constant/index'

export const findMintIndex = (poolData: PoolData, mint: Address): number => {
  return poolData.mints
    .map((e) => e.toBase58())
    .indexOf(new web3.PublicKey(mint).toBase58())
}

export const getMintInfo = (poolData: PoolData, mint: Address) => {
  const mintIdx = findMintIndex(poolData, mint)
  if (mintIdx === -1) throw new Error('Can not find mint in pool')

  const normalizedWeight = calcNormalizedWeight(
    poolData.weights,
    poolData.weights[mintIdx],
  )
  return {
    reserve: poolData.reserves[mintIdx],
    normalizedWeight: normalizedWeight,
    treasury: poolData.treasuries[mintIdx],
  }
}

export const valueFunction = (
  reserves: string[],
  weights: string[],
): number => {
  const numReserves = reserves.map((value) => Number(value))
  const numWeights = weights.map((value) => Number(value))
  const sumWeight = numWeights.reduce((a, b) => a + b, 0)
  let result = 1
  for (let i = 0; i < numReserves.length; i++) {
    const nomalizeWeight = numWeights[i] / sumWeight
    result *= numReserves[i] ** nomalizeWeight
  }
  return result
}

export const calTotalSupplyPool = (
  reserves: string[],
  weights: string[],
): number => {
  return valueFunction(reserves, weights) * reserves.length
}

export const calcLpOutGivenIn = (
  amountIn: number,
  balanceIn: number,
  totalSupply: number,
) => {
  return (amountIn / balanceIn - 1) * totalSupply - totalSupply
}

export const calcOutGivenIn = (
  lpAmount: BN,
  balanceIn: BN,
  totalSupply: BN,
) => {
  const lpAmountNumber = lpAmount.toNumber()
  const balanceInNumber = balanceIn.toNumber()
  const totalSupplyNumber = totalSupply.toNumber()

  return (lpAmountNumber / totalSupplyNumber) * balanceInNumber
}

export const calcOptimizedDepositedAmount = (
  baseTokenInfo: any,
  calculatedTokenInfo: any,
  baseTokenAmount: string,
  baseTokenWeight: string,
  calculatedTokenWeight: string,
) => {
  return (
    (baseTokenInfo?.price *
      Number(baseTokenAmount) *
      Number(calculatedTokenWeight)) /
    (calculatedTokenInfo?.price * Number(baseTokenWeight))
  )
}

export const calcOutGivenInSwap = (
  amountIn: BN,
  balanceOut: BN,
  balanceIn: BN,
  weightOut: number,
  weightIn: number,
  swapFee: BN,
): BN => {
  const numBalanceOut = balanceOut.toNumber()
  const numBalanceIn = balanceIn.toNumber()
  const numAmountIn = amountIn.toNumber()
  const numSwapFee = swapFee.toNumber() / GENERAL_NORMALIZED_NUMBER
  const ratioBeforeAfterBalance = numBalanceIn / (numBalanceIn + numAmountIn)

  const ratioInOutWeight = weightIn / weightOut
  return new BN(
    numBalanceOut *
      (1 - ratioBeforeAfterBalance ** ratioInOutWeight) *
      (1 - numSwapFee),
  )
}

export const calcInGivenOutSwap = (
  amountOut: BN,
  balanceOut: BN,
  balanceIn: BN,
  weightOut: number,
  weightIn: number,
  swapFee: BN,
): BN => {
  const numBalanceOut = balanceOut.toNumber()
  const numBalanceIn = balanceIn.toNumber()
  const numAmountOut = amountOut.toNumber()
  const numSwapFee = swapFee.toNumber() / GENERAL_NORMALIZED_NUMBER
  const ratioBeforeAfterBalance = numBalanceOut / (numBalanceOut - numAmountOut)

  const ratioInOutWeight = weightOut / weightIn
  return new BN(
    numBalanceIn *
      (ratioBeforeAfterBalance ** ratioInOutWeight - 1) *
      (1 - numSwapFee),
  )
}

export const calcNormalizedWeight = (
  weights: BN[],
  weightToken: BN,
): number => {
  const numWeightsIn = weights.map((value) => value?.toNumber())
  const numWeightToken = weightToken?.toNumber()
  const weightSum = numWeightsIn.reduce((pre, curr) => pre + curr, 0)
  return numWeightToken / weightSum
}

export const calcSpotPrice = (
  balanceIn: BN,
  weightIn: number,
  balanceOut: BN,
  weightOut: number,
): number => {
  const numBalanceIn = balanceIn?.toNumber()

  const numBalanceOut = balanceOut?.toNumber()

  return numBalanceIn / weightIn / (numBalanceOut / weightOut)
}

export const calcMintReceiveRemoveSingleSide = (
  lptAmount: BN,
  lptSupply: BN,
  normalizeWeight: number,
  balance: BN,
  fee: BN,
) => {
  const numLptAmount = lptAmount.toNumber()
  const numLptSupply = lptSupply.toNumber()
  const numFee = fee.toNumber()
  const numBalance = balance.toNumber()

  let tbl = (numLptSupply - numLptAmount) / numLptSupply
  let amount_out = numBalance * (1 - Math.pow(tbl, 1 / normalizeWeight))
  let fee_rate = numFee / PRECISION
  let feeWithdraw = amount_out * (1 - (normalizeWeight * (fee_rate - 1) + 1))

  console.log('tbl: ', tbl)
  console.log('mount_out: ', amount_out)
  console.log('fee_rate: ', fee_rate)
  console.log('feeWithdraw: ', feeWithdraw)
  console.log('receive: ', amount_out - feeWithdraw)
  return new BN(amount_out - feeWithdraw)
}

export const calcMintReceivesRemoveFullSide = (
  lptAmount: BN,
  lptSupply: BN,
  reserves: [],
) => {
  return []
}
