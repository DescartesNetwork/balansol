import { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BN } from '@project-serum/anchor'
import { utils } from '@senswap/sen-js'

import { Button, Col, Modal, Row, Typography } from 'antd'
import MintInput from 'app/components/mintInput'
import IonIcon from 'shared/antd/ionicon'
import { MintSymbol } from 'shared/antd/mint'
import { DepositState, setDepositState } from 'app/model/deposit.controller'

import { notifyError, notifySuccess } from 'app/helper'
import { AppState } from 'app/model'
import { useMint } from '@senhub/providers'

const Deposit = ({ poolAddress }: { poolAddress: string }) => {
  const {
    pools: { [poolAddress]: poolData },
    deposits,
  } = useSelector((state: AppState) => state)

  const [visible, setVisible] = useState(false)
  const [disable, setDisable] = useState(true)
  const [mintsAmount, setMintAmount] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const { getDecimals } = useMint()
  const dispatch = useDispatch()

  useEffect(() => {
    const initialData: DepositState = {}
    poolData.mints.map((value) => {
      initialData[value.toBase58()] = { address: value.toBase58(), amount: 0 }
      return null
    })
    dispatch(setDepositState(initialData))
  }, [dispatch, poolData.mints])

  useEffect(() => {
    for (let value in deposits) {
      console.log(Number(deposits[value].amount))
      if (Number(deposits[value].amount) === 0) return setDisable(true)
    }
    return setDisable(false)
  }, [deposits])

  const onChange = (mint: string, value: string) => {
    dispatch(
      setDepositState({ [mint]: { address: mint, amount: Number(value) } }),
    )
  }

  const onSubmit = async () => {
    setLoading(true)
    try {
      const amountsIn = await Promise.all(
        poolData.mints.map(async (mint) => {
          let mintAddress = mint.toBase58()
          let decimals = await getDecimals(mintAddress)
          let mintAmount = utils.decimalize(mintsAmount[mintAddress], decimals)
          return new BN(String(mintAmount))
        }),
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
                return (
                  <Col span={24} key={index}>
                    <MintInput
                      selectedMint={mintAddress}
                      amount={mintsAmount[mintAddress]}
                      onChangeAmount={(amount) => onChange(mintAddress, amount)}
                      mintLabel={
                        <Fragment>
                          <Typography.Text type="secondary">
                            <MintSymbol mintAddress={mintAddress || ''} />
                          </Typography.Text>
                          <Typography.Text type="secondary">44</Typography.Text>
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
                    <span style={{ color: '#03A326' }}>{} %</span>
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
