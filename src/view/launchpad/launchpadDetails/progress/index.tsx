import { Card, Col, Row, Typography } from 'antd'
import { MintSymbol } from '@sen-use/app'
import EndIn from 'view/launchpad/components/endIn'
import Fundraising from 'view/launchpad/components/fundraising'
import Sold from 'view/launchpad/components/sold'

import { LaunchpadCardProps } from 'view/launchpad/components/launchpadCard'
import { useLaunchpadData } from 'hooks/launchpad/useLaunchpadData'
import { useParticipants } from 'hooks/launchpad/useParticipants'

const Progress = ({ launchpadAddress }: LaunchpadCardProps) => {
  const { launchpadData } = useLaunchpadData(launchpadAddress)
  const participants = useParticipants(launchpadAddress)
  return (
    <Card>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Row>
            <Col flex="auto">
              <Typography.Text type="secondary">Your bought</Typography.Text>
            </Col>
            <Col>
              <Typography.Title level={3}>
                0 <MintSymbol mintAddress={launchpadData?.mint.toBase58()} />
              </Typography.Title>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row>
            <Col flex="auto">
              <Typography.Text type="secondary">Participants</Typography.Text>
            </Col>
            <Col>
              <Typography.Text>{participants.total}</Typography.Text>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <EndIn launchpadAddress={launchpadAddress} />
        </Col>
        <Col span={24}>
          <Fundraising launchpadAddress={launchpadAddress} />
        </Col>
        <Col span={24}>
          <Sold isDetail launchpadAddress={launchpadAddress} />
        </Col>
      </Row>
    </Card>
  )
}

export default Progress
