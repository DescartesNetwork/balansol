import { Button, Col, Row, Space, Typography } from 'antd'
import LaunchpadCard from '../components/launchpadCard'

import { LaunchpadSate } from 'constant'

import './index.less'

type ListLaunchpadProps = {
  type: LaunchpadSate
}

const ListLaunchpad = ({ type }: ListLaunchpadProps) => {
  return (
    <Row gutter={[0, 8]}>
      <Col span={24}>
        <Row justify="space-between">
          <Col>
            <Space size={16} align="center">
              <Typography.Title
                level={2}
                style={{ textTransform: 'capitalize' }}
              >
                {type}
              </Typography.Title>
              <Typography.Text className="amount-launchpad">2</Typography.Text>
            </Space>
          </Col>
          <Col>
            <Button type="text">View all</Button>
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <Row gutter={[24, 24]}>
          {[1, 2].map((project) => (
            <Col key={project} xs={24} md={12}>
              <LaunchpadCard />
            </Col>
          ))}
        </Row>
      </Col>
    </Row>
  )
}

export default ListLaunchpad
