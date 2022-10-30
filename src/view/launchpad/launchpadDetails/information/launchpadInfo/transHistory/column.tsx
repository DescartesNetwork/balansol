import moment from 'moment'
import { util } from '@sentre/senhub'
import { BN, web3 } from '@project-serum/anchor'

import { Typography } from 'antd'
import ColumnAmount from './columnAmount'

import { DATE_FORMAT } from 'constant'
import { ChequeData } from '@sentre/launchpad'

export const TRANS_HISTORY_COLUMN = [
  {
    title: 'TIME',
    dataIndex: 'createAt',
    render: (createAt: BN) => (
      <Typography.Text>
        {moment(createAt.toNumber() * 1000).format(DATE_FORMAT)}
      </Typography.Text>
    ),
  },
  {
    title: 'ACCOUNT',
    dataIndex: 'authority',
    render: (authority: web3.PublicKey) => (
      <Typography.Text
        underline
        onClick={() =>
          window.open(util.explorer(authority.toBase58()), '_blank')
        }
        style={{ cursor: 'pointer', color: '#63E0B3' }}
      >
        {util.shortenAddress(authority.toBase58())}
      </Typography.Text>
    ),
  },
  {
    title: 'PAY',
    dataIndex: 'amount',
    render: (amount: BN, { launchpad }: ChequeData) => (
      <ColumnAmount
        amount={amount}
        launchpadAddress={launchpad.toBase58()}
        isBaseAmount
      />
    ),
  },
  {
    title: 'RECEIVE',
    dataIndex: 'amount',
    render: (amount: BN, { launchpad }: ChequeData) => (
      <ColumnAmount amount={amount} launchpadAddress={launchpad.toBase58()} />
    ),
  },
]
