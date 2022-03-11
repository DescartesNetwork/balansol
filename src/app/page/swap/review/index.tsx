import { Button, Card, Col, Row, Typography } from 'antd'
import React, { useState } from 'react'
import ConfirmSwap from './confirmSwap'

export default function Review() {
  const [visible, setVisivle] = useState(false)
  return (
    <Card bordered={false}>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Button
            type="primary"
            onClick={() => setVisivle(true)}
            disabled={false}
            block
          >
            Review
          </Button>
        </Col>
        <ConfirmSwap
          visible={visible}
          onCancel={() => {
            setVisivle(false)
          }}
        />
      </Row>
    </Card>
  )
}
