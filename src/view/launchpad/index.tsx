import { Col, Row } from 'antd'
import Banner from './banner'
import ListLaunchpad from './listLaunchpad'

import { LaunchpadSate } from 'constant'

const Launchpad = () => {
  return (
    <Row justify="center">
      <Col span={18}>
        <Row gutter={[0, 48]}>
          <Col span={24}>
            <Banner />
          </Col>
          <Col span={24}>
            <ListLaunchpad type={LaunchpadSate.active} />
          </Col>
          <Col span={24}>
            <ListLaunchpad type={LaunchpadSate.upcoming} />
          </Col>
          <Col span={24} />
        </Row>
      </Col>
    </Row>
  )
}

export default Launchpad
