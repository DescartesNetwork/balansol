import { useEffect } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { web3 } from '@project-serum/anchor'
import { Connection } from '@solana/web3.js'
import { JupiterProvider } from '@jup-ag/react-hook'
import { useUI, useWallet } from '@senhub/providers'

import { Empty } from 'antd'
import PoolDetails from './poolDetails'
import SwapAndPools from './swapAndPools'

import { AppWatcher } from 'app/components/watcher'
import { useAppRouter } from 'app/hooks/useAppRouter'
import configs from 'app/configs'

import BG from 'app/static/images/balansol-background.png'
import './index.less'

const {
  sol: { node },
} = configs
const connection = new Connection(node)

const View = () => {
  const { setBackground } = useUI()
  const { appRoute } = useAppRouter()
  const { wallet } = useWallet()

  useEffect(() => {
    setBackground({ light: BG, dark: BG })
  }, [setBackground])

  if (!configs.sol.balancerAddress)
    return (
      <Empty
        description={'Coming soon.'}
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    )

  return (
    <AppWatcher>
      <JupiterProvider
        connection={connection}
        cluster={'mainnet-beta'}
        userPublicKey={new web3.PublicKey(wallet.address)}
      >
        <Switch>
          <Route path={`${appRoute}/details`} component={PoolDetails} />
          <Route path={`${appRoute}/swap`}>
            <SwapAndPools tabId={'swap'} />
          </Route>
          <Route path={`${appRoute}/pools`}>
            <SwapAndPools tabId={'pools'} />
          </Route>
          <Route path="*">
            <Redirect to={`${appRoute}/swap`} />
          </Route>
        </Switch>
      </JupiterProvider>
    </AppWatcher>
  )
}

export default View
