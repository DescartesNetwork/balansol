import { Card, Row, Col, Space, Typography, Radio } from 'antd'

import { MintAvatar, MintSymbol } from 'shared/antd/mint'
import NumericInput from 'shared/antd/numericInput'

const CardToken = ({ mintAddress }: { mintAddress?: string }) => {
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
        <Col>
          <Space className="mint-select">
            <MintAvatar mintAddress={mintAddress || ''} />
            <Typography.Text type="secondary">
              <MintSymbol mintAddress={mintAddress || ''} />
            </Typography.Text>
            <Typography.Text type="secondary">50%</Typography.Text>
          </Space>
        </Col>
        <Col flex="auto">
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
                  18.5
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

export default CardToken
