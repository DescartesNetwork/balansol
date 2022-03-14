import { Space, Typography } from 'antd'
import React from 'react'

const MintPool = ({ address }: { address: string }) => {
  return (
    <Space size={2}>
      <Typography.Text>50</Typography.Text>
      <Typography.Text>Usdt</Typography.Text>
    </Space>
  )
}

export default MintPool
