import { Card, Col, Row, Typography } from 'antd'
import EndIn from 'view/launchpad/components/endIn'
import Fundraising from 'view/launchpad/components/fundraising'
import Sold from 'view/launchpad/components/sold'
import YourBought from 'view/launchpad/components/yourBought'
import { LaunchpadCardProps } from 'view/launchpad/components/launchpadCard'
import { useParticipants } from 'hooks/launchpad/useParticipants'

const Progress = ({ launchpadAddress }: LaunchpadCardProps) => {
  const participants = useParticipants(launchpadAddress)

  return (
    <Card>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <YourBought launchpadAddress={launchpadAddress} />
        </Col>
        <Col span={24}>
          <Row>
            <Col flex="auto">
              <Typography.Text type="secondary">Participants</Typography.Text>
            </Col>
            <Col>
              <Typography.Text>{participants.totalUsers}</Typography.Text>
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
