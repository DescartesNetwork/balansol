import { useState } from 'react'

import { Button, Space, Typography } from 'antd'
import IonIcon from 'shared/antd/ionicon'
import { MintSymbol } from 'shared/antd/mint'
import { useSelector } from 'react-redux'
import { AppState } from 'app/model'

const MintRatio = ({ reversed = false }: { reversed?: boolean }) => {
  const {
    swap: { askMint, bidMint },
  } = useSelector((state: AppState) => state)

  const actualBid = reversed ? bidMint : askMint
  const actualAsk = reversed ? askMint : bidMint

  return (
    <Space>
      <MintSymbol mintAddress={actualBid} />
      <Typography.Text>/</Typography.Text>
      <MintSymbol mintAddress={actualAsk} />
    </Space>
  )
}

const Price = () => {
  const [reversed, setReversed] = useState(false)

  return (
    <Space>
      <Button
        type="text"
        onClick={() => setReversed(!reversed)}
        shape="circle"
        icon={<IonIcon name="swap-horizontal-outline" />}
      />
      <Typography.Text>100</Typography.Text>
      <MintRatio reversed={reversed} />
    </Space>
  )
}

export default Price
