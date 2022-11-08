import { Button, Col, Empty, Row, Space, Typography } from 'antd'
import LaunchpadCard from '../launchpadCard'
import CompletedLaunchpad from '../launchpadCard/completedLaunchpad'

import { LaunchpadSate } from 'constant'
import { useAppRouter } from 'hooks/useAppRouter'
import { useFilterLaunchpad } from 'hooks/launchpad/useFilterLaunchpad'

type ListLaunchpadProps = {
  state: LaunchpadSate
}

const ListLaunchpad = ({ state }: ListLaunchpadProps) => {
  const launchpads = useFilterLaunchpad(state)
  const { pushHistory } = useAppRouter()
  const completed = state === LaunchpadSate.completed

  return (
    <Row gutter={[0, 8]} id="launchpad">
      <Col span={24}>
        <Row justify="space-between">
          <Col>
            <Space size={16} align="center">
              <Typography.Title
                level={2}
                style={{ textTransform: 'capitalize' }}
              >
                {state}
              </Typography.Title>
              <Typography.Text className="amount-launchpad" type="success">
                {launchpads.length}
              </Typography.Text>
            </Space>
          </Col>
          <Col>
            <Button
              onClick={() => pushHistory('/launchpad-all', { state })}
              type="link"
              disabled={!launchpads.length}
              style={{ padding: 4 }}
            >
              View all
            </Button>
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        {launchpads.length ? (
          <Row gutter={[24, 24]}>
            {launchpads.slice(0, 2).map((launchpadAddress) => (
              <Col key={launchpadAddress} md={24} lg={completed ? 24 : 12}>
                {completed ? (
                  <CompletedLaunchpad launchpadAddress={launchpadAddress} />
                ) : (
                  <LaunchpadCard launchpadAddress={launchpadAddress} />
                )}
              </Col>
            ))}
          </Row>
        ) : (
          <Empty description={`No ${state} launchpads`} />
        )}
      </Col>
    </Row>
  )
}

export default ListLaunchpad
