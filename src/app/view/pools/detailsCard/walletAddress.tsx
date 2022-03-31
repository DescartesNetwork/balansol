import React, { useState } from 'react'

import { Space, Tooltip, Typography } from 'antd'
import IconButton from 'os/view/actionCenter/applications/walletIntro/iconButton'
import CopyToClipboard from 'react-copy-to-clipboard'

import { explorer, shortenAddress } from 'shared/util'
import { useWallet } from '@senhub/providers'

export default function WalletAddress() {
  const [copied, setCopied] = useState(false)
  const {
    wallet: { address },
  } = useWallet()

  const onCopy = async () => {
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 1500)
  }
  return (
    <Space size={10}>
      <Typography.Text
        style={{ color: '#E9E9EB', cursor: 'pointer' }}
        onClick={() => window.open(explorer(address), '_blank')}
      >
        {shortenAddress(address, 3, '...')}
      </Typography.Text>
      <Tooltip title="Copied" visible={copied}>
        <CopyToClipboard text={address} onCopy={onCopy}>
          <IconButton name="copy-outline" onClick={onCopy} />
        </CopyToClipboard>
      </Tooltip>
    </Space>
  )
}
