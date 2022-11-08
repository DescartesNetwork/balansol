import { Button, Col, Row, Space, Tooltip, Typography } from 'antd'
import { PopupButton } from '@typeform/embed-react'
import IonIcon from '@sentre/antd-ionicon'
import Banner from './banner'
import ListLaunchpad from './components/listLaunchpad'
import FAQ from './components/faq'

import { LaunchpadSate } from 'constant'
import { useAppRouter } from 'hooks/useAppRouter'

import './index.less'

const Launchpad = () => {
  const { pushHistory } = useAppRouter()

  return (
    <Row justify="center">
      <Col xs={24} sm={24} md={20} lg={18}>
        <Row gutter={[0, 48]}>
          <Col span={24}>
            <Banner />
          </Col>
          <Col span={24}>
            <Row gutter={[0, 8]}>
              <Col span={24} style={{ textAlign: 'right' }}>
                <Tooltip title="View your purchased">
                  <Button
                    icon={<IonIcon name="bag-handle-outline" />}
                    onClick={() => pushHistory('/launchpad-your-purchased')}
                    ghost
                  />
                </Tooltip>
              </Col>
              <Col span={24}>
                <ListLaunchpad state={LaunchpadSate.active} />
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            <ListLaunchpad state={LaunchpadSate.upcoming} />
          </Col>
          <Col span={24}>
            <ListLaunchpad state={LaunchpadSate.completed} />
          </Col>
          <Col span={24} /> {/** Safe place */}
          <Col span={24} style={{ textAlign: 'center' }}>
            <Space direction="vertical" size={24}>
              <Typography.Title>Ready to launch your project?</Typography.Title>
              <PopupButton
                id="iWsRUCat"
                className="balansol-btn balansol-btn-primary balansol-btn-lg"
              >
                Apply now
              </PopupButton>
            </Space>
          </Col>
          <Col span={24} /> {/** Safe place */}
          <Col span={24}>
            <FAQ />
          </Col>
          <Col span={24} /> {/** Safe place */}
        </Row>
      </Col>
    </Row>
  )
}

export default Launchpad
