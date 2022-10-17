import { Button, Col, Row, Space, Typography } from 'antd'
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
            <ListLaunchpad state={LaunchpadSate.active} />
          </Col>
          <Col span={24}>
            <ListLaunchpad state={LaunchpadSate.upcoming} />
          </Col>
          <Col span={24}>
            <ListLaunchpad state={LaunchpadSate.completed} />
          </Col>
          <Col span={24} style={{ textAlign: 'center' }}>
            <Space direction="vertical" size={24}>
              <Typography.Title>Ready to launch your project?</Typography.Title>
              <Button size="large" type="primary">
                Apply now
              </Button>
            </Space>
          </Col>
          <Col span={24} />
        </Row>
      </Col>
    </Row>
  )
}

export default Launchpad
