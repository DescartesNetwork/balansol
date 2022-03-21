import { Space, Typography } from 'antd'
import React from 'react'

const MintPool = ({ address }: { address: string }) => {
  return (
    <Space size={2}>
      <Typography.Text>Balansol LP </Typography.Text>
      <Typography.Text type="secondary">
        ( 25% USDC - 25% SOL - 50% SNTR)
      </Typography.Text>
    </Space>
  )
}

export default MintPool
