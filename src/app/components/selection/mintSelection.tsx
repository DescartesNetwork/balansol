import { useState } from 'react'
import LazyLoad from '@senswap/react-lazyload'

import { Row, Col, Typography, Divider } from 'antd'
import Search from './search'
import Mint from './mint'

const LIMITATION = 100

const MintSelection = ({
  selectedMint,
  onChange,
}: {
  selectedMint: string
  onChange: (mint: string) => void
}) => {
  const [mintAddresses, setMintAddresses] = useState<string[]>([])

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Typography.Title level={5}>Token Selection</Typography.Title>
      </Col>
      <Col span={24}>
        <Divider style={{ margin: 0 }} />
      </Col>
      <Col span={24}>
        <Search onChange={setMintAddresses} />
      </Col>
      <Col span={24}>
        <Row gutter={[16, 16]} style={{ height: 300 }} className="scrollbar">
          <Col span={24}>
            <Row gutter={[16, 16]}>
              {mintAddresses.slice(0, LIMITATION).map((mintAddress, i) => (
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
  )
}

export default MintSelection
