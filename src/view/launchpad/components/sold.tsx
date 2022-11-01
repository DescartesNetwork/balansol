import { useMemo } from 'react'
import { useMintDecimals, useTheme, util } from '@sentre/senhub'
import { utilsBN } from '@sen-use/web3'

import { Col, Progress, Row, Space, Typography } from 'antd'
import { MintAmount, MintSymbol } from '@sen-use/app'

import { useLaunchpadData } from 'hooks/launchpad/useLaunchpadData'
import { useParticipants } from 'hooks/launchpad/useParticipants'
import { useExchanges } from 'hooks/launchpad/useExchanges'

type SoldProps = {
  launchpadAddress: string
  isDetail?: boolean
}

const Sold = ({ launchpadAddress, isDetail = false }: SoldProps) => {
  const participants = useParticipants(launchpadAddress)
  const { totalAsk } = useExchanges(launchpadAddress)
  const { launchpadData } = useLaunchpadData(launchpadAddress)
  const decimals =
    useMintDecimals({ mintAddress: launchpadData?.mint.toBase58() }) || 0
  const theme = useTheme()

  const soldRatio = useMemo(() => {
    const totalAskNum = Number(utilsBN.undecimalize(totalAsk, decimals || 0))
    const reserveAskNum = Number(
      utilsBN.undecimalize(launchpadData?.startReserves[0], decimals),
    )
    return totalAskNum / reserveAskNum
  }, [decimals, launchpadData?.startReserves, totalAsk])

  return (
    <Row align="middle">
      <Col flex="auto">
        <Typography.Text type="secondary">Sold</Typography.Text>
      </Col>
      <Col>
        <Space>
          <Typography.Title level={5} type="success">
            <MintAmount
              mintAddress={launchpadData.mint}
              amount={totalAsk}
              formatter="0,0.[000]"
            />
            /
            <MintAmount
              mintAddress={launchpadData.mint}
              amount={launchpadData?.startReserves[0]}
              formatter="0,0.[000]"
            />{' '}
            <MintSymbol mintAddress={launchpadData?.mint.toBase58()} />
          </Typography.Title>
          <Typography.Title level={5}>
            ({util.numeric(soldRatio).format('%0,0.[00]')})
          </Typography.Title>
        </Space>
      </Col>
      <Col span={24}>
        <Progress
          strokeColor={theme === 'dark' ? '#63E0B3' : '#081438'}
          percent={soldRatio * 100}
          showInfo={false}
          className="sold-progress"
        />
      </Col>
      {!isDetail && (
        <Col span={24}>
          <Space>
            <Typography.Text type="secondary">Participants:</Typography.Text>
            <Typography.Text>{participants.totalUsers}</Typography.Text>
          </Space>
        </Col>
      )}
    </Row>
  )
}

export default Sold
