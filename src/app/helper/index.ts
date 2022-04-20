import { BN } from '@project-serum/anchor'

import { utils } from '@senswap/sen-js'
import { PriceImpact } from 'app/constant'
import { explorer } from 'shared/util'

export const notifySuccess = (content: string, txId: string) => {
  return window.notify({
    type: 'success',
    description: `${content} successfully. Click to view details.`,
    onClick: () => window.open(explorer(txId), '_blank'),
  })
}

export const notifyError = (er: any) => {
  return window.notify({
    type: 'error',
    description: er.message,
  })
}

export const undecimalizeWrapper = (value: BN, decimals: number) => {
  const valueInBigInt = BigInt(value.toString())

  return utils.undecimalize(valueInBigInt, decimals)
}

export const priceImpactColor = (priceImpact: number) => {
  if (!priceImpact || priceImpact < PriceImpact.goodSwap) return '#14E041'
  if (priceImpact > PriceImpact.acceptableSwap) return '#D72311'
  return '#FA8C16'
}
