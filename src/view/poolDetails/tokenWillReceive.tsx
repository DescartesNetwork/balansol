import { BN } from '@coral-xyz/anchor'
import { MintAvatar, MintSymbol, MintAmount } from '@sen-use/app'
import { Col, Row, Space, Typography } from 'antd'

const TokenWillReceive = ({
  mintAddress,
  amount,
}: {
  mintAddress: string
  amount: BN
}) => {
  return (
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
        <Typography.Text>
          <MintAmount mintAddress={mintAddress} amount={amount} />
        </Typography.Text>
      </Col>
    </Row>
  )
}

export default TokenWillReceive
