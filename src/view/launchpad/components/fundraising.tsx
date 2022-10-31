import { useMemo } from 'react'
import { useMintDecimals, util } from '@sentre/senhub'
import { MintAmount, MintSymbol } from '@sen-use/app'

import { Col, Row, Space, Typography } from 'antd'

import { useLaunchpadData } from 'hooks/launchpad/useLaunchpadData'
import { utilsBN } from 'helper/utilsBN'
import { useExchanges } from 'hooks/launchpad/useExchanges'

type FundraisingProps = {
  direction?: string
  launchpadAddress: string
}

const Fundraising = ({
  direction = 'row',
  launchpadAddress,
}: FundraisingProps) => {
  const { launchpadData } = useLaunchpadData(launchpadAddress)
  const { totalBid } = useExchanges(launchpadAddress)
  const stableDecimal =
    useMintDecimals({ mintAddress: launchpadData.stableMint.toBase58() }) || 0

  const fundraisingRatio = useMemo(() => {
    const totalBidNum = Number(
      utilsBN.undecimalize(totalBid, stableDecimal || 0),
    )
    const reserveBidNum = Number(
      utilsBN.undecimalize(launchpadData?.startReserves[1], stableDecimal),
    )
    return totalBidNum / reserveBidNum
  }, [launchpadData?.startReserves, stableDecimal, totalBid])

  return (
    <Row gutter={[12, 12]} align="middle" style={{ flexFlow: direction }}>
      <Col flex="auto">
        <Typography.Text type="secondary">Fundraising goal</Typography.Text>
      </Col>
      <Col>
        <Space>
          <Typography.Title level={5}>
            <MintAmount
              mintAddress={launchpadData.stableMint}
              amount={totalBid}
              formatter="0,0.[000]"
            />
            /
            <MintAmount
              mintAddress={launchpadData.stableMint}
              amount={launchpadData?.startReserves[1]}
              formatter="0,0.[000]"
            />{' '}
            <MintSymbol mintAddress={launchpadData.stableMint} />
          </Typography.Title>
          <Typography.Title level={5}>
            {util.numeric(fundraisingRatio).format('%0,0.[00]')}
          </Typography.Title>
        </Space>
      </Col>
    </Row>
  )
}

export default Fundraising
