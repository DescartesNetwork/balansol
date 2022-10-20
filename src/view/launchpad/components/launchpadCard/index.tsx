import { Col, Row, Image, Card, Typography } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import EndIn from '../endIn'
import Fundraising from '../fundraising'
import Sold from '../sold'
import LaunchpadProfile from '../launchpadProfile'
import Price from '../price'

import { useLayout } from 'hooks/useLayout'
import { useAppRouter } from 'hooks/useAppRouter'

import './index.less'

import BG from 'static/images/panel1.png'

const LaunchpadCard = () => {
  const width = useLayout('balansol-body')
  const { pushHistory } = useAppRouter()
  const rate = 18 / 24
  const HEIGHT_RATIO = 1.77777777
  const bodyWidth = width * rate - 16

  return (
    <Row
      className="project-card"
      onClick={() => pushHistory('/launchpad-details')}
    >
      <Col
        span={24}
        className="project-card_header"
        style={{ height: bodyWidth / 2 / HEIGHT_RATIO }}
      >
        <Image src={BG} preview={false} />
      </Col>
      <Col span={24}>
        <Card className="project-card_body">
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Row>
                <Col flex="auto">
                  <LaunchpadProfile />
                </Col>
                <Col>
                  <IonIcon className="owner" name="person-outline" />
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <EndIn />
            </Col>
            <Col span={24}>
              <Price />
            </Col>
            <Col span={24}>
              <Fundraising />
            </Col>
            <Col span={24}>
              <Sold />
            </Col>
            <Col span={24}>
              <Typography.Paragraph
                ellipsis={{ rows: 2 }}
                style={{ margin: 0 }}
              >
                Codyfight introduces Create2Earn, an innovative model to create,
                engage and play in a competitive environment Codyfight
                introduces Create2Earn, an innovative model to create, engage
                and play in a competitive environment
              </Typography.Paragraph>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  )
}

export default LaunchpadCard
