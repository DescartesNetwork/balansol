import React from 'react'

import { Col, Row } from 'antd'
import WeightControl from './weightControl'
import Selection from 'app/components/selection'
import { TokenInfo } from './index'

const TokenSetup = ({
  tokenInfo,
  onChangeTokenInfo,
  index,
}: {
  tokenInfo: TokenInfo
  onChangeTokenInfo: (value: TokenInfo, index: number) => void
  index: number
}) => {
  const { addressToken, weight } = tokenInfo
  const onChangeToken = (value: string) => {
    onChangeTokenInfo(
      {
        addressToken: value,
        weight,
      },
      index,
    )
  }
  const onChangeWeight = (value: string) => {
    onChangeTokenInfo(
      {
        addressToken,
        weight: value,
      },
      index,
    )
  }
  return (
    <Row>
      <Col flex="auto">
        <Selection selectedMint={addressToken} onChange={onChangeToken} />
      </Col>
      <Col>
        <WeightControl weight={weight} onChange={onChangeWeight} />
      </Col>
    </Row>
  )
}

export default TokenSetup
