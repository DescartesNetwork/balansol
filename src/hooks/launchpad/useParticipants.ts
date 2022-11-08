import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { BN } from '@project-serum/anchor'

import { AppState } from 'model'
import { useCheques } from './useCheques'

export const useParticipants = (launchpadAddress: string, owner?: boolean) => {
  const cheques = useSelector((state: AppState) => state.cheques)
  const filteredCheques = useCheques(launchpadAddress, owner)

  const participants = useMemo(() => {
    let totalUsers = 0
    let totalBid = new BN(0)
    let totalAsk = new BN(0)
    const boughtAddress: string[] = []
    for (const address of filteredCheques) {
      const { authority, bidAmount, askAmount } = cheques[address]
      totalBid = totalBid.add(bidAmount)
      totalAsk = totalAsk.add(askAmount)
      if (boughtAddress.includes(authority.toBase58())) continue
      boughtAddress.push(authority.toBase58())
      totalUsers += 1
    }
    return {
      totalUsers,
      totalBid,
      totalAsk,
    }
  }, [cheques, filteredCheques])

  return participants
}
