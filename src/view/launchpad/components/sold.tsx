import { useMintDecimals, useTheme, util } from '@sentre/senhub'
import { utilsBN } from '@sen-use/web3'

import { Col, Progress, Row, Space, Typography } from 'antd'
import { MintSymbol } from '@sen-use/app'
import { LaunchpadCardProps } from './launchpadCard'
import { useLaunchpadData } from 'hooks/launchpad/useLaunchpadData'

const Sold = ({ launchpadAddress }: LaunchpadCardProps) => {
  const theme = useTheme()
  const { launchpadData } = useLaunchpadData(launchpadAddress)

  const decimals =
    useMintDecimals({ mintAddress: launchpadData?.mint.toBase58() }) || 0
  const amount = utilsBN.undecimalize(launchpadData?.startReserves[0], decimals)
  return (
    <Row align="middle">
      <Col flex="auto">
        <Typography.Text type="secondary">Sold</Typography.Text>
      </Col>
      <Col>
        <Space>
          <Typography.Title level={5}>
            0/
            {util.numeric(amount).format('0,0.[000]')}{' '}
            <MintSymbol mintAddress={launchpadData?.mint.toBase58()} />
          </Typography.Title>
          <Typography.Title level={5}>
            ({util.numeric(0 / Number(amount)).format('%')})
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
      <Col span={24}>
        <Space>
          <Typography.Text type="secondary">Participants:</Typography.Text>
          <Typography.Text>99</Typography.Text>
        </Space>
      </Col>
    </Row>
  )
}

export default Sold
