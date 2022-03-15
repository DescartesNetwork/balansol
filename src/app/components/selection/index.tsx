import { useState, Fragment, useEffect } from 'react'
import { forceCheck } from '@senswap/react-lazyload'

import { Row, Col, Typography, Modal, Space } from 'antd'
import IonIcon from 'shared/antd/ionicon'
import { MintAvatar, MintSymbol } from 'shared/antd/mint'
import MintSelection from './mintSelection'

import './index.less'

const Selection = ({
  selectedMint,
  onChange,
}: {
  selectedMint: string
  onChange: (mint: string) => void
}) => {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    if (visible) setTimeout(forceCheck, 500)
  }, [visible])

  const onSelection = (selectedMint: string) => {
    setVisible(false)
    return onChange(selectedMint)
  }

  return (
    <Fragment>
      <Space className="mint-select" onClick={() => setVisible(true)}>
        <MintAvatar mintAddress={selectedMint} />
        <Typography.Text type="secondary">
          <MintSymbol mintAddress={selectedMint} />
        </Typography.Text>
        <Typography.Text type="secondary">
          <IonIcon name="chevron-down-outline" />
        </Typography.Text>
      </Space>
      <Modal
        visible={visible}
        onCancel={() => setVisible(false)}
        closeIcon={<IonIcon name="close" />}
        footer={null}
        destroyOnClose={true}
        centered={true}
      >
        <Row gutter={[16, 16]}>
          <Col span={24} />
          <Col span={24}>
            <MintSelection selectedMint={selectedMint} onChange={onSelection} />
          </Col>
        </Row>
      </Modal>
    </Fragment>
  )
}

export default Selection
