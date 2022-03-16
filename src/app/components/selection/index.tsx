import { useState, Fragment, useEffect, ReactNode } from 'react'
import LazyLoad, { forceCheck } from '@senswap/react-lazyload'

import { Row, Col, Typography, Modal, Space, Divider } from 'antd'
import IonIcon from 'shared/antd/ionicon'
import { MintAvatar, MintSymbol } from 'shared/antd/mint'
import MintSelection from './mintSelection'

import './index.less'

const Selection = ({
  selectedMint,
  mints = [],
  onChange = () => {},
  mintLabel,
}: {
  selectedMint: string
  mints?: string[]
  onChange?: (mint: string) => void
  mintLabel?: ReactNode
}) => {
  const [visible, setVisible] = useState(false)

  const onSelection = (selectedMint: string) => {
    if (onChange) onChange(selectedMint)
    return setVisible(false)
  }

  return (
    <Fragment>
      {/* Mint selected */}
      {mintLabel || (
        <Space className="mint-select" onClick={() => setVisible(true)}>
          <MintAvatar mintAddress={selectedMint} />
          <Typography.Text type="secondary">
            <MintSymbol mintAddress={selectedMint} />
          </Typography.Text>
          {mints.length && (
            <Typography.Text type="secondary">
              <IonIcon name="chevron-down-outline" />
            </Typography.Text>
          )}
        </Space>
      )}

      {/* Modal select tokens */}
      {visible && (
        <MintSelection
          selectedMint={selectedMint}
          visible={visible}
          onChange={onSelection}
          mints={mints}
          onClose={() => setVisible(false)}
        />
      )}
    </Fragment>
  )
}

export default Selection
