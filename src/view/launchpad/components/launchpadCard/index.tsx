import { useWalletAddress } from '@sentre/senhub'
import { CSSProperties } from 'react'

import { Col, Row, Image, Card, Typography, Spin } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import EndIn from '../endIn'
import Sold from '../sold'
import Fundraising from '../fundraising'
import LaunchpadProfile from '../launchpadProfile'
import Price from '../price'

import { useAppRouter } from 'hooks/useAppRouter'
import { useLaunchpadData } from 'hooks/launchpad/useLaunchpadData'

import './index.less'

export type LaunchpadCardProps = {
  launchpadAddress: string
  style?: CSSProperties
}

const LaunchpadCard = ({ launchpadAddress, style }: LaunchpadCardProps) => {
  const {
    metadata,
    launchpadData: { authority },
  } = useLaunchpadData(launchpadAddress)
  const walletAddress = useWalletAddress()
  const { pushHistory } = useAppRouter()

  const owner = authority.toBase58() === walletAddress

  return (
    <Row
      className="project-card"
      onClick={() => pushHistory('/launchpad-details', { launchpadAddress })}
    >
      <Col span={24} className="project-card_header">
        <Spin spinning={!metadata}>
          <Image
            style={{ aspectRatio: '16/9', objectFit: 'cover' }}
            src={metadata?.coverPhoto}
            preview={false}
          />
        </Spin>
      </Col>
      <Col span={24}>
        <Card className="project-card_body" style={{ ...style }}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Row gutter={[24, 24]} wrap={false} justify="space-between">
                <Col>
                  <LaunchpadProfile launchpadAddress={launchpadAddress} />
                </Col>
                {owner && (
                  <Col>
                    <IonIcon className="owner" name="person-outline" />
                  </Col>
                )}
              </Row>
            </Col>
            <Col span={24}>
              <EndIn launchpadAddress={launchpadAddress} />
            </Col>
            <Col span={24}>
              <Price launchpadAddress={launchpadAddress} />
            </Col>
            <Col span={24}>
              <Sold launchpadAddress={launchpadAddress} />
            </Col>
            <Col span={24}>
              <Fundraising launchpadAddress={launchpadAddress} />
            </Col>
            <Col span={24}>
              <Typography.Paragraph
                ellipsis={{ rows: 2 }}
                style={{ margin: 0 }}
                type="secondary"
              >
                {metadata?.description}
              </Typography.Paragraph>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  )
}

export default LaunchpadCard
