import React from 'react'

import { Button, Col, Row } from 'antd'
import IonIcon from 'shared/antd/ionicon'
import NumericInput from 'shared/antd/numericInput'

import { TokenInfo } from '../index'

export default function WeightControl({
  tokenInfo,
  onChangeWeight,
  onChangeLock,
  onRemoveToken,
}: {
  tokenInfo: TokenInfo
  onChangeWeight: (value: string) => void
  onChangeLock: (value: boolean) => void
  onRemoveToken: () => void
}) {
  const { weight, isLocked } = tokenInfo

  return (
    <Row justify="end" align="middle">
      <Col>
        <NumericInput
          value={weight}
          size="large"
          bordered={false}
          onValue={onChangeWeight}
          suffix={'%'}
          disabled={isLocked}
          maxLength={5}
          className="input-weight"
          placeholder="0"
        />
      </Col>
      <Col>
        <Button
          onClick={() => {
            onChangeLock(!isLocked)
          }}
          shape="circle"
          icon={
            <IonIcon
              name={isLocked ? 'lock-closed-outline' : 'lock-open-outline'}
            />
          }
          style={{ background: 'unset' }}
          type="text"
        />
      </Col>
      <Col>
        <Button
          onClick={onRemoveToken}
          shape="circle"
          icon={<IonIcon name="trash-outline" />}
          type="text"
        />
      </Col>
    </Row>
  )
}
