import { useTheme } from '@sentre/senhub'

import { Col, Progress, Row, Space, Typography } from 'antd'
import { useLaunchpadData } from 'hooks/launchpad/useLaunchpadData'
import TimeCountDown from '../../../components/timeCountDown'
import { LaunchpadCardProps } from './launchpadCard'

const EndIn = ({ launchpadAddress }: LaunchpadCardProps) => {
  const theme = useTheme()
  const { launchpadData } = useLaunchpadData(launchpadAddress)
  return (
    <Row align="middle">
      <Col flex="auto">
        <Typography.Text type="secondary">End in</Typography.Text>
      </Col>
      <Col>
        <Space>
          <TimeCountDown endTime={launchpadData?.endTime.toString()} />
          <Progress
            type="circle"
            percent={80}
            showInfo={false}
            className="end-time-progress"
            strokeWidth={10}
            strokeColor={theme === 'dark' ? '#63E0B3' : '#081438'}
          />
        </Space>
      </Col>
    </Row>
  )
}

export default EndIn
