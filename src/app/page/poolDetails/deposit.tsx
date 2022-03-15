import { Fragment, useState } from 'react'
import { useSelector } from 'react-redux'
import { BN } from '@project-serum/anchor'

import { Button, Col, Modal, Row, Typography } from 'antd'

import { notifyError, notifySuccess } from 'app/helper'
import { AppState } from 'app/model'
import IonIcon from 'shared/antd/ionicon'
import CardToken from './cardToken'

const Deposit = ({ poolAddress }: { poolAddress: string }) => {
  const [visible, setVisible] = useState(false)
  const [mintsAmount, setMintAmount] = useState<Record<string, number>>({})
  const {
    pools: { [poolAddress]: poolData },
  } = useSelector((state: AppState) => state)

  const onChange = (mint: string, value: string) => {
    const newMintsAmount = { ...mintsAmount }
    newMintsAmount[mint] = Number(value)
    setMintAmount(newMintsAmount)
  }

  const onSubmit = async () => {
    try {
      const amountsIn = poolData.mints.map(
        (mint) => new BN(mintsAmount[mint.toBase58()]),
      )
      const { txId } = await window.sen_balancer.addLiquidity(
        poolAddress,
        amountsIn,
      )
      notifySuccess('Deposit', txId)
    } catch (error) {
      notifyError(error)
    }
  }

  return (
    <Fragment>
      <Button onClick={() => setVisible(true)}>Deposit</Button>
      {/* Modal deposit */}
      <Modal
        title={<Typography.Title level={4}>Deposit</Typography.Title>}
        visible={visible}
        onCancel={() => setVisible(false)}
        className="modal-balansol"
        footer={null}
        destroyOnClose={true}
        centered={true}
        closeIcon={<IonIcon name="close-outline" />}
      >
        <Row gutter={[0, 16]}>
          <Col span={24}>
            <Row gutter={[24, 8]}>
              {poolData.mints.map((mint) => {
                return (
                  <Col span={24}>
                    <CardToken mintAddress={mint.toBase58()}></CardToken>
                  </Col>
                )
              })}
            </Row>
          </Col>
          <Col span={24}>
            <Row gutter={[0, 13]}>
              <Col span={24}>
                <Row align="middle">
                  <Col flex="auto">
                    <Typography.Text type="secondary">
                      Price impact
                    </Typography.Text>
                  </Col>
                  <Col>
                    <span style={{ color: '#03A326' }}>0 %</span>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row align="middle">
                  <Col flex="auto">
                    <Typography.Text type="secondary">
                      You will reveice
                    </Typography.Text>
                  </Col>
                  <Col>
                    <Typography.Title level={4}>22.332 LP</Typography.Title>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            <Button className="balansol-btn" type="primary" block>
              Deposit
            </Button>
          </Col>
        </Row>
      </Modal>
    </Fragment>
  )
}

export default Deposit
