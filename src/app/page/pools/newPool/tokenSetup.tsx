import React from 'react'

import { Col, Row } from 'antd'
import WeightControl from './weightControl'
import Selection from 'app/components/selection'

import { TokenInfo } from './index'
import { useMintsSwap } from 'app/hooks/useMintsSwap'

const TokenSetup = ({
  tokenInfo,
  onChangeTokenInfo,
  onRemoveToken,
  index,
}: {
  tokenInfo: TokenInfo
  onChangeTokenInfo: (value: TokenInfo, index: number) => void
  onRemoveToken: (index: number) => void
  index: number
}) => {
  const mintsSwap = useMintsSwap()
  const { addressToken, weight, isLocked } = tokenInfo
  const onChangeToken = (value: string) => {
    onChangeTokenInfo(
      {
        addressToken: value,
        weight,
        isLocked,
      },
      index,
    )
  }
  const onChangeWeight = (value: string) => {
    onChangeTokenInfo(
      {
        addressToken,
        weight: value,
        isLocked,
      },
      index,
    )
  }

  const onChangeLock = (value: boolean) => {
    onChangeTokenInfo(
      {
        addressToken,
        weight,
        isLocked: value,
      },
      index,
    )
  }
  const onRemove = () => {
    onRemoveToken(index)
  }
  return (
    <Row>
      <Col flex="auto">
        <Selection
          selectedMint={addressToken}
          onChange={onChangeToken}
          mints={mintsSwap}
        />
      </Col>
      <Col>
        <WeightControl
          tokenInfo={tokenInfo}
          onChangeWeight={onChangeWeight}
          onChangeLock={onChangeLock}
          onRemoveToken={onRemove}
        />
      </Col>
    </Row>
  )
}

export default TokenSetup
