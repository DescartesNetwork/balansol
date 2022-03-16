import { Button, Card, Col, Row } from 'antd'
import { useState } from 'react'
import ConfirmSwap from './confirmSwap'

import './index.less'

export default function Review() {
  const [visible, setVisivle] = useState(false)
  return (
    <Row gutter={[24, 24]} style={{ width: '100%' }}>
      <Col span={24} style={{ padding: 0 }}>
        <Button type="primary" onClick={() => setVisivle(true)} block>
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
