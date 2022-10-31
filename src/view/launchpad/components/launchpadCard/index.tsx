import { useMemo } from 'react'
import { useAppWidth, useWalletAddress, useWidth } from '@sentre/senhub'

import { Col, Row, Image, Card, Typography } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import EndIn from '../endIn'
import Fundraising from '../fundraising'
import Sold from '../sold'
import LaunchpadProfile from '../launchpadProfile'
import Price from '../price'

import { useAppRouter } from 'hooks/useAppRouter'
import { useLaunchpadData } from 'hooks/launchpad/useLaunchpadData'

import './index.less'

export type LaunchpadCardProps = {
  launchpadAddress: string
}

const LaunchpadCard = ({ launchpadAddress }: LaunchpadCardProps) => {
  const {
    metadata,
    launchpadData: { authority },
  } = useLaunchpadData(launchpadAddress)
  const walletAddress = useWalletAddress()
  const width = useWidth()
  const appWidth = useAppWidth()
  const { pushHistory } = useAppRouter()

  const rate = width > 769 ? 18 / 24 : 1
  const padding = 15 + 24 //scroll width + body padding
  const HEIGHT_RATIO = 1.77777777
  const bodyWidth = (appWidth - padding) * rate

  const height = useMemo(() => {
    if (appWidth > 991) return (bodyWidth - 24) / 2
    return bodyWidth
  }, [appWidth, bodyWidth])

  const owner = authority.toBase58() === walletAddress

  return (
    <Row
      className="project-card"
      onClick={() => pushHistory('/launchpad-details', { launchpadAddress })}
    >
      <Col
        span={24}
        className="project-card_header"
        style={{ height: height / HEIGHT_RATIO }}
      >
        <Image src={metadata?.coverPhoto} preview={false} />
      </Col>
      <Col span={24}>
        <Card className="project-card_body">
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Row>
                <Col flex="auto">
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
              <Fundraising launchpadAddress={launchpadAddress} />
            </Col>
            <Col span={24}>
              <Sold launchpadAddress={launchpadAddress} />
            </Col>
            <Col span={24}>
              <Typography.Paragraph
                ellipsis={{ rows: 2 }}
                style={{ margin: 0 }}
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