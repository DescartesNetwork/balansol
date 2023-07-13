import { useCallback } from 'react'
import {
  getAnchorProvider,
  tokenProvider,
  useGetMintDecimals,
} from '@sentre/senhub'
import { BN, web3 } from '@coral-xyz/anchor'
import { utilsBN } from '@sen-use/web3'

import { MintActionStates, MintConfigs } from '@senswap/balancer'
import { Launchpad } from 'constant'
import { Ipfs } from 'shared/ipfs'
import configs from 'configs'

const DEFAULT_TAX_FEE = new BN(500_000) // 0.05%

export const useCreateLaunchpad = () => {
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
      const { amount, mint, endTime, endPrice, fee } = props
      const { stableMint, projectInfo, startPrice, startTime } = props
      const { baseAmount } = projectInfo
      const launchpad = web3.Keypair.generate()
      const transactions: web3.Transaction[] = []
      const transactionsInit: web3.Transaction[] = []

      const baseMintDecimal = (await getDecimals({ mintAddress: mint })) || 0
      const stableDecimal =
        (await getDecimals({ mintAddress: stableMint })) || 0

      const bnAmount = utilsBN.decimalize(amount, baseMintDecimal)
      const bnBaseAmount = utilsBN.decimalize(baseAmount, stableDecimal)
      const metadata = await Ipfs.methods.launchpad.set(projectInfo)
      const swapFee = utilsBN.decimalize(fee, 9)
      const provider = getAnchorProvider()!
      provider.opts.skipPreflight = true

      /** Initialize launchpad */
      const { tx: txInitLaunchpad } =
        await window.launchpad.initializeLaunchpad({
          baseAmount: bnBaseAmount,
          stableMint: new web3.PublicKey(stableMint),
          mint: new web3.PublicKey(mint),
          sendAndConfirm: true,
          launchpad,
        })
      transactionsInit.push(txInitLaunchpad)

      const baseMint = await window.launchpad.deriveBaseMintAddress(
        launchpad.publicKey,
      )
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
      const { poolAddress, tx: txInitPool } =
        await window.balansol.initializePool({
          fee: swapFee,
          taxFee: DEFAULT_TAX_FEE,
          mintsConfigs,
          taxMan: configs.sol.taxmanAddress,
          sendAndConfirm: true,
        })
      transactionsInit.push(txInitPool)

      /** Join to Pool  */
      const { transaction: txMintJoin } = await window.balansol.initializeJoin({
        poolAddress,
        mint,
        amountIn: bnAmount,
        sendAndConfirm: false,
      })

      const { transaction: txBaseMintJoin } =
        await window.balansol.initializeJoin({
          poolAddress,
          mint: baseMint,
          amountIn: bnBaseAmount,
          sendAndConfirm: false,
        })
      transactions.push(txMintJoin)
      transactions.push(txBaseMintJoin)

      //Update action
      const { tx: txUpdateAction } = await window.balansol.updateActions({
        poolAddress,
        actions: [MintActionStates.AskOnly, MintActionStates.BidOnly],
        sendAndConfirm: false,
      })
      transactions.push(txUpdateAction)

      //Transfer pool Owner
      const treasurer = await window.launchpad.deriveTreasurerAddress(
        launchpad.publicKey,
      )
      const { tx: txTransfer } = await window.balansol.transferOwnership({
        poolAddress,
        newOwner: treasurer,
        sendAndConfirm: false,
      })
      transactions.push(txTransfer)

      /** Active launchpad */
      const { tx: txActive } = await window.launchpad.activeLaunchpad({
        pool: new web3.PublicKey(poolAddress),
        startTime: new BN(startTime / 1000),
        endTime: new BN(endTime / 1000),
        launchpad: launchpad.publicKey,
        metadata: Array.from(metadata.digest),
        endWeights: [endWeights.weightA, endWeights.weightB],
        sendAndConfirm: false,
      })
      transactions.push(txActive)

      await provider.sendAll(transactions.map((tx) => ({ tx, signers: [] })))
      return window.notify({
        type: 'success',
        description: 'Initialized launchpad successfully!',
      })
    },
    [getDecimals, getWeight],
  )

  return { onCreateLaunchpad }
}
