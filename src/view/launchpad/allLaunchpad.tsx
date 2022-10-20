import { Button, Col, Row, Space, Typography } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import LaunchpadCard from './components/launchpadCard'
import CompletedLaunchpad from './components/launchpadCard/completedLaunchpad'

import { LaunchpadSate } from 'constant'
import { useAppRouter } from 'hooks/useAppRouter'

const AllLaunchpad = () => {
  const { getQuery, pushHistory } = useAppRouter()

  const launchpadState = getQuery('state') || ''
  const completed = launchpadState === LaunchpadSate.completed
  return (
    <Row justify="center">
      <Col span={18}>
        <Row gutter={[0, 18]} id="all-launchpad">
          <Col span={24}>
            <Button
              onClick={() => pushHistory('/launchpad')}
              icon={<IonIcon name="chevron-back-outline" />}
              type="text"
            >
              Back
            </Button>
          </Col>
          <Col span={24}>
            <Space size={16} align="center">
              <Typography.Title level={2}>
                All {launchpadState} launchpad
              </Typography.Title>
              <Typography.Text className="amount-launchpad">2</Typography.Text>
            </Space>
          </Col>
          <Col span={24} />
          {/* List launchpad */}
          <Col span={24}>
            <Row gutter={[12, 12]}>
              {[1, 2, 3, 4].map((launchpad) => (
                <Col key={launchpad} xs={24} md={completed ? 24 : 12}>
                  {completed ? <CompletedLaunchpad /> : <LaunchpadCard />}
                </Col>
              ))}
            </Row>
          </Col>
          <Col span={24} />
        </Row>
      </Col>
    </Row>
  )
}

export default AllLaunchpad
