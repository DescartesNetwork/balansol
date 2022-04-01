import { BN } from '@project-serum/anchor'
import { Col, Row, Space, Typography } from 'antd'
import MintAmount from 'app/components/mint/mintAmount'
import { MintAvatar, MintSymbol } from 'shared/antd/mint'

const TokenWillReceive = ({
  mintAddress,
  amount,
}: {
  mintAddress: string
  amount: BN
}) => {
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
          <Typography.Text>
            <MintAmount mintAddress={mintAddress} amount={amount} />
          </Typography.Text>
        </Col>
      </Row>
    </Col>
  )
}

export default TokenWillReceive
