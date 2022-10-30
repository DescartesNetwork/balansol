import {
  Fragment,
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { getAnchorProvider, useWalletAddress, util } from '@sentre/senhub'
import Balancer from '@senswap/balancer'
import Launchpad from '@sentre/launchpad'

import PoolWatcher from './pool.watcher'
import LaunchpadWatcher from './launchpad.watcher'
import ChequesWatcher from './cheques'

import configs from 'configs'
import Loading from 'components/loading'
import { useWatcherLoading } from './watcher'

const {
  sol: { balancerAddress, launchpadAddress },
} = configs

export const AppWatcher: FunctionComponent = (props) => {
  const [loading, setLoading] = useState(true)
  const [loadingInfo] = useWatcherLoading()

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

  if (loading || Object.values(loadingInfo).includes(true)) return <Loading />

  return (
    <Fragment>
      <LaunchpadWatcher />
      <ChequesWatcher />
      <PoolWatcher>{props.children}</PoolWatcher>
    </Fragment>
  )
}
