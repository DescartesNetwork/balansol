import { Button, Col, Row, Space, Typography } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import LaunchpadCard from './components/launchpadCard'

import { useAppRouter } from 'hooks/useAppRouter'
import { useYourPurchased } from 'hooks/launchpad/useYourPurchased'

const YourPurchased = () => {
  const { pushHistory } = useAppRouter()
  const launchpads = useYourPurchased()

  return (
    <Row justify="center">
      <Col xs={24} sm={24} md={20} lg={18}>
        <Row gutter={[0, 18]} id="all-launchpad">
          <Col span={24}>
            <Button
              onClick={() => pushHistory('/launchpad')}
              icon={<IonIcon name="chevron-back-outline" />}
              type="text"
            >
              Back
            </Button>
          </Col>
          <Col span={24}>
            <Space size={16} align="center">
              <Typography.Title level={2}>Your purchased</Typography.Title>
              <Typography.Text className="amount-launchpad">
                {launchpads.length}
              </Typography.Text>
            </Space>
          </Col>
          {/* List launchpad */}
          <Col span={24}>
            <Row gutter={[12, 12]}>
              {launchpads.map((launchpadAddress) => (
                <Col key={launchpadAddress} xs={24} md={12}>
                  <LaunchpadCard launchpadAddress={launchpadAddress} />
                </Col>
              ))}
            </Row>
          </Col>
          <Col span={24} />
        </Row>
      </Col>
    </Row>
  )
}

export default YourPurchased
