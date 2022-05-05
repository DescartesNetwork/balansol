import {
  Fragment,
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { useWallet } from '@senhub/providers'
import Balancer, { getAnchorProvider } from '@senswap/balancer'

import configs from 'app/configs'
import PoolWatcher from './pool.watcher'

export const AppWatcher: FunctionComponent = (props) => {
  const [loading, setLoading] = useState(true)
  const {
    wallet: { address },
  } = useWallet()

  const watchWallet = useCallback(() => {
    if (!address) return
    const { splt, wallet } = window.sentre
    if (!wallet) throw new Error('Login fist')
    // init window balancer
    const anchorProvider = getAnchorProvider(splt.nodeUrl, address, wallet)
    window.balansol = new Balancer(anchorProvider, configs.sol.balancerAddress)
    setLoading(false)
  }, [address])

  useEffect(() => {
    watchWallet()
  }, [watchWallet])

  if (loading) return <Fragment />
  return <PoolWatcher>{props.children}</PoolWatcher>
}
