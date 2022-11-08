import { useMemo } from 'react'
import { useMintDecimals, useTheme, util } from '@sentre/senhub'
import { utilsBN } from '@sen-use/web3'

import { Col, Progress, Row, Space, Typography } from 'antd'
import { MintAmount, MintSymbol } from '@sen-use/app'

import { useLaunchpadData } from 'hooks/launchpad/useLaunchpadData'
import { useParticipants } from 'hooks/launchpad/useParticipants'

type FundraisingProps = {
  launchpadAddress: string
  isDetail?: boolean
  direction?: string
}

const Fundraising = ({
  launchpadAddress,
  isDetail = false,
  direction = 'row',
}: FundraisingProps) => {
  const { launchpadData } = useLaunchpadData(launchpadAddress)
  const { totalBid, totalUsers } = useParticipants(launchpadAddress)
  const theme = useTheme()
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

  const isStarted = Date.now() / 1000 > launchpadData.startTime.toNumber()

  return (
    <Row gutter={[8, 8]}>
      <Col span={24}>
        <Row gutter={[12, 12]} style={{ flexFlow: direction }}>
          <Col flex="auto">
            <Typography.Text type="secondary">Fundraising goal</Typography.Text>
          </Col>
          <Col>
            <Space>
              <Typography.Title level={5} type="success">
                {isStarted && (
                  <>
                    <MintAmount
                      mintAddress={launchpadData.stableMint}
                      amount={totalBid}
                      formatter="0,0.[000]"
                    />
                    /
                  </>
                )}
                <MintAmount
                  mintAddress={launchpadData.stableMint}
                  amount={launchpadData?.startReserves[1]}
                  formatter="0,0.[000]"
                />{' '}
                <MintSymbol
                  mintAddress={launchpadData?.stableMint.toBase58()}
                />
              </Typography.Title>
              {isStarted && (
                <Typography.Title level={5}>
                  ({util.numeric(fundraisingRatio).format('%0,0.[00]')})
                </Typography.Title>
              )}
            </Space>
          </Col>
        </Row>
      </Col>
      {!isDetail && isStarted && (
        <Col span={24}>
          <Row gutter={[8, 8]}>
            <Col span={24}>
              <Progress
                strokeColor={theme === 'dark' ? '#63E0B3' : '#081438'}
                percent={fundraisingRatio * 100}
                showInfo={false}
                className={
                  fundraisingRatio >= 1
                    ? 'sold-progress active'
                    : 'sold-progress'
                }
              />
            </Col>
            <Col span={24}>
              <Space>
                <Typography.Text type="secondary">
                  Participants:
                </Typography.Text>
                <Typography.Text>{totalUsers}</Typography.Text>
              </Space>
            </Col>
          </Row>
        </Col>
      )}
    </Row>
  )
}

export default Fundraising
