import { Col, Row, Space, Typography } from 'antd'

type FundraisingProps = {
  direction?: string
}

const Fundraising = ({ direction = 'row' }: FundraisingProps) => {
  return (
    <Row gutter={[12, 12]} align="middle" style={{ flexFlow: direction }}>
      <Col flex="auto">
        <Typography.Text type="secondary">Fundraising goal</Typography.Text>
      </Col>
      <Col>
        <Space>
          <Typography.Title level={5}>250/500 USDC</Typography.Title>
          <Typography.Title level={5}>(50%)</Typography.Title>
        </Space>
      </Col>
    </Row>
  )
}

export default Fundraising
