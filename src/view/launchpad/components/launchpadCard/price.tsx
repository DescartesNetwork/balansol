import { Col, Row, Typography } from 'antd'

type PriceProps = {
  direction?: string
}

const Price = ({ direction = 'row' }: PriceProps) => {
  return (
    <Row gutter={[12, 12]} align="middle" style={{ flexFlow: direction }}>
      <Col flex="auto">
        <Typography.Text type="secondary">Price</Typography.Text>
      </Col>
      <Col>
        <Typography.Text>1 ZET = 0.5 USDC</Typography.Text>
      </Col>
    </Row>
  )
}

export default Price
