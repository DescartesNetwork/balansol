import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { Col, Row } from 'antd'
import WeightControl from './weightControl'
import Selection from 'app/components/selection'

import { useAccount, useMint } from '@senhub/providers'
import { AppState } from 'app/model'
import { MintSetup } from '../index'

export type TokenSetupProps = {
  tokenList: MintSetup[]
  mintSetup: MintSetup
  onChangeTokenInfo: (value: MintSetup, index: number) => void
  onRemoveToken: (index: number) => void
  id: number
}

const TokenSetup = ({
  tokenList,
  mintSetup,
  onChangeTokenInfo,
  onRemoveToken,
  id,
}: TokenSetupProps) => {
  const { pools } = useSelector((state: AppState) => state)
  const [sourceMint, setSourceMint] = useState<string[]>([])
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

  const onChangeToken = (addressToken: string) => {
    onChangeTokenInfo(
      {
        ...mintSetup,
        addressToken,
      },
      id,
    )
  }

  const onChangeWeight = (weight: string) => {
    onChangeTokenInfo(
      {
        ...mintSetup,
        weight,
      },
      id,
    )
  }

  const onChangeLock = (isLocked: boolean) => {
    onChangeTokenInfo(
      {
        ...mintSetup,
        isLocked,
      },
      id,
    )
  }

  return (
    <Row>
      <Col flex="auto">
        <Selection
          selectedMint={mintSetup.addressToken}
          onChange={onChangeToken}
          mints={sourceMint}
        />
      </Col>
      <Col>
        <WeightControl
          tokenInfo={mintSetup}
          onChangeWeight={onChangeWeight}
          onChangeLock={onChangeLock}
          onRemoveToken={() => onRemoveToken(id)}
        />
      </Col>
    </Row>
  )
}

export default TokenSetup
