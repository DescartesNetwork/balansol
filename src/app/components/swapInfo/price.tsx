import { useEffect, useState } from 'react'

import { Button, Space, Typography } from 'antd'
import IonIcon from 'shared/antd/ionicon'
import { MintSymbol } from 'shared/antd/mint'
import { useSelector } from 'react-redux'
import { AppState } from 'app/model'
import { calSpotPrice } from 'app/helper/oracles'
import { useRouteSwap } from 'app/hooks/useRouteSwap'

const MintRatio = ({ reversed = false }: { reversed?: boolean }) => {
  const {
    swap: { askMint, bidMint },
    pools,
  } = useSelector((state: AppState) => state)

  const [spotPrice, setSpotPrice] = useState(0)
  const { pool } = useRouteSwap()

  useEffect(() => {
    if (!pool) return setSpotPrice(0)

    const bestPoolInfo = pools[pool]
    const tokenInIdx = bestPoolInfo.mints.findIndex(
      (mint) => mint.toBase58() === bidMint,
    )

    const tokenOutIdx = bestPoolInfo.mints.findIndex(
      (mint) => mint.toBase58() === askMint,
    )

    const hotSpotPrice = calSpotPrice(
      bestPoolInfo.reserves[tokenInIdx],
      bestPoolInfo.weights[tokenInIdx],
      bestPoolInfo.reserves[tokenOutIdx],
      bestPoolInfo.weights[tokenOutIdx],
    )

    setSpotPrice(hotSpotPrice)
  }, [askMint, pool, bidMint, pools])

  const actualBid = reversed ? bidMint : askMint
  const actualAsk = reversed ? askMint : bidMint

  return (
    <Space>
      <MintSymbol mintAddress={actualBid} />
      <Typography.Text>=</Typography.Text>
      <Typography.Text>{spotPrice}</Typography.Text>
      <MintSymbol mintAddress={actualAsk} />
    </Space>
  )
}

const Price = () => {
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
        icon={
          <IonIcon
            name="swap-horizontal-outline"
            style={{ color: '#F3F3F5' }}
          />
        }
        style={{ background: 'transparent' }}
      />
      <Typography.Text>1</Typography.Text>
      <MintRatio reversed={reversed} />
    </Space>
  )
}

export default Price
