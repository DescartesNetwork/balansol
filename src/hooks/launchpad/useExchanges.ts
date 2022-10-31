import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { BN } from '@project-serum/anchor'

import { AppState } from 'model'
import { useCheques } from './useCheques'

export const useExchanges = (launchpadAddress: string, owner?: boolean) => {
  const cheques = useSelector((state: AppState) => state.cheques)
  const filteredCheques = useCheques(launchpadAddress, owner)

  const exchangeValues = useMemo(() => {
    let totalBid = new BN(0)
    let totalAsk = new BN(0)
    for (const address of filteredCheques) {
      const { bidAmount, askAmount } = cheques[address]
      totalBid = totalBid.add(bidAmount)
      totalAsk = totalAsk.add(askAmount)
    }
    return {
      totalBid,
      totalAsk,
    }
  }, [cheques, filteredCheques])

  return exchangeValues
}
