import { Button, Col, Modal, Row, Space, Steps, Typography } from 'antd'
import Selection from 'app/components/selection'
import React, { Fragment, useState } from 'react'
import IonIcon from 'shared/antd/ionicon'
import WeightControl from './weightControl'

export default function New() {
  const [visible, setVisible] = useState(false)
  const { Step } = Steps

  return (
    <Fragment>
      <Button
        type="primary"
        icon={<IonIcon name="add-outline" />}
        onClick={() => setVisible(!visible)}
      >
        New
      </Button>
      <Modal
        visible={visible}
        onCancel={() => {
          setVisible(false)
        }}
        closeIcon={<IonIcon name="close" />}
        footer={null}
        destroyOnClose={true}
        centered={true}
      >
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Typography.Title level={4}>New Pool</Typography.Title>
          </Col>
          <Col span={24}>
            <Steps size="small" current={0}>
              <Step title="Select tokens and weights" />
              <Step title="Set liquidity" />
              <Step title="Confirm" />
            </Steps>
          </Col>
          <Col span={24}>
            <Row>
              <Col flex="auto">Token</Col>
              <Col>Weight</Col>
            </Row>
          </Col>
          {[1, 2].map(() => {
            return (
              <Col span={24}>
                <Row>
                  <Col flex="auto">
                    <Selection
                      value={{ poolAddresses: [] }}
                      onChange={() => {}}
                    />
                  </Col>
                  <Col style={{ display: 'flex', alignContent: 'center' }}>
                    <WeightControl />
                  </Col>
                </Row>
              </Col>
            )
          })}

          <Col span={24}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Button
                  type="primary"
                  onClick={() => {}}
                  disabled={false}
                  block
                >
                  Supply
                </Button>
              </Col>
              {false && (
                <Col span={24}>
                  <Space align="start">
                    <Typography.Text className="caption" type="danger">
                      <IonIcon name="warning-outline" />
                    </Typography.Text>
                    <Typography.Text className="caption" type="danger">
                      A pool of the desired pair of tokens had already created.
                      We highly recommend to deposit your liquidity to the pool
                      instead.
                    </Typography.Text>
                  </Space>
                </Col>
              )}
            </Row>
          </Col>
        </Row>
      </Modal>
    </Fragment>
  )
}
