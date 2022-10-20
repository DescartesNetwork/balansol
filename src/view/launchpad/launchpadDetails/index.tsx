import { Button, Col, Row } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import BuyToken from './buyToken'
import Information from './information'
import Progress from './progress'
import { useAppRouter } from 'hooks/useAppRouter'

const LaunchpadDetails = () => {
  const { pushHistory } = useAppRouter()
  return (
    <Row justify="center">
      <Col xs={24} md={18}>
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
                <Information />
              </Col>
              <Col xs={24} md={10}>
                <Row gutter={[0, 24]}>
                  <Col span={24}>
                    <BuyToken />
                  </Col>
                  <Col span={24}>
                    <Progress />
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default LaunchpadDetails
