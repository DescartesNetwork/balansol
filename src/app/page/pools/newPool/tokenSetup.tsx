import React, { Dispatch, SetStateAction } from 'react'

import { Col, Row } from 'antd'
import WeightControl from './weightControl'
import Selection from 'app/components/selection'
import { SelectionInfo } from 'app/components/selection/mintSelection'
import { TokenInfo } from '.'
import { setValue } from 'os/store/search.reducer'

const TokenSetup = ({
  tokenInfo,
  onChangeTokenInfo,
  index,
}: {
  tokenInfo: TokenInfo
  onChangeTokenInfo: (value: TokenInfo, index: number) => void
  index: number
}) => {
  const { mintInfo, weight } = tokenInfo
  const onChangeToken = (value: SelectionInfo) => {
    onChangeTokenInfo(
      {
        mintInfo: value,
        weight,
      },
      index,
    )
  }
  const onChangeWeight = (value: string) => {
    onChangeTokenInfo(
      {
        mintInfo,
        weight: value,
      },
      index,
    )
  }
  return (
    <Row>
      <Col flex="auto">
        <Selection
          value={{
            poolAddresses: mintInfo.poolAddresses,
            mintInfo: {
              address: mintInfo.mintInfo?.address || '',
              decimals: mintInfo.mintInfo?.decimals || 0,
            },
          }}
          onChange={onChangeToken}
        />
      </Col>
      <Col>
        <WeightControl weight={weight} onChange={onChangeWeight} />
      </Col>
    </Row>
  )
}

export default TokenSetup
