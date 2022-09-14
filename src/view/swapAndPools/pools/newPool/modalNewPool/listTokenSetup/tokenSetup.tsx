import { Col, Row } from 'antd'
import WeightControl from './weightControl'

import { MintSetup } from '../index'
import { MintSelection } from '@sen-use/app'
import { useTheme } from '@sentre/senhub'

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
  const theme = useTheme()

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
    <Row wrap={false}>
      <Col flex="auto">
        <MintSelection
          value={mintSetup.addressToken}
          onChange={onChangeToken}
          style={{ background: theme === 'dark' ? '#394360' : '#F2F4FA' }}
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
