import { Fragment, useCallback, useEffect } from 'react'
import { Route, Switch } from 'react-router-dom'
import { useUI } from '@senhub/providers'

import { Row, Col, Radio, Tabs } from 'antd'
import PoolDetails from './poolDetails'
import Pools from './pools'
import Swap from './swap'

import { AppWatcher } from 'app/components/watcher'
import { QueryParams, HOMEPAGE_TABS } from 'app/constant'
import { useAppRouter } from 'app/hooks/useAppRouter'

import BG from 'app/static/images/balansol-background.png'

import './index.less'

const SwapAndPools = () => {
  const { getQuery, pushHistory } = useAppRouter()

  const selectedTab = getQuery(QueryParams.wrapTab)

  const onChange = useCallback(
    (tabId: string) => pushHistory(`/?tab=${tabId}`),
    [pushHistory],
  )

  useEffect(() => {
    if (!selectedTab) onChange(HOMEPAGE_TABS.Swap)
  }, [onChange, selectedTab])

  if (!selectedTab) return null

  return (
    <Fragment>
      <Row gutter={[24, 24]} justify="center" style={{ paddingBottom: 12 }}>
        <Col>
          <Radio.Group
            onChange={(val) => onChange(val.target.value)}
            className="pool-option"
            value={selectedTab}
          >
            {Object.keys(HOMEPAGE_TABS).map((key) => (
              <Radio.Button
                style={{ minWidth: 90 }}
                value={HOMEPAGE_TABS[key]}
                key={key}
              >
                {key}
              </Radio.Button>
            ))}
          </Radio.Group>
        </Col>
        <Col span={24}>
          <Tabs activeKey={selectedTab} centered className="swap-tab">
            <Tabs.TabPane key={HOMEPAGE_TABS.Swap}>
              <Swap />
            </Tabs.TabPane>
            <Tabs.TabPane key={HOMEPAGE_TABS.Pools}>
              <Pools />
            </Tabs.TabPane>
          </Tabs>
        </Col>
      </Row>
    </Fragment>
  )
}

const Page = () => {
  const { appRoute } = useAppRouter()
  const { setBackground } = useUI()

  useEffect(() => {
    setBackground({ light: BG, dark: BG })
  }, [setBackground])

  return (
    <div className="balansol-background">
      <AppWatcher>
        <Switch>
          <Route exact path={appRoute} component={SwapAndPools} />
          <Route path={`${appRoute}/details`} component={PoolDetails} />
        </Switch>
      </AppWatcher>
    </div>
  )
}

export default Page
