import React from 'react'

import { Card, Col, Row } from 'antd'
import InfoCard from './InfoCard'
import New from './new'
import Search from './search'

export default function Pools() {
  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Row>
          <Col>
            <Search />
          </Col>
          <Col>
            <New />
          </Col>
        </Row>
      </Col>

      <Col span={24}>
        <Row>
          {[1, 2, 3].map((value) => {
            return (
              <Col span={12}>
                <InfoCard />
              </Col>
            )
          })}
        </Row>
      </Col>
    </Row>
  )
}
