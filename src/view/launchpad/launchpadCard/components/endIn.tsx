import { useTheme } from '@sentre/senhub'

import { Col, Progress, Row, Space, Typography } from 'antd'
import TimeCountDown from '../../../../components/timeCountDown'

const EndIn = () => {
  const theme = useTheme()

  return (
    <Row align="middle">
      <Col flex="auto">
        <Typography.Text type="secondary">End in</Typography.Text>
      </Col>
      <Col>
        <Space>
          <TimeCountDown endTime={1665722319066 / 1000 + 30 * 24 * 60 * 60} />
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
