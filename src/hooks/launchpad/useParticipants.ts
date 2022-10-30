import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useMintDecimals } from '@sentre/senhub'
import { BN } from '@project-serum/anchor'

import { utilsBN } from '@sen-use/web3'

import { useCheques } from './useCheques'
import { useLaunchpadData } from './useLaunchpadData'
import { AppState } from 'model'

export const useParticipants = (launchpadAddress: string) => {
  const cheques = useSelector((state: AppState) => state.cheques)
  const filteredCheques = useCheques(launchpadAddress)
  const { launchpadData } = useLaunchpadData(launchpadAddress)
  const decimals =
    useMintDecimals({ mintAddress: launchpadData?.mint.toBase58() }) || 0

  const participants = useMemo(() => {
    let total = 0
    let basePrice = new BN(0)
    const boughtAddress: string[] = []
    for (const address of filteredCheques) {
      const { authority, amount } = cheques[address]
      basePrice = basePrice.add(amount)
      if (boughtAddress.includes(authority.toBase58())) continue
      boughtAddress.push(authority.toBase58())
      total += 1
    }
    return { total, basePrice: utilsBN.undecimalize(basePrice, decimals) }
  }, [cheques, decimals, filteredCheques])

  return participants
}
