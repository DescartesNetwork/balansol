import { useUI } from '@senhub/providers'

import { Row, Col, Space, Typography } from 'antd'
import { PoolAvatar } from 'app/components/pools/poolAvatar'
import Deposit from './deposit'
import Withdraw from './withdraw'

const Header = ({ poolAddress }: { poolAddress: string }) => {
  const {
    ui: { width },
  } = useUI()
  const isMobile = width < 768

  return (
    <Row gutter={[24, 24]} justify="space-between">
      <Col md={18} xs={24}>
        <Space>
          <PoolAvatar poolAddress={poolAddress} size={32} />
          <Typography.Title level={4}>Balansol LP</Typography.Title>
        </Space>
      </Col>
      <Col span={isMobile ? 24 : undefined}>
        <Space style={{ width: '100%' }}>
          <Withdraw poolAddress={poolAddress} />
          <Deposit poolAddress={poolAddress} />
        </Space>
      </Col>
    </Row>
  )
}

export default Header
