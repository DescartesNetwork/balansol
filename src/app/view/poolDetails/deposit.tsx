import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { BN } from '@project-serum/anchor'

import { Button, Col, Modal, Row, Typography } from 'antd'
import MintInput from 'app/components/mintInput'
import IonIcon from 'shared/antd/ionicon'
import { MintSymbol } from 'shared/antd/mint'

import {
  checkValidDepositAmountIns,
  notifyError,
  notifySuccess,
} from 'app/helper'
import { AppState } from 'app/model'
import {
  calcPriceImpact,
  calcNormalizedWeight,
  calcTotalSupplyPool,
} from 'app/helper/oracles'
import { useOracles } from 'app/hooks/useOracles'
import { useMint } from '@senhub/providers'
import { numeric } from 'shared/util'

const Deposit = ({ poolAddress }: { poolAddress: string }) => {
  const {
    pools: { [poolAddress]: poolData },
  } = useSelector((state: AppState) => state)

  const [amounts, setAmounts] = useState<string[]>(
    new Array(poolData.mints.length).fill('0'),
  )
  const [visible, setVisible] = useState(false)
  const [disable, setDisable] = useState(true)
  const [impactPrice, setImpactPrice] = useState(0)
  const [lpOutTotal, setLpOutTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const { getDecimals } = useMint()
  const { decimalizeMintAmount } = useOracles()

  // TODO: check balance
  useEffect(() => {
    for (let i = 0; i < amounts.length; i++)
      if (!!Number(amounts[i])) return setDisable(false)
    setDisable(true)
  }, [amounts])

  const estimateImpactPriceAndLP = useCallback(async () => {
    setImpactPrice(0)
    if (!checkValidDepositAmountIns(amounts)) return setLpOutTotal(0)

    let amountIns: BN[] = []
    let decimalIns: number[] = []

    for (let i in amounts) {
      const decimalIn = await getDecimals(poolData.mints[i].toBase58())
      const amountBn = await decimalizeMintAmount(amounts[i], poolData.mints[i])
      amountIns.push(amountBn)
      decimalIns.push(decimalIn)
    }

    const totalSuply = calcTotalSupplyPool(
      poolData.reserves,
      poolData.weights,
      decimalIns,
    )
    const totalSupplyBN = await decimalizeMintAmount(
      totalSuply,
      poolData.mintLpt,
    )
    const { lpOut, impactPrice } = calcPriceImpact(
      'join',
      amountIns,
      poolData.reserves,
      poolData.weights,
      totalSupplyBN,
      decimalIns,
      poolData.fee,
    )

    setLpOutTotal(lpOut)
    setImpactPrice(impactPrice)
  }, [amounts, decimalizeMintAmount, getDecimals, poolData])

  useEffect(() => {
    estimateImpactPriceAndLP()
  }, [estimateImpactPriceAndLP])

  const onChange = (idx: number, value: string) => {
    let newAmounts = [...amounts]
    newAmounts[idx] = value
    setAmounts(newAmounts)
  }

  const onSubmit = async () => {
    setLoading(true)
    try {
      const amountsIn = await Promise.all(
        poolData.mints.map(
          async (mint, idx) => await decimalizeMintAmount(amounts[idx], mint),
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

  const lpOutDisplay = useMemo(() => {
    const clonedLp = numeric(lpOutTotal).format('0,0.[0000]')
    if (lpOutTotal > 0 && lpOutTotal < 0.0001) return 'LP < 0.0001'

    return clonedLp
  }, [lpOutTotal])

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
                      amount={amounts[index]}
                      onChangeAmount={(amount) => onChange(index, amount)}
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
                    <span style={{ color: '#03A326' }}>
                      {numeric(impactPrice).format('0,0.[0000]')} %
                    </span>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row align="middle">
                  <Col flex="auto">
                    <Typography.Text type="secondary">
                      You will receive
                    </Typography.Text>
                  </Col>
                  <Col>
                    <Typography.Title level={4}>
                      {lpOutDisplay} LP
                    </Typography.Title>
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
