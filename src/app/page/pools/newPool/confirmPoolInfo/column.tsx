import { token } from '@project-serum/anchor/dist/cjs/utils'
import { utils } from '@senswap/sen-js'
import { Space, Typography } from 'antd'
import { MintAvatar, MintSymbol } from 'shared/antd/mint'
import { TokenInfo } from '..'

export const WORMHOLE_COLUMNS = [
  {
    title: 'TOKEN',
    dataIndex: 'token',
    render: (token: TokenInfo) => {
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
    render: (token: TokenInfo) => {
      return (
        <Typography.Text style={{ fontWeight: 700 }}>
          {Number(token.weight)} %
        </Typography.Text>
      )
    },
  },
  {
    title: 'AMOUNT',
    dataIndex: 'amount',
    render: (amount: number) => <Typography.Text>{amount}</Typography.Text>,
  },
  {
    title: 'VALUE',
    dataIndex: 'value',
    render: (value: number) => {
      return <Typography.Text>{value}</Typography.Text>
    },
  },
]
