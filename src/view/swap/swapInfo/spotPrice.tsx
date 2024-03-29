import { useState } from 'react'
import { useSelector } from 'react-redux'
import { util } from '@sentre/senhub'

import { Button, Space, Typography } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import { MintSymbol } from '@sen-use/app'

import { AppState } from 'model'
import { useSwap } from 'hooks/useSwap'

const MintRatio = ({ reversed = false }: { reversed?: boolean }) => {
  const { askMint, bidMint } = useSelector((state: AppState) => state.swap)
  const { bidAmount, askAmount } = useSwap()

  let spotPrice = reversed ? askAmount / bidAmount : bidAmount / askAmount
  if (!bidAmount || !askAmount) spotPrice = 0
  const actualBid = reversed ? bidMint : askMint
  const actualAsk = reversed ? askMint : bidMint

  return (
    <Space>
      <MintSymbol mintAddress={actualBid} />
      <Typography.Text>=</Typography.Text>
      <Typography.Text>
        {util.numeric(spotPrice).format('0.[0000]')}
      </Typography.Text>
      <MintSymbol mintAddress={actualAsk} />
    </Space>
  )
}

const SpotPrice = () => {
  const [reversed, setReversed] = useState(false)

  const onReversed = () => {
    setReversed(!reversed)
  }

  return (
    <Space>
      <Button
        type="text"
        onClick={onReversed}
        shape="circle"
        icon={<IonIcon name="swap-horizontal-outline" />}
        style={{ background: 'transparent' }}
      />
      <Typography.Text>1</Typography.Text>
      <MintRatio reversed={reversed} />
    </Space>
  )
}

export default SpotPrice
