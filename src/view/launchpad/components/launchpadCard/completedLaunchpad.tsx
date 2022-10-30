import { Card, Col, Row, Typography } from 'antd'
import Fundraising from '../fundraising'
import LaunchpadProfile from '../launchpadProfile'
import Price from '../price'

import { useAppRouter } from 'hooks/useAppRouter'
import { LaunchpadCardProps } from './index'
import { useWidth } from '@sentre/senhub'
import { useParticipants } from 'hooks/launchpad/useParticipants'

const CompletedLaunchpad = ({ launchpadAddress }: LaunchpadCardProps) => {
  const { pushHistory } = useAppRouter()
  const width = useWidth()
  const participants = useParticipants(launchpadAddress)

  const isMobile = width < 983
  const direction = isMobile ? 'row' : 'column'
  return (
    <Card
      hoverable
      style={{ cursor: 'pointer' }}
      onClick={() => pushHistory('/launchpad-details', { launchpadAddress })}
    >
      <Row gutter={[8, 8]} align="middle">
        <Col sm={24} xs={24} md={24} lg={8}>
          <LaunchpadProfile launchpadAddress={launchpadAddress} />
        </Col>
        <Col sm={24} xs={24} md={24} lg={16}>
          <Row gutter={[8, 8]} style={{ height: '100%' }}>
            <Col xs={24} sm={24} md={24} lg={8}>
              <Row
                gutter={[12, 12]}
                style={{ flexFlow: direction }}
                align="middle"
              >
                <Col flex="auto">
                  <Typography.Text type="secondary">
                    Participants
                  </Typography.Text>
                </Col>
                <Col>
                  <Typography.Text>{participants.total}</Typography.Text>
                </Col>
              </Row>
            </Col>
            <Col xs={24} sm={24} md={24} lg={8}>
              <Price
                launchpadAddress={launchpadAddress}
                direction={direction}
              />
            </Col>
            <Col xs={24} sm={24} md={24} lg={8}>
              <Fundraising
                launchpadAddress={launchpadAddress}
                direction={direction}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  )
}

export default CompletedLaunchpad
