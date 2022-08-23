import { useCallback, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { web3, BN } from '@project-serum/anchor'
import { useJupiter } from '@jup-ag/react-hook'
import { rpc, useWalletAddress } from '@sentre/senhub'
import { useDebounce } from 'react-use'

import { AppState } from 'model'

import JupiterWalletWrapper from 'hooks/jupiter/jupiterWalletWrapper'
import { SwapPlatform, RouteSwapInfo, SwapProvider } from 'hooks/useSwap'
import { useOracles } from '../useOracles'
import { utilsBN } from 'helper/utilsBN'

const connection = new web3.Connection(rpc)

interface UseJupiterProps {
  amount: number
  inputMint: web3.PublicKey | undefined
  outputMint: web3.PublicKey | undefined
  slippage: number
  debounceTime?: number
}

const DEFAULT_JUPITER_PROPS = {
  amount: 0,
  inputMint: undefined,
  outputMint: undefined,
  slippage: 0,
  debounceTime: 250,
}

const DEFAULT_EMPTY_ROUTE = {
  route: [],
  bidAmount: 0,
  askAmount: 0,
  priceImpact: 0,
}

export const useJupiterAggregator = (): SwapProvider => {
  const [bestRouteInfo, setBestRouteInfo] =
    useState<RouteSwapInfo>(DEFAULT_EMPTY_ROUTE)
  const [jupiterProps, setJupiterProps] = useState<UseJupiterProps>({
    ...DEFAULT_JUPITER_PROPS,
  })
  const { bidMint, askMint, bidAmount, slippageTolerance, isReverse } =
    useSelector((state: AppState) => state.swap)
  const walletAddress = useWalletAddress()
  const { decimalizeMintAmount, undecimalizeMintAmount } = useOracles()
  const { exchange, routes, loading } = useJupiter(jupiterProps)

  const composeJupiterProps = useCallback(async () => {
    if (!bidMint || !askMint || !Number(bidAmount) || isReverse)
      return setJupiterProps({ ...DEFAULT_JUPITER_PROPS })
    const bidAmountBN = await decimalizeMintAmount(bidAmount, bidMint)
    setJupiterProps({
      amount: utilsBN.toNumber(bidAmountBN),
      inputMint: new web3.PublicKey(bidMint),
      outputMint: new web3.PublicKey(askMint),
      slippage: slippageTolerance,
      debounceTime: 250,
    })
  }, [
    askMint,
    bidAmount,
    bidMint,
    decimalizeMintAmount,
    isReverse,
    slippageTolerance,
  ])
  useDebounce(() => composeJupiterProps(), 300, [composeJupiterProps])

  const composeBestRoute = useCallback(async () => {
    const bestJupiterRoute = routes?.[0]
    if (
      !bidMint ||
      !askMint ||
      !Number(bidAmount) ||
      isReverse ||
      !bestJupiterRoute
    )
      return setBestRouteInfo(DEFAULT_EMPTY_ROUTE)

    const route = bestJupiterRoute.marketInfos.map((market) => {
      return {
        bidAmount: new BN(market.inAmount.toString()),
        bidMint: market.inputMint.toBase58(),
        askAmount: new BN(market.outAmount.toString()),
        askMint: market.outputMint.toBase58(),
        pool: '',
        priceImpact: market.priceImpactPct,
      }
    })

    const inAmount = await undecimalizeMintAmount(
      new BN(bestJupiterRoute.inAmount.toString()),
      bidMint,
    )
    const outAmount = await undecimalizeMintAmount(
      new BN(bestJupiterRoute.outAmount.toString()),
      askMint,
    )

    return setBestRouteInfo({
      route,
      bidAmount: Number(inAmount),
      askAmount: Number(outAmount),
      priceImpact: bestJupiterRoute.priceImpactPct,
    })
  }, [askMint, bidAmount, bidMint, isReverse, routes, undecimalizeMintAmount])
  useDebounce(() => composeBestRoute(), 300, [composeBestRoute])

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

  return useMemo(() => {
    return {
      ...bestRouteInfo,
      swap,
      platform: SwapPlatform.Jupiter,
      loading: !Number(bidAmount) ? false : loading,
    }
  }, [bestRouteInfo, bidAmount, loading, swap])
}
