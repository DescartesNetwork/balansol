import { ReactNode } from 'react'

import { Card, Row, Col, Typography, Space } from 'antd'

const CardPoolDetail = ({
  title,
  content,
  bg,
}: {
  title: string
  content?: ReactNode
  bg: string
}) => {
  return (
    <Card className="card-detail-header" style={{ background: `url(${bg})` }}>
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
