import { util } from '@sentre/senhub'

import { Space, Typography } from 'antd'
import { MintAvatar, MintSymbol } from 'shared/antd/mint'

import { MintSetup } from '../index'

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
    render: (amount: number) => (
      <Typography.Text>
        {util.numeric(amount).format('0,0.[00]')}
      </Typography.Text>
    ),
  },
  {
    title: 'VALUE',
    dataIndex: 'value',
    render: (value: number) => {
      return (
        <Typography.Text>
          ${util.numeric(value).format('0,0.[00]')}
        </Typography.Text>
      )
    },
  },
]
