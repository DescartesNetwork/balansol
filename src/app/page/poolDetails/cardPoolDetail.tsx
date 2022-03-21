import { ReactNode } from 'react'

import { Card, Row, Col, Typography, Space } from 'antd'

const CardPoolDetail = ({
  title,
  content,
}: {
  title: string
  content?: ReactNode
}) => {
  return (
    <Card style={{ boxShadow: 'unset' }}>
      <Row gutter={[0, 8]}>
        <Col span={24}>
          <Typography.Text type="secondary">{title}</Typography.Text>
        </Col>
        <Col span={24}>
          <Space align="end">{content}</Space>
        </Col>
      </Row>
    </Card>
  )
}

export default CardPoolDetail
