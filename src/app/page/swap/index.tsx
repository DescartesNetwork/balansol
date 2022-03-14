import React from 'react'

import { Button, Card, Col, Row } from 'antd'
import AskInput from './askInput'
import BidInput from './bidInput'
import Review from './review'
import SettingArea from './settingArea'
import IonIcon from 'shared/antd/ionicon'
import PreviewSwap from 'app/components/previewSwap'

import './index.less'

export default function Swap() {
  const onSwitch = () => {
    console.log('Switch input')
  }
  return (
    <Row justify="center">
      <Col lg={8}>
        <Card style={{ boxShadow: 'unset' }}>
          <Row gutter={[0, 0]} justify="end">
            <Col>
              <SettingArea />
            </Col>
            <Col span={24}>
              <Card
                bordered={false}
                className="card-swap"
                bodyStyle={{ padding: 0 }}
              >
                <AskInput />
              </Card>
            </Col>
            <Col
              span={24}
              style={{
                top: -10,
                justifyContent: 'center',
                zIndex: 1,
                display: 'flex',
              }}
            >
              <Button
                className="btn-switch-type"
                size="small"
                icon={<IonIcon name="git-compare-outline" />}
                onClick={onSwitch}
              />
            </Col>
            <Col span={24} style={{ top: -18 }}>
              <Card
                bordered={false}
                className="card-swap"
                bodyStyle={{ padding: 0 }}
              >
                <BidInput />
              </Card>
            </Col>
            <Col span={24}>
              <PreviewSwap />
            </Col>
            <Col span={24} style={{ top: '32px' }}>
              <Review />
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  )
}
