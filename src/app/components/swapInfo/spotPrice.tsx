import { useEffect, useState } from 'react'

import { Button, Space, Typography } from 'antd'
import IonIcon from 'shared/antd/ionicon'
import { MintSymbol } from 'shared/antd/mint'
import { useSelector } from 'react-redux'
import { AppState } from 'app/model'
import { calcSpotPrice, getMintInfo } from 'app/helper/oracles'
import { useRouteSwap } from 'app/hooks/swap/useRouteSwap'
import { numeric } from 'shared/util'

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
    const bidMintInfo = getMintInfo(bestPoolInfo, bidMint)
    const askMintInfo = getMintInfo(bestPoolInfo, askMint)

    if (!bidMintInfo || !askMintInfo) return setSpotPrice(0)

    const hotSpotPrice = calcSpotPrice(
      bidMintInfo.reserve,
      bidMintInfo.normalizedWeight,
      askMintInfo.reserve,
      askMintInfo.normalizedWeight,
    )

    setSpotPrice(hotSpotPrice)
  }, [askMint, pool, bidMint, pools])

  const actualBid = reversed ? bidMint : askMint
  const actualAsk = reversed ? askMint : bidMint

  return (
    <Space>
      <MintSymbol mintAddress={actualBid} />
      <Typography.Text>=</Typography.Text>
      <Typography.Text>
        {numeric(!reversed ? spotPrice : 1 / spotPrice).format('0.[0000]')}
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

export default SpotPrice
