import { useCallback } from 'react'

import { Row, Col, Segmented } from 'antd'
import Pools from '../pools'
import Swap from '../swap'

import { HOMEPAGE_TABS } from 'app/constant'
import { useAppRouter } from 'app/hooks/useAppRouter'
import { Route, Switch, useParams } from 'react-router-dom'

const SwapAndPools = () => {
  const { pushHistory, appRoute } = useAppRouter()
  const { tabId } = useParams<{ tabId: string }>()

  const onChange = useCallback(
    (tabId: string) => pushHistory(`/${tabId}`),
    [pushHistory],
  )

  return (
    <Row gutter={[24, 24]} justify="center" style={{ paddingBottom: 12 }}>
      <Col>
        <Segmented
          options={Object.keys(HOMEPAGE_TABS).map((key) => {
            return { label: key, value: HOMEPAGE_TABS[key] }
          })}
          value={tabId}
          onChange={(val) => onChange(val.toString())}
          block
        />
      </Col>
      <Col span={24}>
        <Switch>
          <Route path={`${appRoute}/swap`} component={Swap} />
          <Route path={`${appRoute}/pools`} component={Pools} />
        </Switch>
      </Col>
    </Row>
  )
}

export default SwapAndPools
