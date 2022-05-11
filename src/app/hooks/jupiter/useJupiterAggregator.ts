import { useCallback, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { web3 } from '@project-serum/anchor'
import { useJupiter } from '@jup-ag/react-hook'
import { Connection } from '@solana/web3.js'
import { useWallet } from '@senhub/providers'

import configs from 'app/configs'
import { AppState } from 'app/model'

import JupiterWalletWrapper from 'app/hooks/jupiter/jupiterWalletWrapper'
import {
  SwapPlatform,
  RouteSwapInfo,
  SwapPlatformInfo,
} from 'app/hooks/useSwap'

const {
  sol: { node },
} = configs
const connection = new Connection(node)

let timeout: NodeJS.Timeout

export const useJupiterAggregator = (): SwapPlatformInfo => {
  const {
    swap: { bidMint, askMint, bidAmount, slippageTolerance },
  } = useSelector((state: AppState) => state)
  const {
    wallet: { address: walletAddress },
  } = useWallet()

  const inputMint = useMemo(
    () => (!!bidMint ? new web3.PublicKey(bidMint) : undefined),
    [bidMint],
  )
  const outputMint = useMemo(
    () => (!!askMint ? new web3.PublicKey(askMint) : undefined),
    [askMint],
  )

  const { exchange, routes, loading, refresh } = useJupiter({
    amount: Number(bidAmount),
    inputMint,
    outputMint,
    slippage: slippageTolerance,
    debounceTime: 1500,
  })

  const swap = useCallback(async () => {
    const {
      sentre: { wallet },
    } = window
    if (!wallet) throw new Error('Wallet is not connected')
    if (!routes?.length) throw new Error('No available route')

    const wrappedWallet = new JupiterWalletWrapper(walletAddress, wallet)
    const result: any = await exchange({
      wallet: wrappedWallet,
      routeInfo: routes[0],
      onTransaction: async (txid: string) => {
        await connection.confirmTransaction(txid, 'confirmed')
        return await connection.getTransaction(txid, {
          commitment: 'confirmed',
        })
      },
    })
    if (result.error) throw new Error(result.error?.message || 'Unknown Error')
    const { txid, outputAddress } = result
    return { txId: txid, dstAddress: outputAddress }
  }, [exchange, routes, walletAddress])

  const bestRouteInfo: RouteSwapInfo = useMemo(() => {
    return {
      route: [],
      bidAmount: 0,
      askAmount: 0,
      priceImpact: 0,
    }
  }, [])

  useEffect(() => {
    if (!!bidAmount && Number(bidAmount) > 0 && !loading && !routes?.length) {
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(() => {
        console.log('refresh ne')
        refresh()
      }, 1000)
    }
  }, [bidAmount, loading, refresh, routes?.length])

  return useMemo(() => {
    return { ...bestRouteInfo, swap, platform: SwapPlatform.Jupiter, loading }
  }, [bestRouteInfo, loading, swap])
}
