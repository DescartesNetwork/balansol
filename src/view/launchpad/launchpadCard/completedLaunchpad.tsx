import { Card, Col, Row, Typography } from 'antd'
import Fundraising from './components/fundraising'
import LaunchpadProfile from './components/launchpadProfile'
import Price from './components/price'

const CompletedLaunchpad = () => {
  return (
    <Card>
      <Row gutter={[8, 8]} align="middle">
        <Col span={8}>
          <LaunchpadProfile />
        </Col>
        <Col span={16}>
          <Row gutter={[8, 8]} style={{ height: '100%' }}>
            <Col span={8}>
              <Row
                gutter={[12, 12]}
                style={{ flexFlow: 'column' }}
                align="middle"
              >
                <Col flex="auto">
                  <Typography.Text type="secondary">
                    Participants
                  </Typography.Text>
                </Col>
                <Col>
                  <Typography.Text>83</Typography.Text>
                </Col>
              </Row>
            </Col>
            <Col span={8}>
              <Price direction="column" />
            </Col>
            <Col span={8}>
              <Fundraising direction="column" />
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  )
}

export default CompletedLaunchpad