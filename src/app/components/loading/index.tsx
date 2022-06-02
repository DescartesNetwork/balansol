import { Row, Col, Spin, Typography, Space } from 'antd'

import configs from 'app/configs'

import './index.less'

const {
  manifest: { appId },
} = configs

const Loading = () => {
  return (
    <div className="loading-screen" style={{ display: 'block' }}>
      <Row gutter={[24, 24]}>
        <Col span={24} style={{ height: 256 }} />
        <Col span={24}>
          <Row gutter={[24, 24]} justify="center">
            <Col>
              <Space direction="vertical" align="center" size={32}>
                <Spin size="large" />
                <Typography.Title level={5}>
                  Welcome to {appId}. The application is loading...
                </Typography.Title>
              </Space>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  )
}

export default Loading
