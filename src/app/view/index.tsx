import { useEffect } from 'react'
import { Route, Switch, useParams } from 'react-router-dom'
import { useUI } from '@senhub/providers'

import { Empty } from 'antd'
import PoolDetails from './poolDetails'
import SwapAndPools from './swapAndPools'

import { AppWatcher } from 'app/components/watcher'
import { useAppRouter } from 'app/hooks/useAppRouter'
import config from 'app/configs'
import { HOMEPAGE_TABS } from 'app/constant'

import BG from 'app/static/images/balansol-background.png'
import './index.less'

const View = () => {
  const { tabId } = useParams<{ tabId: string }>()
  const { setBackground } = useUI()
  const { appRoute, pushHistory } = useAppRouter()

  useEffect(() => {
    setBackground({ light: BG, dark: BG })
  }, [setBackground])

  useEffect(() => {
    if (!tabId) pushHistory(`/${HOMEPAGE_TABS.Swap}`)
  }, [pushHistory, tabId])

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
        <Route exact path={`${appRoute}/details`} component={PoolDetails} />
        <Route path={`${appRoute}/:tabId`} component={SwapAndPools} />
      </Switch>
    </AppWatcher>
  )
}

export default View
