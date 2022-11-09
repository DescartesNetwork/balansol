import { Button, Col, Row, Space, Typography } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import LaunchpadCard from './components/launchpadCard'
import CompletedLaunchpad from './components/launchpadCard/completedLaunchpad'

import { LaunchpadSate } from 'constant'
import { useAppRouter } from 'hooks/useAppRouter'
import { useFilterLaunchpad } from 'hooks/launchpad/useFilterLaunchpad'

const AllLaunchpad = () => {
  const { getQuery, pushHistory } = useAppRouter()
  const launchpadState = (getQuery('state') || '') as LaunchpadSate
  const launchpads = useFilterLaunchpad(launchpadState)
  const completed = launchpadState === LaunchpadSate.completed
  const upcoming = launchpadState === LaunchpadSate.upcoming

  return (
    <Row justify="center">
      <Col xs={24} sm={24} md={20} lg={18}>
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
              <Typography.Text className="amount-launchpad">
                {launchpads.length}
              </Typography.Text>
            </Space>
          </Col>
          {/* List launchpad */}
          <Col span={24}>
            <Row gutter={[12, 12]}>
              {launchpads.map((launchpadAddress) => (
                <Col key={launchpadAddress} xs={24} md={completed ? 24 : 12}>
                  {completed ? (
                    <CompletedLaunchpad launchpadAddress={launchpadAddress} />
                  ) : (
                    <LaunchpadCard
                      style={{ minHeight: upcoming ? 344 : 404 }}
                      launchpadAddress={launchpadAddress}
                    />
                  )}
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
