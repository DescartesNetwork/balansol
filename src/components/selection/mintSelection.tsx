import { useState } from 'react'
import LazyLoad from '@sentre/react-lazyload'

import { Row, Col, Typography, Modal } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import Search from './search'
import Mint from './mint'

const LIMIT = 100

const MintSelection = ({
  selectedMint,
  onChange,
  visible,
  mints,
  onClose,
}: {
  selectedMint: string
  onChange: (mint: string) => void
  visible: boolean
  mints: string[]
  onClose: () => void
}) => {
  const [mintsSearched, setMintsSearched] = useState(mints)

  return (
    <Modal
      visible={visible}
      closeIcon={<IonIcon name="close" />}
      footer={null}
      destroyOnClose={true}
      centered={true}
      onCancel={onClose}
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Typography.Title level={4}>Select token</Typography.Title>
        </Col>
        <Col span={24}>
          <Search mints={mints} onChange={setMintsSearched} />
        </Col>
        <Col span={24}>
          <Row gutter={[16, 16]} style={{ height: 300 }} className="scrollbar">
            <Col span={24}>
              <Row gutter={[16, 16]}>
                {mintsSearched.slice(0, LIMIT).map((mintAddress, i) => (
                  <Col span={24} key={i}>
                    <LazyLoad height={48} overflow>
                      <Mint
                        mintAddress={mintAddress}
                        onClick={() => onChange(mintAddress)}
                        active={selectedMint === mintAddress}
                      />
                    </LazyLoad>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </Modal>
  )
}

export default MintSelection
