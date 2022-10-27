import { useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import { getAnchorProvider, useGetMintDecimals } from '@sentre/senhub'
import { web3, BN } from '@project-serum/anchor'
import { utilsBN } from '@sen-use/web3'

import { useLaunchpad } from '../useLaunchpad'
import { AppState } from 'model'
import { notifyError } from 'helper'

type BuyTokenProps = {
  launchpadAddress: string
  amount: number
  limit?: number
}

export const useBuyToken = () => {
  const { printBaseMint, buyLaunchpad } = useLaunchpad()
  const [loading, setLoading] = useState(false)
  const launchpads = useSelector((state: AppState) => state.launchpads)
  const getMintDecimals = useGetMintDecimals()

  const onBuyToken = useCallback(
    async (props: BuyTokenProps) => {
      try {
        setLoading(true)
        const { launchpadAddress, amount, limit } = props
        const launchpadData = launchpads[launchpadAddress]
        const launchpad = new web3.PublicKey(launchpadAddress)
        const decimals =
          (await getMintDecimals({
            mintAddress: launchpadData.mint.toBase58(),
          })) || 0
        const bnAmount = utilsBN.decimalize(amount, decimals)
        let txs: web3.Transaction[] = []
        const provider = getAnchorProvider()!

        const { tx: txBasePrint } = await printBaseMint({
          launchpad,
          amount: bnAmount,
          sendAndConfirm: false,
        })
        txs.push(txBasePrint)

        const { tx: txBuy } = await buyLaunchpad(
          launchpad,
          bnAmount,
          limit ? new BN(limit) : new BN(0),
          false,
        )
        txs.push(txBuy)

        await provider.sendAll(txs.map((tx) => ({ tx, signers: [] })))
      } catch (error) {
        notifyError(error)
      } finally {
        setLoading(false)
      }
    },
    [buyLaunchpad, getMintDecimals, launchpads, printBaseMint],
  )

  return { onBuyToken, loading }
}
