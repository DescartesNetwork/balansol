import { useCallback, useState } from 'react'
import { tokenProvider, useGetMintDecimals } from '@sentre/senhub'
import { BN, web3 } from '@project-serum/anchor'
import { utilsBN } from '@sen-use/web3'

import { useLaunchpad } from '../useLaunchpad'
import { notifyError } from '@sen-use/app'

import { MintActionStates, MintConfigs } from '@senswap/balancer'
import { Launchpad } from 'constant'
import { Ipfs } from 'shared/ipfs'
import configs from 'configs'

const DEFAULT_TAX_FEE = new BN(500_000) // 0.05%

export const useCreateLaunchpad = () => {
  const [loading, setLoading] = useState(false)
  const { initializeLaunchpad, activeLaunchpad } = useLaunchpad()
  const getDecimals = useGetMintDecimals()

  const getWeight = useCallback(
    (priceA: number, balanceA: number, priceB: number, balanceB) => {
      const total = priceA * balanceA + priceB * balanceB
      const weightA = (priceA * balanceA) / total
      const weightB = 1 - weightA
      return {
        weightA: utilsBN.decimalize(weightA, 9),
        weightB: utilsBN.decimalize(weightB, 9),
      }
    },
    [],
  )

  const onCreateLaunchpad = useCallback(
    async (props: Launchpad) => {
      try {
        setLoading(true)
        const {
          amount,
          mint,
          stableMint,
          projectInfo,
          startPrice,
          startTime,
          endTime,
          endPrice,
          fee,
        } = props
        const { baseAmount } = projectInfo
        const launchpad = web3.Keypair.generate()
        // const transactions: web3.Transaction[] = []
        // const provider = getAnchorProvider()!

        const baseMintDecimal = (await getDecimals({ mintAddress: mint })) || 0
        const stableDecimal =
          (await getDecimals({ mintAddress: stableMint })) || 0

        const bnAmount = utilsBN.decimalize(amount, baseMintDecimal)
        const bnBaseAmount = utilsBN.decimalize(baseAmount, stableDecimal)
        const metadata = await Ipfs.methods.launchpad.set(projectInfo)
        const swapFee = utilsBN.decimalize(fee, 9)

        /** Initialize launchpad */
        const { baseMint } = await initializeLaunchpad({
          baseAmount: bnBaseAmount,
          stableMint: new web3.PublicKey(stableMint),
          mint: new web3.PublicKey(mint),
          sendAndConfirm: true,
          launchpad,
        })
        // transactions.push(txInitLaunchpad)
        const stablePrice = (await tokenProvider.getPrice(stableMint)) || 0

        const startWeights = getWeight(
          startPrice,
          amount,
          stablePrice,
          baseAmount,
        )

        const endWeights = getWeight(endPrice, amount, stablePrice, baseAmount)

        const mintsConfigs: MintConfigs[] = [
          {
            publicKey: mint,
            action: MintActionStates.Active,
            amountIn: bnAmount,
            weight: startWeights.weightA,
          },
          {
            publicKey: baseMint,
            action: MintActionStates.Active,
            amountIn: bnBaseAmount,
            weight: startWeights.weightB,
          },
        ]

        /** Initialize Pool  */
        const { poolAddress } = await window.balansol.initializePool(
          swapFee,
          DEFAULT_TAX_FEE,
          mintsConfigs,
          configs.sol.taxmanAddress,
        )

        /** Deposit to Pool  */
        await window.balansol.initializeJoin(poolAddress, mint, bnAmount)
        await window.balansol.initializeJoin(
          poolAddress,
          baseMint,
          bnBaseAmount,
        )

        /** Active launchpad */
        await activeLaunchpad({
          pool: new web3.PublicKey(poolAddress),
          startTime: new BN(startTime / 1000),
          endTime: new BN(endTime / 1000),
          launchpad: launchpad.publicKey,
          metadata: Array.from(metadata.digest),
          sendAndConfirm: true,
          endWeights: [endWeights.weightA, endWeights.weightB],
        })
        // transactions.push(txActive)

        //  console.log('transactions: ', transactions)
        //  await provider.sendAll(transactions.map((tx) => ({ tx, signers: [] })))
        return window.notify({
          type: 'success',
          description: 'Initialized launchpad successfully!',
        })
      } catch (error) {
        notifyError(error)
      } finally {
        setLoading(false)
      }
    },
    [activeLaunchpad, getDecimals, getWeight, initializeLaunchpad],
  )

  return { onCreateLaunchpad, loading }
}
