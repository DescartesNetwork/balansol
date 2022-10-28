import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useWalletAddress } from '@sentre/senhub'

import { AppState } from 'model'

export const useCheques = (launchpadAddress: string, owner?: boolean) => {
  const cheques = useSelector((state: AppState) => state.cheques)
  const walletAddress = useWalletAddress()

  const filteredCheques = useMemo(
    () =>
      Object.keys(cheques).filter((address) => {
        const { authority, launchpad } = cheques[address]
        if (!owner) return launchpad.toBase58() === launchpadAddress
        return (
          authority.toBase58() === walletAddress &&
          launchpad.toBase58() === launchpadAddress
        )
      }),
    [cheques, launchpadAddress, owner, walletAddress],
  )

  return filteredCheques
}
