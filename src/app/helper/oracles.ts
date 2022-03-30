import { Address, BN, web3 } from '@project-serum/anchor'
import { PoolData } from '@senswap/balancer'

import {
  GENERAL_DECIMALS,
  GENERAL_NORMALIZED_NUMBER,
  LPTDECIMALS,
} from 'app/constant'
import { PRECISION } from 'app/constant/index'
import util from '@senswap/sen-js/dist/utils'

export type PoolPairData = {
  balanceIn: BN
  balanceOut: BN
  weightIn: number
  decimalIn: number
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
  const numWeightsIn = weights.map((value) =>
    Number(util.undecimalize(BigInt(value.toString()), GENERAL_DECIMALS)),
  )
  const numWeightToken = Number(
    util.undecimalize(BigInt(weightToken.toString()), GENERAL_DECIMALS),
  )
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
  const Bo = Number(
    util.undecimalize(BigInt(poolPairData.balanceOut.toString()), LPTDECIMALS),
  )
  const Ao = Number(util.undecimalize(BigInt(amount.toString()), LPTDECIMALS))
  const wi = poolPairData.weightIn
  const Bi = Number(
    util.undecimalize(
      BigInt(poolPairData.balanceIn.toString()),
      poolPairData.decimalIn,
    ),
  )
  const f = Number(
    util.undecimalize(
      BigInt(poolPairData.swapFee.toString()),
      GENERAL_DECIMALS,
    ),
  )

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
  decimalIns: number[],
) => {
  const numTokenAmountIns = tokenAmountIns.map((value, idx) => {
    return Number(util.undecimalize(BigInt(value.toString()), decimalIns[idx]))
  })

  const amountLpOut = numTokenAmountIns.reduce((totalBptOut, amountIn, i) => {
    // Calculate amount of BPT gained per token in
    const nomalizedWeight = calcNormalizedWeight(weightIns, weightIns[i])
    const poolPairData: PoolPairData = {
      balanceIn: balanceIns[i],
      balanceOut: totalSupply,
      weightIn: nomalizedWeight,
      decimalIn: decimalIns[i],
      swapFee: new BN(0),
    }
    const LpPrice = spotPriceAfterSwapTokenInForExactBPTOut(
      new BN(0),
      poolPairData,
    )
    // Multiply by amountIn to get contribution to total bpt out
    const LpOut = amountIn / LpPrice
    return totalBptOut + LpOut
  }, 0)
  return amountLpOut
}

export const calcBptOutGivenExactTokensIn = (
  tokenAmountIns: BN[],
  balanceIns: BN[],
  weightIns: BN[],
  totalSupply: BN,
  decimalIns: number[],
  swapFee: BN,
) => {
  const fee = Number(
    util.undecimalize(BigInt(swapFee.toString()), GENERAL_DECIMALS),
  )
  const numTotalSupply = Number(
    util.undecimalize(BigInt(totalSupply.toString()), LPTDECIMALS),
  )
  const balanceRatiosWithFee = new Array(tokenAmountIns.length)

  let invariantRatioWithFees = 0
  for (let i = 0; i < tokenAmountIns.length; i++) {
    const balanceIn = Number(
      util.undecimalize(BigInt(balanceIns[i].toString()), decimalIns[i]),
    )
    const amountIn = Number(
      util.undecimalize(BigInt(tokenAmountIns[i].toString()), decimalIns[i]),
    )
    const nomalizedWeight = calcNormalizedWeight(weightIns, weightIns[i])

    balanceRatiosWithFee[i] = (balanceIn + amountIn) / balanceIn

    invariantRatioWithFees += balanceRatiosWithFee[i] * nomalizedWeight
  }

  let invariantRatio = 1

  for (let i = 0; i < tokenAmountIns.length; i++) {
    const balanceIn = Number(
      util.undecimalize(BigInt(balanceIns[i].toString()), decimalIns[i]),
    )
    const amountIn = Number(
      util.undecimalize(BigInt(tokenAmountIns[i].toString()), decimalIns[i]),
    )
    const nomalizedWeight = calcNormalizedWeight(weightIns, weightIns[i])
    let amountInWithoutFee = amountIn
    if (balanceRatiosWithFee[i] > invariantRatioWithFees) {
      let nonTaxableAmount = balanceIn * (invariantRatioWithFees - 1)
      let taxableAmount = amountIn - nonTaxableAmount
      amountInWithoutFee = nonTaxableAmount + taxableAmount * (1 - fee)
    }
    let balanceRatio = (balanceIn + amountInWithoutFee) / balanceIn
    invariantRatio = invariantRatio * balanceRatio ** nomalizedWeight
  }
  if (invariantRatio > 1) return numTotalSupply * (invariantRatio - 1)
  return 0
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
