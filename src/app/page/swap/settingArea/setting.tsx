import { Button, Col, Row, Typography } from 'antd'
import React from 'react'

const Setting = () => {
  const Options = [0.5, 1, 2, 3]
  return (
    <Row gutter={[8, 8]}>
      <Col span={24}>
        <Typography.Title level={3}>Slippage tolerance</Typography.Title>
      </Col>
      <Col>
        {Options.map((value) => (
          <Button>
            <Typography.Text>{value}%</Typography.Text>
          </Button>
        ))}
      </Col>
    </Row>
  )
}

export default Setting
