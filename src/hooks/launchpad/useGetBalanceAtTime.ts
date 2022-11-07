import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { BN } from '@project-serum/anchor'

import { AppState } from 'model'

export const useGetBalanceAtTime = () => {
  const cheques = useSelector((state: AppState) => state.cheques)
  const launchpads = useSelector((state: AppState) => state.launchpads)

  const getBalanceAtTime = useCallback(
    (launchpadAddr: string, time: number) => {
      const { startReserves } = launchpads[launchpadAddr]
      let totalSoldBid = new BN(0)
      let totalSoldAsk = new BN(0)

      for (const address in cheques) {
        const { createAt, askAmount, bidAmount, launchpad } = cheques[address]
        if (launchpad.toBase58() !== launchpadAddr) continue
        if (createAt.toNumber() * 1000 > time) continue
        totalSoldAsk = totalSoldAsk.add(askAmount)
        totalSoldBid = totalSoldAsk.add(bidAmount)
      }

      return [
        startReserves[0].sub(totalSoldAsk),
        startReserves[1].add(totalSoldBid),
      ]
    },
    [cheques, launchpads],
  )

  return getBalanceAtTime
}
