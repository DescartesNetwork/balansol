import { useEffect } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { web3 } from '@project-serum/anchor'
import { Connection } from '@solana/web3.js'
import { JupiterProvider } from '@jup-ag/react-hook'
import { useUI, useWallet, rpc } from '@sentre/senhub'

import { Empty } from 'antd'
import PoolDetails from './poolDetails'
import SwapAndPools from './swapAndPools'

import { AppWatcher } from 'components/watcher'
import { useAppRouter } from 'hooks/useAppRouter'
import BalansolPoolsProvider from 'hooks/useBalansolPools'
import BalansolProvider from 'hooks/useSwap'
import configs from 'configs'

import BG_DARK from 'static/images/background-dark.png'
import BG_LIGHT from 'static/images/background-light.png'

import './index.less'

const connection = new Connection(rpc)

const View = () => {
  const { setBackground } = useUI()
  const { appRoute } = useAppRouter()
  const { wallet } = useWallet()

  useEffect(() => {
    setBackground({ light: BG_LIGHT, dark: BG_DARK })
  }, [setBackground])

  if (!configs.sol.balancerAddress)
    return (
      <Empty
        description={'Coming soon.'}
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    )

  return (
    <JupiterProvider
      connection={connection}
      cluster={'mainnet-beta'}
      userPublicKey={new web3.PublicKey(wallet.address)}
    >
      <AppWatcher>
        {/* Balansol provider context */}
        <BalansolPoolsProvider>
          <BalansolProvider>
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
          </BalansolProvider>
        </BalansolPoolsProvider>
      </AppWatcher>
    </JupiterProvider>
  )
}

export default View
