import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { Col, Row } from 'antd'
import WeightControl from './weightControl'
import Selection from 'app/components/selection'

import { TokenInfo } from './index'
import { useAccount, useMint } from '@senhub/providers'
import { AppState } from 'app/model'

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
  const { pools } = useSelector((state: AppState) => state)
  const [sourceMint, setSourceMint] = useState<string[]>([])
  const { addressToken, weight, isLocked } = tokenInfo
  const { accounts } = useAccount()
  const { tokenProvider } = useMint()

  useEffect(() => {
    ;(async () => {
      const selectedMints = tokenList.map((token) => token.addressToken)
      const selectedIgnoreMints = Object.values(accounts)
        .map(({ mint }) => mint)
        .filter((value) => !selectedMints.includes(value))
      const mintInfos = await Promise.all(
        selectedIgnoreMints.map(
          async (value) => await tokenProvider.findByAddress(value),
        ),
      )
      const filteredSourceMints = selectedIgnoreMints.filter(
        (_, idx) => mintInfos[idx],
      )

      setSourceMint(filteredSourceMints)
    })()
  }, [accounts, pools, tokenList, tokenProvider])

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
