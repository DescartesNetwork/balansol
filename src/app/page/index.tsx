import { useState } from 'react'

import { Row, Col, Radio, Tabs } from 'antd'

import { WrapTabs } from 'app/constant'
import Pools from './pools'
import Swap from './swap'
import { AppWatcher } from 'app/components/watcher'

import './index.less'

const Page = () => {
  const [wrapTab, setWrapTab] = useState(WrapTabs.Wrap)

  return (
    <AppWatcher>
      <Row gutter={[24, 24]}>
        <Col span={24} style={{ display: 'flex', justifyContent: 'center' }}>
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
          <Tabs activeKey={wrapTab} centered className="swap-tab">
            <Tabs.TabPane key={WrapTabs.Wrap}>
              <Swap />
            </Tabs.TabPane>
            <Tabs.TabPane key={WrapTabs.Pools}>
              <Pools />
            </Tabs.TabPane>
          </Tabs>
        </Col>
      </Row>
    </AppWatcher>
  )
}

export default Page
