import { useState } from 'react'
import { useDispatch } from 'react-redux'

import { Row, Col, Radio, Tabs } from 'antd'

import { AppDispatch } from 'app/model'
import configs from 'app/configs'
import { WrapTabs } from 'app/constant'
import Pools from './pools'
import Swap from './swap'

import './index.less'

const {
  manifest: { appId },
} = configs

const Page = () => {
  const dispatch = useDispatch<AppDispatch>()

  const [wrapTab, setWrapTab] = useState(WrapTabs.Wrap)

  return (
    <Row gutter={[24, 24]} align="middle" className="balancer" justify="center">
      <Col xs={24} md={12} lg={8}>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Radio.Group
              onChange={(val) => setWrapTab(val.target.value)}
              className="pool-option"
              disabled={false}
              value={wrapTab}
            >
              <Radio.Button value={WrapTabs.Wrap}>Swap</Radio.Button>
              <Radio.Button value={WrapTabs.Pools}>Pools</Radio.Button>
            </Radio.Group>
          </Col>
          <Col span={24}>
            <Tabs activeKey={wrapTab} centered>
              <Tabs.TabPane key={WrapTabs.Wrap}>
                <Swap />
              </Tabs.TabPane>
              <Tabs.TabPane key={WrapTabs.Pools}>
                <Pools />
              </Tabs.TabPane>
            </Tabs>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default Page
