import { Card, Row, Col, Space, Avatar, Typography, Radio } from 'antd'

import { MintAvatar } from 'shared/antd/mint'
import NumericInput from 'shared/antd/numericInput'

const WithdrawCardToken = () => {
  return (
    <Card
      style={{
        background: '#142042',
        boxShadow: 'unset',
      }}
      bordered={false}
      bodyStyle={{ padding: 16 }}
    >
      <Row align="middle">
        <Col span={16}>
          <Space className="mint-select">
            <Avatar.Group style={{ display: 'table-cell' }}>
              <MintAvatar mintAddress="" />
              <MintAvatar mintAddress="" />
              <MintAvatar mintAddress="" />
            </Avatar.Group>
            <Typography.Text type="secondary" style={{ color: '#F3F3F5' }}>
              50USDC-25SNTR-25KUSD
            </Typography.Text>
          </Space>
        </Col>
        <Col span={8}>
          <NumericInput
            bordered={false}
            style={{
              textAlign: 'right',
              fontSize: 24,
            }}
            placeholder="0"
          />
        </Col>
        <Col span={24}>
          <Row align="middle">
            <Col flex="auto">
              <Space className="caption">
                <Typography.Text type="secondary">Available:</Typography.Text>
                <Typography.Text type="secondary" style={{ cursor: 'pointer' }}>
                  <span style={{ color: '#F3F3F5' }}>98.5</span> LP
                </Typography.Text>
              </Space>
            </Col>
            <Col>
              <Radio.Group buttonStyle="solid">
                <Space>
                  <Space size={4} direction="vertical">
                    <Radio.Button className="percent-btn" value={50} />
                    <Typography.Text type="secondary" className="caption">
                      50%
                    </Typography.Text>
                  </Space>
                  <Space size={4} direction="vertical">
                    <Radio.Button className="percent-btn" value={100} />
                    <Typography.Text type="secondary" className="caption">
                      100%
                    </Typography.Text>
                  </Space>
                </Space>
              </Radio.Group>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  )
}

export default WithdrawCardToken
