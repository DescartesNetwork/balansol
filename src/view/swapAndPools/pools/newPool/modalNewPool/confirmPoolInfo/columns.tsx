import { util } from '@sentre/senhub'

import { Space, Typography } from 'antd'
import { MintAvatar, MintSymbol } from '@sen-use/app'

import { MintSetup } from '../index'
import { PoolInfo } from './index'

export const COLUMNS_CONFIG = [
  {
    title: 'TOKEN',
    dataIndex: 'token',
    render: (token: MintSetup) => {
      return (
        <Typography.Text>
          <Space size={8}>
            <MintAvatar mintAddress={token.addressToken} />
            <MintSymbol mintAddress={token.addressToken} />
          </Space>
        </Typography.Text>
      )
    },
  },
  {
    title: 'WEIGHT',
    dataIndex: 'token',
    render: (token: MintSetup) => {
      return (
        <Typography.Text style={{ fontWeight: 700 }}>
          {Number(token.weight)}
        </Typography.Text>
      )
    },
  },
  {
    title: 'AMOUNT',
    dataIndex: 'amount',
    render: (amount: number, poolData: PoolInfo) => {
      return (
        <Typography.Text>
          {util
            .numeric(amount)
            .format(`0,0.[${'0'.repeat(poolData.token.decimal || 9)}]a`)}
        </Typography.Text>
      )
    },
  },
  {
    title: 'VALUE',
    dataIndex: 'value',
    render: (value: number, poolData: PoolInfo) => {
      return (
        <Typography.Text>
          $
          {util
            .numeric(value)
            .format(`0,0.[${'0'.repeat(poolData.token.decimal || 9)}]`)}
        </Typography.Text>
      )
    },
  },
]
