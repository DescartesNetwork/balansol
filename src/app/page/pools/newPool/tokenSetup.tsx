import React, { useEffect, useState } from 'react'

import { Col, Row } from 'antd'
import WeightControl from './weightControl'
import Selection from 'app/components/selection'

import { TokenInfo } from './index'
import { useMintsSwap } from 'app/hooks/useMintsSwap'

const TokenSetup = ({
  tokenList,
  tokenInfo,
  onChangeTokenInfo,
  onRemoveToken,
  index,
}: {
  tokenList: TokenInfo[]
  tokenInfo: TokenInfo
  onChangeTokenInfo: (value: TokenInfo, index: number) => void
  onRemoveToken: (index: number) => void
  index: number
}) => {
  const mintsSwap = useMintsSwap()
  const [sourceMint, setSourceMint] = useState<string[]>([])
  const { addressToken, weight, isLocked } = tokenInfo

  useEffect(() => {
    const newestSourceMint = mintsSwap.filter(
      (value) => !tokenList.map((token) => token.addressToken).includes(value),
    )
    setSourceMint(newestSourceMint)
  }, [mintsSwap, tokenList])

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
          mints={sourceMint}
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
