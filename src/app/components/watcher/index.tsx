import { FunctionComponent, useCallback, useEffect, useState } from 'react'
import { useWallet } from '@senhub/providers'
import Balancer, { getAnchorProvider } from '@senswap/balancer'

import configs from 'app/configs'
import PoolWatcher from './pool.watcher'
import { Space, Spin } from 'antd'

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

  if (loading)
    return (
      <Space
        style={{
          width: '100vw',
          height: `calc(100vh - 64px)`,
          justifyContent: 'center',
        }}
      >
        <Spin tip="Loading..." spinning={loading} />
      </Space>
    )
  return <PoolWatcher>{props.children}</PoolWatcher>
}
