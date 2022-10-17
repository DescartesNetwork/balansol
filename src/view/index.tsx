import { useEffect } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { web3 } from '@project-serum/anchor'
import { JupiterProvider } from '@jup-ag/react-hook'
import {
  useWalletAddress,
  useSetBackground,
  useAppRoute,
  util,
} from '@sentre/senhub'

import { Col, Empty, Row } from 'antd'
import Navigation from './navigation'
import PoolDetails from './poolDetails'
import Swap from './swap'
import Pools from './pools'
import AllLaunchpad from './launchpad/allLaunchpad'
import Launchpad from './launchpad'

import configs from 'configs'
import { AppWatcher } from 'components/watcher'
import BalansolPoolsProvider from 'hooks/useBalansolPools'
import BalansolProvider from 'hooks/useSwap'

import BG_DARK from 'static/images/background-dark.png'
import BG_LIGHT from 'static/images/background-light.png'
import './index.less'

const {
  sol: { connection, balancerAddress },
} = configs

const View = () => {
  const setBackground = useSetBackground()
  const { extend } = useAppRoute()
  const walletAddress = useWalletAddress()

  useEffect(() => {
    setBackground({ light: BG_LIGHT, dark: BG_DARK })
  }, [setBackground])

  if (!util.isAddress(balancerAddress))
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
      userPublicKey={new web3.PublicKey(walletAddress)}
    >
      <AppWatcher>
        {/* Balansol provider context */}
        <BalansolPoolsProvider>
          <BalansolProvider>
            <Row gutter={[0, 24]} style={{ paddingTop: 32 }}>
              <Col span={24}>
                <Navigation />
              </Col>
              <Col span={24} id="balansol-body">
                <Switch>
                  <Route path={extend('/details')} component={PoolDetails} />
                  <Route path={extend('/swap')}>
                    <Swap />
                  </Route>
                  <Route path={extend('/pools')}>
                    <Pools />
                  </Route>
                  <Route path={extend('/launchpad')}>
                    <Launchpad />
                  </Route>
                  <Route
                    path={extend('/launchpad-all')}
                    component={AllLaunchpad}
                  />

                  <Route path={extend('/farms')}>
                    <Redirect to="/app/sen_farming_v2?autoInstall=true" />
                  </Route>
                  <Redirect
                    from="*"
                    to={extend('/swap', { absolutePath: true })}
                  />
                </Switch>
              </Col>
            </Row>
          </BalansolProvider>
        </BalansolPoolsProvider>
      </AppWatcher>
    </JupiterProvider>
  )
}

export default View
