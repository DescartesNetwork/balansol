import { useMintDecimals, util } from '@sentre/senhub'
import { Col, Row, Space, Typography } from 'antd'
import { utilsBN } from 'helper/utilsBN'
import { useLaunchpadData } from 'hooks/launchpad/useLaunchpadData'

type FundraisingProps = {
  direction?: string
  launchpadAddress: string
}

const Fundraising = ({
  direction = 'row',
  launchpadAddress,
}: FundraisingProps) => {
  const { launchpadData, metadata } = useLaunchpadData(launchpadAddress)
  const stableDecimal =
    useMintDecimals({ mintAddress: launchpadData?.stableMint.toBase58() }) || 0
  return (
    <Row gutter={[12, 12]} align="middle" style={{ flexFlow: direction }}>
      <Col flex="auto">
        <Typography.Text type="secondary">Fundraising goal</Typography.Text>
      </Col>
      <Col>
        <Space>
          <Typography.Title level={5}>
            {util
              .numeric(
                utilsBN.undecimalize(
                  launchpadData?.startReserves[1],
                  stableDecimal,
                ),
              )
              .format('0,0.[000]')}
            /{metadata?.baseAmount} USDC
          </Typography.Title>
          <Typography.Title level={5}>(50%)</Typography.Title>
        </Space>
      </Col>
    </Row>
  )
}

export default Fundraising
