import { BN } from '@project-serum/anchor'

export function valueFunction(reserves: string[], weights: string[]): number {
  const reservesInNumber = reserves.map((value) => Number(value))
  const weightInNumber = weights.map((value) => Number(value))
  const sumWeight = weightInNumber.reduce(
    (previousValue, currentValue) => previousValue + currentValue,
  )
  return reservesInNumber.reduce((previousValue, currentValue, currenIndex) => {
    const nomalizeWeight = weightInNumber[currenIndex] / sumWeight
    return previousValue * currentValue ** nomalizeWeight
  }, 1)
}

export function calTotalSupplyPool(
  reserves: string[],
  weights: string[],
): number {
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

export function calOutGivenInSwap(
  amountIn: BN,
  balanceOut: BN,
  balanceIn: BN,
  weightOut: number,
  weightIn: number,
  swapFee: BN,
): number {
  const numBalanceOut = balanceOut.toNumber()
  const numBalanceIn = balanceIn.toNumber()
  const numAmountIn = amountIn.toNumber()
  const numSwapFee = swapFee.toNumber() / 10 ** 9
  const ratioBeforeAfterBalance = numBalanceIn / (numBalanceIn + numAmountIn)

  const ratioInOutWeight = weightIn / weightOut
  return (
    numBalanceOut *
    (1 - ratioBeforeAfterBalance ** ratioInOutWeight) *
    (1 - numSwapFee)
  )
}

export function calWeightToken(weights: BN[], weightToken: BN): number {
  const numWeightsIn = weights.map((value) => value?.toNumber())
  const numWeightToken = weightToken?.toNumber()
  const weightSum = numWeightsIn.reduce((pre, curr) => pre + curr, 0)
  return numWeightToken / weightSum
}

export function calSpotPrice(
  balanceIn: BN,
  weightIn: BN,
  balanceOut: BN,
  weightOut: BN,
): number {
  const numBalanceIn = balanceIn?.toNumber()
  const numWeightIn = weightIn?.toNumber()
  const numBalanceOut = balanceOut?.toNumber()
  const numWeightOut = weightOut?.toNumber()
  return numBalanceIn / numWeightIn / (numBalanceOut / numWeightOut)
}
