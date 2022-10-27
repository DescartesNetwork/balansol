import { Card, Col, Row, Typography } from 'antd'
import Fundraising from '../fundraising'
import LaunchpadProfile from '../launchpadProfile'
import Price from '../price'

import { useAppRouter } from 'hooks/useAppRouter'
import { LaunchpadCardProps } from './index'

const CompletedLaunchpad = ({ launchpadAddress }: LaunchpadCardProps) => {
  const { pushHistory } = useAppRouter()
  return (
    <Card
      hoverable
      style={{ cursor: 'pointer' }}
      onClick={() => pushHistory('/launchpad-details', { launchpadAddress })}
    >
      <Row gutter={[8, 8]} align="middle">
        <Col span={8}>
          <LaunchpadProfile launchpadAddress={launchpadAddress} />
        </Col>
        <Col span={16}>
          <Row gutter={[8, 8]} style={{ height: '100%' }}>
            <Col span={8}>
              <Row
                gutter={[12, 12]}
                style={{ flexFlow: 'column' }}
                align="middle"
              >
                <Col flex="auto">
                  <Typography.Text type="secondary">
                    Participants
                  </Typography.Text>
                </Col>
                <Col>
                  <Typography.Text>83</Typography.Text>
                </Col>
              </Row>
            </Col>
            <Col span={8}>
              <Price launchpadAddress={launchpadAddress} direction="column" />
            </Col>
            <Col span={8}>
              <Fundraising
                launchpadAddress={launchpadAddress}
                direction="column"
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  )
}

export default CompletedLaunchpad
