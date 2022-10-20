import { Card, Col, Row, Space, Typography } from 'antd'
import LaunchpadProfile from 'view/launchpad/components/launchpadProfile'
import LaunchpadLineChart from 'view/launchpad/launchpadLineChart'
import TransHistory from './transHistory'

const LaunchpadInfo = () => {
  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <LaunchpadProfile />
      </Col>
      <Col span={24}>
        <Card bordered={false} style={{ background: '#394360' }}>
          <Row align="middle">
            <Col span={12}>
              <Space direction="vertical">
                <Typography.Text type="secondary">Token price</Typography.Text>
                <Typography.Title level={4} style={{ color: '#63E0B3' }}>
                  $0.5
                </Typography.Title>
              </Space>
            </Col>
            <Col span={12}>
              <Space direction="vertical">
                <Typography.Text type="secondary">
                  AVG users price
                </Typography.Text>
                <Typography.Title level={4} style={{ color: '#63E0B3' }}>
                  $0.5
                </Typography.Title>
              </Space>
            </Col>
          </Row>
        </Card>
      </Col>
      <Col span={24}>
        <LaunchpadLineChart />
      </Col>
      <Col span={24}>
        <TransHistory />
      </Col>
    </Row>
  )
}

export default LaunchpadInfo
