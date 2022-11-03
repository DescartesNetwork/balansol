import { useMemo } from 'react'
import { useMintDecimals, util } from '@sentre/senhub'
import { MintAmount, MintSymbol } from '@sen-use/app'

import { Col, Row, Space, Typography } from 'antd'

import { useLaunchpadData } from 'hooks/launchpad/useLaunchpadData'
import { useParticipants } from 'hooks/launchpad/useParticipants'
import { utilsBN } from 'helper/utilsBN'

type SoldProps = {
  direction?: string
  launchpadAddress: string
}

const Sold = ({ direction = 'row', launchpadAddress }: SoldProps) => {
  const { totalAsk } = useParticipants(launchpadAddress)
  const { launchpadData } = useLaunchpadData(launchpadAddress)
  const decimals =
    useMintDecimals({ mintAddress: launchpadData?.mint.toBase58() }) || 0

  const soldRatio = useMemo(() => {
    const totalAskNum = Number(utilsBN.undecimalize(totalAsk, decimals || 0))
    const reserveAskNum = Number(
      utilsBN.undecimalize(launchpadData?.startReserves[0], decimals),
    )
    return totalAskNum / reserveAskNum
  }, [decimals, launchpadData?.startReserves, totalAsk])

  const isStarted = Date.now() / 1000 > launchpadData.startTime.toNumber()
  return (
    <Row gutter={[12, 12]} align="middle" style={{ flexFlow: direction }}>
      <Col flex="auto">
        <Typography.Text type="secondary">
          {isStarted ? 'Sold' : 'Total raise'}
        </Typography.Text>
      </Col>
      <Col>
        <Space>
          <Typography.Title level={5} type="success">
            {isStarted && (
              <>
                <MintAmount
                  mintAddress={launchpadData.mint}
                  amount={totalAsk}
                  formatter="0,0.[000]"
                />
                /
              </>
            )}
            <MintAmount
              mintAddress={launchpadData.mint}
              amount={launchpadData?.startReserves[0]}
              formatter="0,0.[000]"
            />{' '}
            <MintSymbol mintAddress={launchpadData.mint} />
          </Typography.Title>
          {isStarted && (
            <Typography.Title level={5}>
              ({util.numeric(soldRatio).format('%0,0.[00]')})
            </Typography.Title>
          )}
        </Space>
      </Col>
    </Row>
  )
}

export default Sold
