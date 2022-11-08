import { useMemo } from 'react'
import { useSelector } from 'react-redux'

import { AppState } from 'model'
import { useWalletAddress } from '@sentre/senhub'

export const useYourPurchased = () => {
  const cheques = useSelector((state: AppState) => state.cheques)
  const launchpads = useSelector((state: AppState) => state.launchpads)

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

  const filteredLaunchpad = launchpadPurchased.sort(
    (a, b) =>
      launchpads[b].startTime.toNumber() - launchpads[a].startTime.toNumber(),
  )

  return filteredLaunchpad
}
