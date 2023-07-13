import moment from 'moment'
import { util } from '@sentre/senhub'
import { BN, web3 } from '@coral-xyz/anchor'

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
        style={{ cursor: 'pointer' }}
        type="success"
      >
        {util.shortenAddress(authority.toBase58())}
      </Typography.Text>
    ),
  },
  {
    title: 'PAY',
    dataIndex: 'bidAmount',
    render: (bidAmount: BN, { launchpad }: ChequeData) => (
      <ColumnAmount
        amount={bidAmount}
        launchpadAddress={launchpad.toBase58()}
        isBaseAmount
      />
    ),
  },
  {
    title: 'RECEIVE',
    dataIndex: 'askAmount',
    render: (askAmount: BN, { launchpad }: ChequeData) => (
      <ColumnAmount
        amount={askAmount}
        launchpadAddress={launchpad.toBase58()}
      />
    ),
  },
]
