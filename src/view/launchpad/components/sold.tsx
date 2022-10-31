import { useMintDecimals, useTheme, util } from '@sentre/senhub'
import { utilsBN } from '@sen-use/web3'

import { Col, Progress, Row, Space, Typography } from 'antd'
import { MintSymbol } from '@sen-use/app'

import { useLaunchpadData } from 'hooks/launchpad/useLaunchpadData'
import { useParticipants } from 'hooks/launchpad/useParticipants'

type SoldProps = {
  launchpadAddress: string
  isDetail?: boolean
}

const Sold = ({ launchpadAddress, isDetail = false }: SoldProps) => {
  const participants = useParticipants(launchpadAddress)
  const { launchpadData } = useLaunchpadData(launchpadAddress)
  const decimals =
    useMintDecimals({ mintAddress: launchpadData?.mint.toBase58() }) || 0
  const amount = utilsBN.undecimalize(launchpadData?.startReserves[0], decimals)
  const theme = useTheme()

  return (
    <Row align="middle">
      <Col flex="auto">
        <Typography.Text type="secondary">Sold</Typography.Text>
      </Col>
      <Col>
        <Space>
          <Typography.Title level={5}>
            {util.numeric(participants.basePrice).format('0,0.[000]')}/
            {util.numeric(amount).format('0,0.[000]')}{' '}
            <MintSymbol mintAddress={launchpadData?.mint.toBase58()} />
          </Typography.Title>
          <Typography.Title level={5}>
            (
            {util
              .numeric(Number(participants.basePrice) / Number(amount))
              .format('%0,0.[00]')}
            )
          </Typography.Title>
        </Space>
      </Col>
      <Col span={24}>
        <Progress
          strokeColor={theme === 'dark' ? '#63E0B3' : '#081438'}
          percent={(0 / Number(amount)) * 100}
          showInfo={false}
          className="sold-progress"
        />
      </Col>
      {!isDetail && (
        <Col span={24}>
          <Space>
            <Typography.Text type="secondary">Participants:</Typography.Text>
            <Typography.Text>{participants.total}</Typography.Text>
          </Space>
        </Col>
      )}
    </Row>
  )
}

export default Sold
