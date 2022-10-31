import { Button, Card, Col, Row, Space, Typography } from 'antd'
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
  const completed = Number(launchpadData.endTime) < Date.now() / 1000

  return (
    <Card>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Row align="middle">
            <Col flex="auto">
              <Typography.Text type="secondary">Your bought</Typography.Text>
            </Col>
            <Col>
              {!completed ? (
                <Typography.Title level={3}>
                  0 <MintSymbol mintAddress={launchpadData?.mint.toBase58()} />
                </Typography.Title>
              ) : (
                <Button type="primary" size="large">
                  <Space size={4}>
                    Claim 500
                    <MintSymbol mintAddress={launchpadData?.mint.toBase58()} />
                  </Space>
                </Button>
              )}
            </Col>
          </Row>
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
