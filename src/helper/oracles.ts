import { Address, BN, web3 } from '@coral-xyz/anchor'
import { PoolData } from '@senswap/balancer'
import util from '@senswap/sen-js/dist/utils'

import {
  GENERAL_DECIMALS,
  GENERAL_NORMALIZED_NUMBER,
  LPTDECIMALS,
  PoolPairData,
  PoolPairLpData,
} from 'constant'
import { PRECISION } from 'constant/index'
import { RouteInfo } from 'hooks/useSwap'
import { utilsBN } from './utilsBN'

export type routeFullInfo = RouteInfo & { poolData: PoolData }

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

const complement = (value: number) => {
  return value < 1 ? 1 - value : 0
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
  const numBalanceOut = utilsBN.toNumber(balanceOut)
  const numBalanceIn = utilsBN.toNumber(balanceIn)
  const numAmountIn = utilsBN.toNumber(amountIn)
  const numSwapFee = utilsBN.toNumber(swapFee) / GENERAL_NORMALIZED_NUMBER
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
  const numBalanceOut = utilsBN.toNumber(balanceOut)
  const numBalanceIn = utilsBN.toNumber(balanceIn)
  const numSwapFee = utilsBN.toNumber(swapFee) / GENERAL_NORMALIZED_NUMBER
  const numAmountOut = utilsBN.toNumber(amountOut) / (1 - numSwapFee)
  const ratioBeforeAfterBalance = numBalanceOut / (numBalanceOut - numAmountOut)

  const ratioInOutWeight = weightOut / weightIn

  return new BN(
    numBalanceIn * (ratioBeforeAfterBalance ** ratioInOutWeight - 1),
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
  decimalIn: number,
  balanceOut: BN,
  weightOut: number,
  decimalOut: number,
): number => {
  const numBalanceIn = Number(
    util.undecimalize(BigInt(balanceIn.toString()), decimalIn),
  )

  const numBalanceOut = Number(
    util.undecimalize(BigInt(balanceOut.toString()), decimalOut),
  )

  return numBalanceIn / weightIn / (numBalanceOut / weightOut)
}

export const spotPriceAfterSwapTokenInForExactBPTOut = (
  amount: BN,
  poolPairData: PoolPairLpData,
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

function calcSpotPriceExactInSwap(amount: BN, poolPairData: PoolPairData) {
  const {
    balanceIn,
    decimalIn,
    balanceOut,
    decimalOut,
    weightIn,
    weightOut,
    swapFee,
  } = poolPairData
  const Bi = Number(util.undecimalize(BigInt(balanceIn.toString()), decimalIn))
  const Bo = Number(
    util.undecimalize(BigInt(balanceOut.toString()), decimalOut),
  )
  const wi = weightIn
  const wo = weightOut
  const Ai = Number(util.undecimalize(BigInt(amount.toString()), decimalIn))
  const f = Number(
    util.undecimalize(BigInt(swapFee.toString()), GENERAL_DECIMALS),
  )
  return -(
    (Bi * wo) /
    (Bo * (-1 + f) * (Bi / (Ai + Bi - Ai * f)) ** ((wi + wo) / wo) * wi)
  )
}

export const calcPriceImpactSwap = (
  bidAmount: BN,
  poolPairData: PoolPairData,
) => {
  const currentSpotPrice = calcSpotPriceExactInSwap(new BN(0), poolPairData)
  const spotPriceAfterSwap = calcSpotPriceExactInSwap(bidAmount, poolPairData)
  if (spotPriceAfterSwap < currentSpotPrice) return 0
  const impactPrice = 1 - currentSpotPrice / spotPriceAfterSwap
  return impactPrice
}

export const calcLpForTokensZeroPriceImpact = (
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
    const poolPairData: PoolPairLpData = {
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
  const numBalanceIns = balanceIns.map((value, idx) =>
    Number(util.undecimalize(BigInt(value.toString()), decimalIns[idx])),
  )
  const numAmountIns = tokenAmountIns.map((value, idx) =>
    Number(util.undecimalize(BigInt(value.toString()), decimalIns[idx])),
  )
  const balanceRatiosWithFee = new Array(tokenAmountIns.length)

  let invariantRatioWithFees = 0
  for (let i = 0; i < tokenAmountIns.length; i++) {
    const nomalizedWeight = calcNormalizedWeight(weightIns, weightIns[i])

    balanceRatiosWithFee[i] =
      (numBalanceIns[i] + numAmountIns[i]) / numBalanceIns[i]

    invariantRatioWithFees += balanceRatiosWithFee[i] * nomalizedWeight
  }

  let invariantRatio = 1

  for (let i = 0; i < tokenAmountIns.length; i++) {
    const nomalizedWeight = calcNormalizedWeight(weightIns, weightIns[i])
    let amountInWithoutFee = numAmountIns[i]
    if (balanceRatiosWithFee[i] > invariantRatioWithFees) {
      let nonTaxableAmount = numBalanceIns[i] * (invariantRatioWithFees - 1)
      let taxableAmount = numAmountIns[i] - nonTaxableAmount
      amountInWithoutFee = nonTaxableAmount + taxableAmount * (1 - fee)
    }
    let balanceRatio =
      (numBalanceIns[i] + amountInWithoutFee) / numBalanceIns[i]
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
  decimalOut: number,
  fee: BN,
): BN => {
  if (lptAmount.gt(lptSupply)) return new BN(0)
  const numLptAmount = Number(
    util.undecimalize(BigInt(lptAmount.toString()), LPTDECIMALS),
  )
  const numLptSupply = Number(
    util.undecimalize(BigInt(lptSupply.toString()), LPTDECIMALS),
  )
  const numFee = Number(
    util.undecimalize(BigInt(fee.toString()), GENERAL_DECIMALS),
  )
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

export const calcDepositPriceImpact = (
  amountIns: BN[],
  balanceIns: BN[],
  weightIns: BN[],
  totalSupply: BN,
  decimalIns: number[],
  swapFee: BN,
) => {
  if (decimalIns.length === 0) return { lpOut: 0, impactPrice: 0 }

  const lpOut = Number(
    calcBptOutGivenExactTokensIn(
      amountIns,
      balanceIns,
      weightIns,
      totalSupply,
      decimalIns,
      swapFee,
    ).toFixed(9),
  )

  const lpOutZeroPriceImpact = Number(
    calcLpForTokensZeroPriceImpact(
      amountIns,
      balanceIns,
      weightIns,
      totalSupply,
      decimalIns,
    ).toFixed(9),
  )

  const impactPrice = 1 - lpOut / lpOutZeroPriceImpact

  return { lpOut, impactPrice: impactPrice || 0 }
}

const calcTokenOutGivenExactLpIn = (
  balance: BN,
  normalizedWeight: number,
  lpAmountIn: BN,
  lpTotalSupply: BN,
  decimal: number,
  swapFee: BN,
) => {
  const numBalance = Number(
    util.undecimalize(BigInt(balance.toString()), decimal),
  )
  const numAmountIn = Number(
    util.undecimalize(BigInt(lpAmountIn.toString()), LPTDECIMALS),
  )
  const numTotalSupply = Number(
    util.undecimalize(BigInt(lpTotalSupply.toString()), LPTDECIMALS),
  )

  const numSwapFee = Number(
    util.undecimalize(BigInt(swapFee.toString()), GENERAL_DECIMALS),
  )

  const invariantRatio = (numTotalSupply - numAmountIn) / numTotalSupply
  // Calculate by how much the token balance has to increase to cause `invariantRatio`
  const balanceRatio = invariantRatio ** (1 / normalizedWeight)
  // Because of rounding up, `balanceRatio` can be greater than one, so we use its complement
  const amountOutWithoutFee = numBalance * complement(balanceRatio)
  // We can now compute how much excess balance is being withdrawn as a result of the virtual swaps,
  // which result in swap fees
  const taxablePercentage = complement(normalizedWeight)
  // Swap fees are typically charged on 'tokenIn', but there is no 'tokenIn' here, so we apply it
  // to 'tokenOut' - this results in slightly larger price impact (fees are rounded up)
  const taxableAmount = amountOutWithoutFee * taxablePercentage
  const nonTaxableAmount = amountOutWithoutFee - taxableAmount
  return nonTaxableAmount + taxableAmount * complement(numSwapFee)
}

export const calcWithdrawPriceImpact = (
  lpAmount: BN,
  indexTokenOut: number,
  balanceOuts: BN[],
  weightOuts: BN[],
  totalSupply: BN,
  decimalOuts: number[],
  swapFee: BN,
) => {
  if (decimalOuts.length === 0 || lpAmount.isZero())
    return { lpOut: 0, impactPrice: 0 }
  let tokenAmountOut = new BN(0)
  const tokenAmounts = balanceOuts.map((_, idx) => {
    if (indexTokenOut !== idx) {
      return new BN(0)
    }
    const normalizedWeight = calcNormalizedWeight(weightOuts, weightOuts[idx])
    const tokenAmount = calcTokenOutGivenExactLpIn(
      balanceOuts[idx],
      normalizedWeight,
      lpAmount,
      totalSupply,
      decimalOuts[idx],
      swapFee,
    )

    tokenAmountOut = new BN(
      util.decimalize(tokenAmount, decimalOuts[idx]).toString(),
    )
    return tokenAmountOut
  })

  const lpOutZeroPriceImpact = Number(
    calcLpForTokensZeroPriceImpact(
      tokenAmounts,
      balanceOuts,
      weightOuts,
      totalSupply,
      decimalOuts,
    ).toFixed(9),
  )

  const numLpAmount = Number(
    util.undecimalize(BigInt(lpAmount.toString()), LPTDECIMALS),
  )
  if (numLpAmount < lpOutZeroPriceImpact)
    return { tokenAmountOut, impactPrice: 0 }
  const impactPrice = numLpAmount / lpOutZeroPriceImpact - 1

  return { tokenAmountOut, impactPrice }
}

export const calcPriceImpact = (route: routeFullInfo[]) => {
  let p = 1
  route.forEach((elmInfo) => {
    const s = elmInfo.priceImpact
    p = p * (1 - s)
  })
  return 1 - p
}
