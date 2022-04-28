import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useWallet } from '@senhub/providers'
import { PoolState } from '@senswap/balancer'

import { Space, Tooltip, Typography } from 'antd'
import IconButton from 'os/view/actionCenter/applications/walletIntro/iconButton'
import CopyToClipboard from 'react-copy-to-clipboard'

import { explorer, shortenAddress } from 'shared/util'
import IonIcon from 'shared/antd/ionicon'
import { AppState } from 'app/model'

const PoolAddressActions = ({ poolAddress }: { poolAddress: string }) => {
  const [copied, setCopied] = useState(false)
  const {
    pools: { [poolAddress]: poolData },
  } = useSelector((state: AppState) => state)
  const {
    wallet: { address: walletAddress },
  } = useWallet()
  const state = poolData.state as PoolState

  const onCopy = async () => {
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 1500)
  }
  return (
    <Space size={10}>
      {state['frozen'] && (
        <Tooltip title="Frozen Pool">
          <IonIcon name="snow-outline" />
        </Tooltip>
      )}
      {poolData.authority.toBase58() === walletAddress && (
        <Tooltip title="Your pool!">
          <IonIcon name="person-outline" />
        </Tooltip>
      )}
      <Tooltip title={poolAddress}>
        <Typography.Text
          type="secondary"
          style={{ cursor: 'pointer' }}
          onClick={() => window.open(explorer(poolAddress), '_blank')}
        >
          {shortenAddress(poolAddress, 3, '...')}
        </Typography.Text>
      </Tooltip>
      <Tooltip title="Copied" visible={copied}>
        <CopyToClipboard text={poolAddress} onCopy={onCopy}>
          <IconButton name="copy-outline" onClick={onCopy} />
        </CopyToClipboard>
      </Tooltip>
    </Space>
  )
}
export default PoolAddressActions
