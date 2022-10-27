import { Button, Col, Row } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import BuyToken from './buyToken'
import Information from './information'
import Progress from './progress'

import { useAppRouter } from 'hooks/useAppRouter'

const LaunchpadDetails = () => {
  const { pushHistory, getQuery } = useAppRouter()
  const launchpadAddress = getQuery('launchpadAddress') || ''

  return (
    <Row justify="center">
      <Col sm={24} xs={24} md={24} lg={18}>
        <Row gutter={[0, 24]}>
          <Col span={24}>
            <Button
              onClick={() => pushHistory('/launchpad')}
              type="text"
              icon={<IonIcon name="chevron-back-outline" />}
            >
              Back
            </Button>
          </Col>
          <Col span={24}>
            <Row gutter={[24, 24]}>
              <Col xs={24} md={14}>
                <Information launchpadAddress={launchpadAddress} />
              </Col>
              <Col xs={24} md={10}>
                <Row gutter={[0, 24]}>
                  <Col span={24}>
                    <BuyToken launchpadAddress={launchpadAddress} />
                  </Col>
                  <Col span={24}>
                    <Progress launchpadAddress={launchpadAddress} />
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
          <Col span={24} />
        </Row>
      </Col>
    </Row>
  )
}

export default LaunchpadDetails
