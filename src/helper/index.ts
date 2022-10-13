import { BN, web3 } from '@project-serum/anchor'
import { util } from '@sentre/senhub'
import { utils } from '@senswap/sen-js'
import { MintActionState } from '@senswap/balancer'
import {
  NATIVE_MINT,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createCloseAccountInstruction,
} from '@solana/spl-token-v3'

import { PriceImpact } from 'constant'
import axios from 'axios'
import configs from 'configs'

export const notifySuccess = (content: string, txId: string) => {
  return window.notify({
    type: 'success',
    description: `${content} successfully. Click to view details.`,
    onClick: () => window.open(util.explorer(txId), '_blank'),
  })
}

export const notifyError = (er: any) => {
  console.log('er', er)
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

export const getMintState = (mintStates: MintActionState[], idx: number) =>
  Object.keys(mintStates[idx])[0]

export const createATAIx = async (wallet: web3.PublicKey) => {
  const ATA = await getAssociatedTokenAddress(NATIVE_MINT, wallet)

  return createAssociatedTokenAccountInstruction(
    wallet,
    ATA,
    wallet,
    NATIVE_MINT,
  )
}

export const createWrapSolIx = async (
  amount: number | bigint,
  wallet: web3.PublicKey,
) => {
  const ATA = await getAssociatedTokenAddress(NATIVE_MINT, wallet)

  return web3.SystemProgram.transfer({
    fromPubkey: wallet,
    toPubkey: ATA,
    lamports: amount,
  })
}

export const createUnWrapSolIx = async (wallet: web3.PublicKey) => {
  const ATA = await getAssociatedTokenAddress(NATIVE_MINT, wallet)

  return createCloseAccountInstruction(ATA, wallet, wallet)
}

export const fetchServerTVL = async (): Promise<
  { address: string; tvl: number }[]
> => {
  const { data } = await axios.get(configs.api.version.detailTvl)
  const balansolPoolTVL = data['balansol']
  return balansolPoolTVL
}
