import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useWallet } from '@senhub/providers'
import { PoolState } from '@senswap/balancer'

import { Space, Tooltip, Typography } from 'antd'
import CopyToClipboard from 'react-copy-to-clipboard'

import { explorer, shortenAddress } from 'shared/util'
import IonIcon from '@sentre/antd-ionicon'
import { AppState } from 'app/model'

export type PoolAddressActionsProps = { poolAddress: string }

const PoolAddressActions = ({ poolAddress }: PoolAddressActionsProps) => {
  const [copied, setCopied] = useState(false)
  const poolData = useSelector((state: AppState) => state.pools[poolAddress])
  const {
    wallet: { address: walletAddress },
  } = useWallet()
  const state = poolData.state as PoolState

  const onCopy = async (e: any) => {
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
    e.stopPropagation()
  }
  return (
    <Space size={10}>
      {state['frozen'] && (
        <Tooltip title="Frozen Pool">
          <IonIcon name="snow-outline" />
        </Tooltip>
      )}
      {poolData.authority.toBase58() === walletAddress && (
        <Tooltip title="Your pool">
          <IonIcon name="person-outline" />
        </Tooltip>
      )}
      <Tooltip title={poolAddress}>
        <Typography.Text
          type="secondary"
          style={{ cursor: 'pointer' }}
          onClick={(e) => {
            window.open(explorer(poolAddress), '_blank')
            e?.stopPropagation()
          }}
        >
          {shortenAddress(poolAddress, 3, '...')}
        </Typography.Text>
      </Tooltip>
      <Tooltip title="Copied" visible={copied}>
        <CopyToClipboard text={poolAddress} onCopy={onCopy}>
          <span onClick={onCopy} style={{ cursor: 'pointer' }}>
            <IonIcon name="copy-outline" />
          </span>
        </CopyToClipboard>
      </Tooltip>
    </Space>
  )
}
export default PoolAddressActions
