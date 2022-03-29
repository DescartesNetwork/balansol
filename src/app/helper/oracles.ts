import { Address, BN, web3 } from '@project-serum/anchor'
import { PoolData } from '@senswap/balancer'

import { GENERAL_NORMALIZED_NUMBER } from 'app/constant'
import { PRECISION } from 'app/constant/index'

export type PoolPairData = {
  balanceIn: BN
  balanceOut: BN
  weightIn: number
  swapFee: BN
}

export type MintInfo = {
  reserve: BN
  normalizedWeight: number
  treasury: web3.PublicKey
}

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

export const calcTotalSupplyPool = (reserves: string[], weights: string[]) => {
  return valueFunction(reserves, weights) * reserves.length
}

export const calcLpOutGivenIn = (
  amountIn: number,
  balanceIn: number,
  totalSupply: number,
) => {
  return (amountIn / balanceIn - 1) * totalSupply - totalSupply
}

export const calcBptOutGivenExactTokensIn = (
  tokenAmountIns: number[],
  balanceIns: number[],
  weightIns: number[],
  totalSupply: number,
  swapFee: number,
) => {
  const balanceRatiosWithFee = new Array(tokenAmountIns.length)

  let invariantRatioWithFees = 0
  for (let i = 0; i < tokenAmountIns.length; i++) {
    balanceRatiosWithFee[i] =
      (balanceIns[i] + tokenAmountIns[i]) / balanceIns[i]
    invariantRatioWithFees =
      invariantRatioWithFees + balanceRatiosWithFee[i] * weightIns[i]
  }

  let invariantRatio = 1

  for (let i = 0; i < tokenAmountIns.length; i++) {
    let amountInWithoutFee = tokenAmountIns[i]

    if (balanceRatiosWithFee[i] > invariantRatioWithFees) {
      let nonTaxableAmount = balanceIns[i] * (invariantRatioWithFees - 1)
      let taxableAmount = tokenAmountIns[i] - nonTaxableAmount
      amountInWithoutFee = nonTaxableAmount + taxableAmount * (1 - swapFee)
    }

    let balanceRatio = (balanceIns[i] + amountInWithoutFee) / balanceIns[i]
    invariantRatio = invariantRatio * balanceRatio ** weightIns[i]
  }
  if (invariantRatio > 1) return totalSupply * (invariantRatio - 1)
  return 0
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
  const numBalanceIn = balanceIn.toNumber()

  const numBalanceOut = balanceOut.toNumber()

  return numBalanceIn / weightIn / (numBalanceOut / weightOut)
}

export const calcSpotPrice2 = (
  balanceIn: number,
  weightIn: number,
  balanceOut: number,
  weightOut: number,
): number => {
  const numBalanceIn = balanceIn

  const numBalanceOut = balanceOut

  return numBalanceIn / weightIn / (numBalanceOut / weightOut)
}

export const calcSpotPriceDueFee = (
  balanceIn: number,
  weightIn: number,
  balanceOut: number,
  weightOut: number,
  fee: number,
) => {
  const normalSpotPrice = calcSpotPrice2(
    balanceIn,
    weightIn,
    balanceOut,
    weightOut,
  )
  const BNFee = fee / GENERAL_NORMALIZED_NUMBER
  return normalSpotPrice / (1 - (BNFee - BNFee * weightIn))
}

export const spotPriceAfterSwapTokenInForExactBPTOut = (
  amount: BN,
  poolPairData: PoolPairData,
) => {
  const Bo = poolPairData.balanceOut.toNumber() / 10 ** 9
  const Ao = amount.toNumber() / 10 ** 9
  const wi = poolPairData.weightIn
  const Bi = poolPairData.balanceIn.toNumber() / 10 ** 9
  const f = poolPairData.swapFee.toNumber() / 10 ** 9
  console.log(Bo, Ao, wi, Bi, f, 'stat in cal spot price')

  return (
    (Math.pow((Ao + Bo) / Bo, 1 / wi) * Bi) /
    ((Ao + Bo) * (1 + f * (-1 + wi)) * wi)
  )
}

export const caclLpForTokensZeroPriceImpact = (
  tokenAmountIns: BN[],
  balanceIns: BN[],
  weightIns: BN[],
  totalSupply: BN,
  swapFee: BN,
): BN => {
  const amountLpOut = tokenAmountIns.reduce((totalBptOut, amountIn, i) => {
    // Calculate amount of BPT gained per token in
    console.log(weightIns[i].toNumber(), 'amount in ')
    const nomalizedWeight = calcNormalizedWeight(weightIns, weightIns[i])
    const poolPairData: PoolPairData = {
      balanceIn: balanceIns[i],
      balanceOut: totalSupply,
      weightIn: nomalizedWeight,
      swapFee: swapFee,
    }
    const LpPrice = spotPriceAfterSwapTokenInForExactBPTOut(
      new BN(0),
      poolPairData,
    )
    console.log(LpPrice, 'Lp pricess ')
    // Multiply by amountIn to get contribution to total bpt out
    const LpOut = amountIn.toNumber() / LpPrice
    return totalBptOut + LpOut
  }, 0)
  return new BN(amountLpOut)
}

export const calcMintReceiveRemoveSingleSide = (
  lptAmount: BN,
  lptSupply: BN,
  normalizeWeight: number,
  balance: BN,
  fee: BN,
) => {
  if (lptAmount.gt(lptSupply)) return new BN(0)
  const numLptAmount = lptAmount.toNumber()
  const numLptSupply = lptSupply.toNumber()
  const numFee = fee.toNumber()
  const numBalance = balance.toNumber()

  let tbl = (numLptSupply - numLptAmount) / numLptSupply
  let amount_out = numBalance * (1 - Math.pow(tbl, 1 / normalizeWeight))
  let fee_rate = numFee / PRECISION
  let feeWithdraw = amount_out * (1 - (normalizeWeight * (fee_rate - 1) + 1))

  return new BN(amount_out - feeWithdraw)
}

export const calcMintReceivesRemoveFullSide = (
  lptAmount: BN,
  lptSupply: BN,
  reserves: BN[],
) => {
  const numLptAmount = lptAmount.toNumber()
  const numLptSupply = lptSupply.toNumber()

  let lpt_rate = numLptAmount / numLptSupply
  let amounts_out: BN[] = reserves.map((reserve) => {
    return new BN(lpt_rate * Number(reserve))
  })
  return amounts_out
}
