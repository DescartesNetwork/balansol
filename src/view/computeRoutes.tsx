import React, { useCallback, useEffect, useState } from 'react'
import { Jupiter, RouteInfo } from '@jup-ag/core'
import { Connection, PublicKey, Keypair } from '@solana/web3.js'
import { Button } from 'antd'
import JupiterWalletWrapper from 'hooks/jupiter/jupiterWalletWrapper'
import { useWallet } from '@sentre/senhub'
import { notifyError, notifySuccess } from 'helper'

const SOLANA_RPC_ENDPOINT = 'https://solana-api.projectserum.com'

const connection = new Connection(SOLANA_RPC_ENDPOINT)
const jupiterInstance = async () => {
  const wallet = await window.sentre.wallet.getAddress()
  const jupiter = await Jupiter.load({
    connection,
    cluster: 'mainnet-beta',
    user: new PublicKey(wallet), // or public key
    // platformFeeAndAccounts:  NO_PLATFORM_FEE,
    routeCacheDuration: 10000, // Will not refetch data on computeRoutes for up to 10 seconds
  })
  return jupiter
}

export default function ComputeRoutes() {
  const [routes, setRoutes] = useState<RouteInfo[]>([])
  const {
    sentre: { wallet },
  } = window
  const {
    wallet: { address: walletAddress },
  } = useWallet()
  const getRoutes = async () => {
    try {
      const routesss = await (
        await jupiterInstance()
      ).computeRoutes({
        inputMint: new PublicKey('SENBBKVCM7homnf5RX9zqpf1GFe935hnbU4uVzY1Y6M'),
        outputMint: new PublicKey(
          'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
        ),
        amount: 1000,
        slippage: 1,
      })
      console.log('primative data: ', routesss)
      setRoutes(routesss.routesInfos)
    } catch (error) {
      console.log('The error is happened', error)
    }
  }
  useEffect(() => {
    getRoutes()
  }, [])

  const onSwap = async () => {
    try {
      const wrappedWallet = new JupiterWalletWrapper(walletAddress, wallet)
      const bestRoute = routes[0]
      const { execute } = await (
        await jupiterInstance()
      ).exchange({
        routeInfo: bestRoute,
      })
      const swapResult: any = await execute({
        wallet: wrappedWallet,
      })
      console.log('swapResult', swapResult)
      notifySuccess('Swap thanh cong', swapResult)
    } catch (err) {
      notifyError(err)
    }
  }

  return (
    <div>
      {routes.map((value) => (
        <div>{value.outAmount} amount out </div>
      ))}
      <Button onClick={onSwap}>Test Swap</Button>
    </div>
  )
}
