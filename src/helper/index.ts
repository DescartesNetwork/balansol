import { BN, web3 } from '@coral-xyz/anchor'
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

export const fileToBase64 = (
  file: File,
  callBack: (result: string, index: number) => void,
  index: number,
) => {
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = async () => {
    if (reader.result) callBack(reader.result.toString(), index)
  }
}
export const validURL = (value: string) => {
  return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
    value,
  )
}

export const getDataWebsite = (url: string) => {
  const socialIcons: Record<string, { iconName: string; websiteName: string }> =
    {
      t: { iconName: 'logo-telegram', websiteName: 'Telegram' },
      twitter: { iconName: 'logo-twitter', websiteName: 'Twitter' },
      facebook: { iconName: 'logo-facebook', websiteName: 'Facebook' },
      discord: { iconName: 'logo-discord', websiteName: 'Discord' },
      global: { iconName: 'globe', websiteName: 'Social media' },
      medium: { iconName: 'logo-medium', websiteName: 'Medium' },
    }

  if (!validURL(url)) return socialIcons['global']

  let socialName = ''
  const domain = new URL(url)
  const host = domain.hostname.replace('www.', '')
  for (const char of host) {
    if (char === '.') break
    socialName += char
  }

  const valid = socialIcons[socialName.toLowerCase()]
  if (!valid) socialName = 'global'

  return socialIcons[socialName.toLowerCase()]
}
