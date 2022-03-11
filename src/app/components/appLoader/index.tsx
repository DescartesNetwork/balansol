import { FunctionComponent, useCallback, useEffect, useState } from 'react'
import { useWallet } from '@senhub/providers'
import Balancer, { getAnchorProvider } from '@senswap/balancer'
import { Spin } from 'antd'

export const AppLoader: FunctionComponent = (props) => {
  const [loading, setLoading] = useState(false)
  const {
    wallet: { address },
  } = useWallet()

  const watchWallet = useCallback(() => {
    if (!address) return
    const { splt, wallet } = window.sentre
    if (!wallet) throw new Error('Login fist')

    const anchorProvider = getAnchorProvider(splt.nodeUrl, address, wallet)
    window.app = {
      balancer: new Balancer(
        anchorProvider,
        'He8y32t2eion7jKb37JzTrNTFqK5cenCB3sq8QrerJfb',
      ),
    }
    setLoading(false)
  }, [address])

  useEffect(() => {
    watchWallet()
  }, [watchWallet])

  return (
    <Spin tip="Loading..." spinning={loading}>
      {props.children}
    </Spin>
  )
}
