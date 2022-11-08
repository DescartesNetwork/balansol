import { useTheme } from '@sentre/senhub'

import { Col, Progress, Row, Space, Typography } from 'antd'
import { useLaunchpadData } from 'hooks/launchpad/useLaunchpadData'
import TimeCountDown from '../../../components/timeCountDown'
import { LaunchpadCardProps } from './launchpadCard'

const EndIn = ({ launchpadAddress }: LaunchpadCardProps) => {
  const theme = useTheme()
  const { launchpadData } = useLaunchpadData(launchpadAddress)
  const { startTime, endTime } = launchpadData
  const totalTime = endTime.toNumber() - startTime.toNumber()
  const recent = Date.now() / 1000 - startTime.toNumber()
  const percent = recent / totalTime

  const isStarted = Date.now() / 1000 > startTime.toNumber()
  const time = !isStarted ? startTime : endTime

  return (
    <Row align="middle">
      <Col flex="auto">
        <Typography.Text type="secondary">
          {isStarted ? ' End in' : 'Start in'}
        </Typography.Text>
      </Col>
      <Col>
        <Space>
          <TimeCountDown endTime={time.toNumber()} />
          {isStarted && (
            <Progress
              type="circle"
              percent={percent * 100}
              showInfo={false}
              className="end-time-progress"
              strokeWidth={10}
              strokeColor={theme === 'dark' ? '#63E0B3' : '#081438'}
            />
          )}
        </Space>
      </Col>
    </Row>
  )
}

export default EndIn
