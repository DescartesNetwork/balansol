import { useCallback } from 'react'
import { tokenProvider, useGetMintDecimals, util } from '@sentre/senhub'
import { Address, BN } from '@project-serum/anchor'
import { utilsBN } from '@sen-use/web3'

import Memo from 'helper/memo'

const USDC_ADDRESS = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'

export const getJupiterPrice = async (
  mintAddress: string,
  decimals: number,
) => {
  try {
    const priceUrl = `https://quote-api.jup.ag/v4/quote?inputMint=${USDC_ADDRESS}&outputMint=${mintAddress}&amount=1000000&slippage=1`
    const { data } = await Memo.call(
      'getJupiterPrice' + mintAddress,
      async () => (await fetch(priceUrl)).json(),
    )
    const outAmount = new BN(data[0].outAmount)
    const outAmountUI = await utilsBN.undecimalize(outAmount, decimals)
    return 1 / Number(outAmountUI)
  } catch (error) {
    return 0
  }
}

export const getCgkPrice = async (mintAddress: string) => {
  try {
    const price = await Memo.call('getCgkPrice' + mintAddress, async () => {
      const token = await tokenProvider.findByAddress(mintAddress)
      const ticket = token?.extensions?.coingeckoId
      const cgkData = await util.fetchCGK(ticket)
      return cgkData.price as number
    })
    return price
  } catch (error) {
    return 0
  }
}

export const useGetMintPrice = () => {
  const getMintDecimals = useGetMintDecimals()

  const getPrice = useCallback(
    async (mintAddress: Address) => {
      const cgkPrice = await getCgkPrice(mintAddress.toString())
      if (!!Number(cgkPrice)) return cgkPrice

      const decimals = await getMintDecimals({
        mintAddress: mintAddress.toString(),
      })
      return getJupiterPrice(mintAddress.toString(), decimals!)
    },
    [getMintDecimals],
  )

  return getPrice
}

export const useGetTotalValue = () => {
  const getMintDecimals = useGetMintDecimals()
  const getPrice = useGetMintPrice()

  const getTotalValue = useCallback(
    async (mintAddress: Address, amountBN: BN): Promise<number> => {
      try {
        if (!amountBN.gt(new BN(0))) return 0
        const price = await getPrice(mintAddress)
        if (!price) return 0
        const decimals = await getMintDecimals({
          mintAddress: mintAddress.toString(),
        })
        const amount = utilsBN.undecimalize(amountBN, decimals || 0)
        return Number(amount) * price
      } catch (error) {
        return 0
      }
    },
    [getMintDecimals, getPrice],
  )

  return getTotalValue
}
