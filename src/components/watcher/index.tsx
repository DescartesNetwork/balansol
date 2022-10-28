import {
  Fragment,
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { getAnchorProvider, useWalletAddress, util } from '@sentre/senhub'
import Balancer from '@senswap/balancer'
import Launchpad from '@senswap/launchpad'

import PoolWatcher from './pool.watcher'
import LaunchpadWatcher from './launchpad.watcher'
import ChequesWatcher from './cheques'

import configs from 'configs'

const {
  sol: { balancerAddress, launchpadAddress },
} = configs

export const AppWatcher: FunctionComponent = (props) => {
  const [loading, setLoading] = useState(true)
  const address = useWalletAddress()

  const watchWallet = useCallback(() => {
    if (!util.isAddress(address)) return
    // init window balancer
    const anchorProvider = getAnchorProvider()!
    window.balansol = new Balancer(anchorProvider, balancerAddress)
    window.launchpad = new Launchpad(
      anchorProvider,
      launchpadAddress,
      balancerAddress,
    )
    setLoading(false)
  }, [address])

  useEffect(() => {
    watchWallet()
  }, [watchWallet])

  if (loading) return <Fragment />
  return (
    <PoolWatcher>
      <LaunchpadWatcher />
      <ChequesWatcher />
      {props.children}
    </PoolWatcher>
  )
}
