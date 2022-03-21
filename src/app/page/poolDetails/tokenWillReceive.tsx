import { Col, Row, Space, Typography } from 'antd'
import { useWithdrawToken } from 'app/hooks/useWithdrawToken'
import { MintAvatar, MintSymbol } from 'shared/antd/mint'

const TokenWillReceive = ({
  mintAddress,
  amount,
}: {
  mintAddress: string
  amount?: string
}) => {
  const amountWithdrawToken = useWithdrawToken(amount || '')
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
          <Typography.Text>{amountWithdrawToken}</Typography.Text>
        </Col>
      </Row>
    </Col>
  )
}

export default TokenWillReceive
