import moment from 'moment'
import { util } from '@sentre/senhub'
import { BN } from '@project-serum/anchor'

import { Space, Typography } from 'antd'
import { MintSymbol } from '@sen-use/app'

import { DATE_FORMAT } from 'constant'

export const TRANS_HISTORY_COLUMN = [
  {
    title: 'TIME',
    dataIndex: 'time',
    render: (time: number) => (
      <Typography.Text>
        {moment(time * 1000).format(DATE_FORMAT)}
      </Typography.Text>
    ),
  },
  {
    title: 'ACCOUNT',
    dataIndex: 'authority',
    render: (authority: string) => (
      <Typography.Text
        underline
        onClick={() => window.open(util.explorer(authority), '_blank')}
        style={{ cursor: 'pointer', color: '#63E0B3' }}
      >
        {util.shortenAddress(authority)}
      </Typography.Text>
    ),
  },
  {
    title: 'PAY',
    dataIndex: 'payAmount',
    render: (payAmount: BN) => (
      <Space>
        <Typography.Text>{payAmount.toString()}</Typography.Text>
        <MintSymbol mintAddress={''} />
      </Space>
    ),
  },
  {
    title: 'RECEIVE',
    dataIndex: 'receiveAmount',
    render: (receiveAmount: BN) => (
      <Space>
        <Typography.Text>{receiveAmount.toString()}</Typography.Text>
        <MintSymbol mintAddress={''} />
      </Space>
    ),
  },
]

export const DATA = [1, 2, 3, 4, 5, 6, 7].map((item) => ({
  index: item,
  time: 1666236337,
  authority: '2vAEiACep3J1N2J6YY9gt4gAbbFEvuVdWgyu8KUkgzgn',
  payAmount: new BN(100 + item * 10),
  receiveAmount: new BN(10000 + item * 10),
}))
