import { Button, Col, Row, Space, Typography } from 'antd'
import LaunchpadCard from '../launchpadCard'
import CompletedLaunchpad from '../launchpadCard/completedLaunchpad'

import { LaunchpadSate } from 'constant'
import { useAppRouter } from 'hooks/useAppRouter'

import './index.less'

type ListLaunchpadProps = {
  state: LaunchpadSate
}

const ListLaunchpad = ({ state }: ListLaunchpadProps) => {
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
              <Typography.Text className="amount-launchpad">2</Typography.Text>
            </Space>
          </Col>
          <Col>
            <Button
              onClick={() => pushHistory('/launchpad-all', { state })}
              type="text"
            >
              View all
            </Button>
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <Row gutter={[24, 24]}>
          {[1, 2].map((project) => (
            <Col key={project} xs={24} md={completed ? 24 : 12}>
              {completed ? <CompletedLaunchpad /> : <LaunchpadCard />}
            </Col>
          ))}
        </Row>
      </Col>
    </Row>
  )
}

export default ListLaunchpad
