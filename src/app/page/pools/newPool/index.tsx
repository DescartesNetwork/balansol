import { BN, web3 } from '@project-serum/anchor'
import { Fragment, useState } from 'react'

import { Button, Col, Modal, Row, Space, Steps, Typography } from 'antd'
import Selection from 'app/components/selection'
import IonIcon from 'shared/antd/ionicon'
import WeightControl from './weightControl'
import { MintActionStates } from '@senswap/balancer'
import { notifyError, notifySuccess } from 'app/helper'

const NewPool = () => {
  const [visible, setVisible] = useState(false)
  const { Step } = Steps

  const onCreate = async () => {
    try {
      const fee = new BN(500_000_000)
      const mintsConfig = [
        'FVZFSXu3yn17YdcxLD72TFDUqkdE5xZvcW18EUpRQEbe',
        '3aMbgP7aGsP1sVcFKc6j65zu7UiziP57SMFzf6ptiCSX',
        '2z6Ci38Cx6PyL3tFrT95vbEeB3izqpoLdxxBkJk2euyj',
      ].map((e) => {
        return {
          publicKey: new web3.PublicKey(e),
          action: MintActionStates.Active,
          amountIn: new BN(500_000_000),
          weight: new BN(50),
        }
      })
      const { txId, poolAddress } = await window.balansol.initializePool(
        fee,
        mintsConfig,
      )

      for (const mintConfig of mintsConfig) {
        await window.balansol.initializeJoin(
          poolAddress,
          mintConfig.publicKey,
          mintConfig.amountIn,
        )
      }
      notifySuccess('Create pool', txId)
    } catch (error) {
      notifyError(error)
    }
  }

  return (
    <Fragment>
      <Button
        type="primary"
        icon={<IonIcon name="add-outline" />}
        onClick={() => setVisible(!visible)}
        style={{ borderRadius: 40 }}
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
                    <Selection selectedMint="" onChange={() => {}} />
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
                  onClick={onCreate}
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

export default NewPool
