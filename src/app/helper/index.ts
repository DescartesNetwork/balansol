import { BN } from '@project-serum/anchor'
import { PoolData } from '@senswap/balancer'
import { utils } from '@senswap/sen-js'
import { DepositInfo } from 'app/constant'
import { explorer } from 'shared/util'
import { getMintInfo } from './oracles'

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

export const checkDepositInfo = (
  deposits: DepositInfo[],
  poolData: PoolData,
) => {
  const noneZeroAmouts = deposits.filter((value) => {
    return !!value.amount && Number(value.amount) !== 0
  })

  if (noneZeroAmouts.length === 0) return false

  for (let i in noneZeroAmouts) {
    const mintInfo = getMintInfo(poolData, noneZeroAmouts[i].address)
    if (!mintInfo?.reserve || !mintInfo.normalizedWeight) return false
  }

  return true
}
