import { useEffect } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { useUI } from '@senhub/providers'

import { Empty } from 'antd'
import PoolDetails from './poolDetails'
import SwapAndPools from './swapAndPools'

import { AppWatcher } from 'app/components/watcher'
import { useAppRouter } from 'app/hooks/useAppRouter'
import config from 'app/configs'

import BG from 'app/static/images/balansol-background.png'
import './index.less'

const View = () => {
  const { setBackground } = useUI()
  const { appRoute } = useAppRouter()

  useEffect(() => {
    setBackground({ light: BG, dark: BG })
  }, [setBackground])

  if (!config.sol.balancerAddress)
    return (
      <Empty
        description={'Coming soon.'}
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    )

  return (
    <AppWatcher>
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
    </AppWatcher>
  )
}

export default View
