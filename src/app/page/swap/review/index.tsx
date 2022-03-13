import { Button, Card, Col, Row, Typography } from 'antd'
import React, { useState } from 'react'
import ConfirmSwap from './confirmSwap'

import './index.less'

export default function Review() {
  const [visible, setVisivle] = useState(false)
  return (
    <Row gutter={[24, 24]} style={{ width: '100%' }}>
      <Col span={24} style={{ padding: 0 }}>
        <Button
          type="primary"
          onClick={() => setVisivle(true)}
          disabled={false}
          style={{
            width: '100%',
            background: 'linear-gradient(81.55deg, #F148FB 0%, #4E6ABE 100%)',
            borderRadius: 40,
            borderColor: 'transparent',
          }}
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
  )
}
