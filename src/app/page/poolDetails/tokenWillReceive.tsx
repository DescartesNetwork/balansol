import { Col, Row, Space, Typography } from 'antd'
import { MintAvatar, MintSymbol } from 'shared/antd/mint'

const TokenWillReceive = ({ mintAddress }: { mintAddress: string }) => {
  return (
    <Col span={24}>
      <Row>
        <Col flex="auto">
          <Space>
            <MintAvatar mintAddress={mintAddress} />
            <Typography.Text type="secondary">
              <MintSymbol mintAddress={mintAddress} />
            </Typography.Text>
          </Space>
        </Col>
        <Col>
          <Typography.Text>0</Typography.Text>
        </Col>
      </Row>
    </Col>
  )
}

export default TokenWillReceive
