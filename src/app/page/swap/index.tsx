import React from 'react'

import PoweredBySentre from './poweredBySentre'
import { Card, Col, Row } from 'antd'
import AskInput from './askInput'
import BidInput from './bidInput'
import Review from './review'

export default function Swap() {
  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Card bordered={false} className="card-swap" bodyStyle={{ padding: 0 }}>
          <PoweredBySentre />
        </Card>
      </Col>
      <Col span={24}>
        <Card bordered={false} className="card-swap" bodyStyle={{ padding: 0 }}>
          <AskInput />
        </Card>
      </Col>
      <Col span={24}>
        <Card bordered={false} className="card-swap" bodyStyle={{ padding: 0 }}>
          <BidInput />
        </Card>
      </Col>
      <Col span={24}>
        <Review />
      </Col>
    </Row>
  )
}
