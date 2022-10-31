import { util } from '@sentre/senhub'

import { Col, Row, Space, Typography } from 'antd'

import { useLaunchpadData } from 'hooks/launchpad/useLaunchpadData'
import { useParticipants } from 'hooks/launchpad/useParticipants'

type FundraisingProps = {
  direction?: string
  launchpadAddress: string
}

const Fundraising = ({
  direction = 'row',
  launchpadAddress,
}: FundraisingProps) => {
  const { metadata } = useLaunchpadData(launchpadAddress)
  const participants = useParticipants(launchpadAddress)

  return (
    <Row gutter={[12, 12]} align="middle" style={{ flexFlow: direction }}>
      <Col flex="auto">
        <Typography.Text type="secondary">Fundraising goal</Typography.Text>
      </Col>
      <Col>
        <Space>
          <Typography.Title level={5}>
            {util.numeric(participants.baseAmount).format('0,0.[000]')}/
            {metadata?.baseAmount} USDC
          </Typography.Title>
          <Typography.Title level={5}>
            {util
              .numeric(
                Number(participants.baseAmount) / Number(metadata?.baseAmount),
              )
              .format('%0,0.[00]')}
          </Typography.Title>
        </Space>
      </Col>
    </Row>
  )
}

export default Fundraising
