import { useTheme } from '@sentre/senhub'

import { Col, Progress, Row, Space, Typography } from 'antd'

const Sold = () => {
  const theme = useTheme()
  return (
    <Row align="middle">
      <Col flex="auto">
        <Typography.Text type="secondary">Sold</Typography.Text>
      </Col>
      <Col>
        <Space>
          <Typography.Title level={5}>2,500/10,000 USDC</Typography.Title>
          <Typography.Title level={5}>(25%)</Typography.Title>
        </Space>
      </Col>
      <Col span={24}>
        <Progress
          strokeColor={theme === 'dark' ? '#63E0B3' : '#081438'}
          percent={50}
          showInfo={false}
          className="sold-progress"
        />
      </Col>
      <Col span={24}>
        <Space>
          <Typography.Text type="secondary">Participants:</Typography.Text>
          <Typography.Text>99</Typography.Text>
        </Space>
      </Col>
    </Row>
  )
}

export default Sold
