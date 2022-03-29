import { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Button, Col, Modal, Row, Typography } from 'antd'
import MintInput from 'app/components/mintInput'
import IonIcon from 'shared/antd/ionicon'
import { MintSymbol } from 'shared/antd/mint'

import { notifyError, notifySuccess } from 'app/helper'
import { AppState } from 'app/model'
import { DepositInfo, setDepositState } from 'app/model/deposit.controller'
import { useOracles } from 'app/hooks/useOracles'
import { calcNormalizedWeight } from 'app/helper/oracles'

const Deposit = ({ poolAddress }: { poolAddress: string }) => {
  const {
    pools: { [poolAddress]: poolData },
    deposits: { depositInfo },
  } = useSelector((state: AppState) => state)

  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [disable, setDisable] = useState(true)
  const dispatch = useDispatch()
  const { decimalizeMintAmount } = useOracles()

  useEffect(() => {
    const initialData: DepositInfo[] = poolData.mints.map((value) => {
      return { address: value.toBase58(), amount: '' }
    })
    dispatch(setDepositState({ poolAddress, depositInfo: initialData }))
  }, [dispatch, poolAddress, poolData.mints])

  useEffect(() => {
    for (let i = 0; i < depositInfo.length; i++) {
      if (Number(depositInfo[i].amount) !== 0) return setDisable(false)
    }
    setDisable(true)
  }, [depositInfo])

  const onChange = (mint: string, value: string) => {
    const depositeInfoClone = depositInfo.map((info) => {
      if (info.address === mint) return { address: info.address, amount: value }
      return info
    })

    dispatch(
      setDepositState({
        depositInfo: depositeInfoClone,
      }),
    )
  }

  const onSubmit = async () => {
    setLoading(true)
    try {
      const amountsIn = await Promise.all(
        depositInfo.map(
          async (value) =>
            await decimalizeMintAmount(value.amount, value.address),
        ),
      )
      const { txId } = await window.balansol.addLiquidity(
        poolAddress,
        amountsIn,
      )

      notifySuccess('Deposit', txId)
    } catch (error) {
      notifyError(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Fragment>
      <Button type="primary" onClick={() => setVisible(true)} block>
        Deposit
      </Button>
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
              {poolData.mints.map((mint, index) => {
                let mintAddress: string = mint.toBase58()
                const normalizedWeight = calcNormalizedWeight(
                  poolData.weights,
                  poolData.weights[index],
                )

                return (
                  <Col span={24} key={mint.toBase58()}>
                    <MintInput
                      selectedMint={mintAddress}
                      amount={String(depositInfo[index]?.amount)}
                      onChangeAmount={(amount) => onChange(mintAddress, amount)}
                      mintLabel={
                        <Fragment>
                          <Typography.Text type="secondary">
                            <MintSymbol mintAddress={mintAddress || ''} />
                          </Typography.Text>
                          <Typography.Text type="secondary">
                            {normalizedWeight * 100} %
                          </Typography.Text>
                        </Fragment>
                      }
                    />
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
                    <Typography.Title level={4}>2 LP</Typography.Title>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            <Button
              className="balansol-btn"
              type="primary"
              block
              onClick={onSubmit}
              loading={loading}
              disabled={disable}
            >
              Deposit
            </Button>
          </Col>
        </Row>
      </Modal>
    </Fragment>
  )
}

export default Deposit
