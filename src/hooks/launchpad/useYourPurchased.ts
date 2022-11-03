import { useMemo } from 'react'
import { useSelector } from 'react-redux'

import { AppState } from 'model'
import { useWalletAddress } from '@sentre/senhub/dist'

export const useYourPurchased = () => {
  const cheques = useSelector((state: AppState) => state.cheques)
  const walletAddress = useWalletAddress()

  const launchpadPurchased = useMemo(() => {
    const launchpads: Record<string, string> = {}
    for (const address in cheques) {
      const { launchpad, authority } = cheques[address]
      if (walletAddress !== authority.toBase58()) continue
      if (launchpads[launchpad.toBase58()]) continue
      launchpads[launchpad.toBase58()] = address
    }
    return Object.keys(launchpads)
  }, [cheques, walletAddress])

  return launchpadPurchased
}
