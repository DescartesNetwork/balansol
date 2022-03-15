import React, { Fragment, useState } from 'react'

import { Button, Col, Input, Row, Typography } from 'antd'
import IonIcon from 'shared/antd/ionicon'

export default function WeightControl({
  weight,
  onChange,
}: {
  weight: string
  onChange: (value: string) => void
}) {
  const [lock, setLock] = useState(false)

  return (
    <Row justify="end">
      <Col span={24}>
        <Input
          placeholder="Search"
          value={weight}
          size="small"
          bordered={false}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange(e.target.value)
          }
          suffix={'%'}
          disabled={lock}
          style={{ width: '52px' }}
        />
        <Button
          type="text"
          onClick={() => {
            setLock(!lock)
          }}
          shape="circle"
          icon={
            <IonIcon
              name={lock ? 'lock-closed-outline' : 'lock-open-outline'}
            />
          }
        />
        <Button
          type="text"
          onClick={() => {}}
          shape="circle"
          icon={<IonIcon name="trash-outline" />}
        />
      </Col>
    </Row>
  )
}
