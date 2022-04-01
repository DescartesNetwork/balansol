import React, { useEffect, useState } from 'react'

import { Button, Card, Col, Row, Space, Typography } from 'antd'

const options = [0.5, 1, 2, 0]

const Setting = () => {
  const [selected, setSelected] = useState(0.5)
  return (
    <Card
      bodyStyle={{
        padding: 16,
      }}
    >
      <Row gutter={[0, 24]}>
        <Col span={24}>
          <Typography.Title level={5}>Slippage tolerance</Typography.Title>
        </Col>
        <Col>
          <Space size={12}>
            {options.map((value) => {
              const slippageSelected = value === selected ? 'selected' : ''
              return (
                <Button
                  className={`btn-slippage ${slippageSelected}`}
                  onClick={() => {
                    setSelected(value)
                  }}
                  key={value}
                >
                  {value === 0 ? 'Freely' : `${value} %`}
                </Button>
              )
            })}
          </Space>
        </Col>
      </Row>
    </Card>
  )
}

export default Setting
