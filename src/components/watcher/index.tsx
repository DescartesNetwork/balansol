import {
  Fragment,
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { getAnchorProvider, useWalletAddress, util } from '@sentre/senhub'
import Balancer from '@senswap/balancer'

import configs from 'configs'
import PoolWatcher from './pool.watcher'
import LaunchpadWatcher from './launchpad.watcher'

export const AppWatcher: FunctionComponent = (props) => {
  const [loading, setLoading] = useState(true)
  const address = useWalletAddress()

  const watchWallet = useCallback(() => {
    if (!util.isAddress(address)) return
    // init window balancer
    const anchorProvider = getAnchorProvider()!
    window.balansol = new Balancer(anchorProvider, configs.sol.balancerAddress)
    setLoading(false)
  }, [address])

  useEffect(() => {
    watchWallet()
  }, [watchWallet])

  if (loading) return <Fragment />
  return (
    <PoolWatcher>
      <LaunchpadWatcher>{props.children}</LaunchpadWatcher>
    </PoolWatcher>
  )
}
