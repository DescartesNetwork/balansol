import { Row, Col, Typography, Badge, Space } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

import { PresetStatusColorType } from 'antd/lib/_util/colors'

const CardDescription = ({
  description,
  statusColor = 'success',
  statusContent,
}: {
  description: string
  statusColor?: PresetStatusColorType
  statusContent: string
}) => {
  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Space size={12} align="start">
          <IonIcon name="information-circle-outline" />
          <Space direction="vertical" size={0}>
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              {description}
            </Typography.Text>
          </Space>
        </Space>
      </Col>
      <Col span={24}>
        <Space size={0}>
          <Badge status={statusColor} />
          <Typography.Text>Current status: {statusContent}</Typography.Text>
        </Space>
      </Col>
    </Row>
  )
}

export default CardDescription
