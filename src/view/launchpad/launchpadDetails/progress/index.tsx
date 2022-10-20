import { Card, Col, Row, Typography } from 'antd'
import EndIn from 'view/launchpad/components/endIn'
import Fundraising from 'view/launchpad/components/fundraising'
import Sold from 'view/launchpad/components/sold'

const Progress = () => {
  return (
    <Card>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Row>
            <Col flex="auto">
              <Typography.Text type="secondary">Your bought</Typography.Text>
            </Col>
            <Col>
              <Typography.Title level={3}>0 ZET</Typography.Title>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row>
            <Col flex="auto">
              <Typography.Text type="secondary">Participants</Typography.Text>
            </Col>
            <Col>
              <Typography.Text>99</Typography.Text>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <EndIn />
        </Col>
        <Col span={24}>
          <Fundraising />
        </Col>
        <Col span={24}>
          <Sold />
        </Col>
      </Row>
    </Card>
  )
}

export default Progress
