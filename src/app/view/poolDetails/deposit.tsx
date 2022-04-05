import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { BN } from '@project-serum/anchor'

import { Button, Col, Modal, Row, Typography } from 'antd'
import MintInput from 'app/components/mintInput'
import IonIcon from 'shared/antd/ionicon'
import { MintSymbol } from 'shared/antd/mint'

import { notifyError, notifySuccess, priceImpactColor } from 'app/helper'
import { AppState } from 'app/model'
import {
  calcDepositPriceImpact,
  calcNormalizedWeight,
} from 'app/helper/oracles'
import { useOracles } from 'app/hooks/useOracles'
import { useMint } from '@senhub/providers'
import { numeric } from 'shared/util'
import { useLptSupply } from 'app/hooks/useLptSupply'

const Deposit = ({ poolAddress }: { poolAddress: string }) => {
  const {
    pools: { [poolAddress]: poolData },
  } = useSelector((state: AppState) => state)
  const { supply } = useLptSupply(poolData.mintLpt)

  const [amounts, setAmounts] = useState<string[]>(
    new Array(poolData.mints.length).fill('0'),
  )
  const [visible, setVisible] = useState(false)
  const [impactPrice, setImpactPrice] = useState(0)
  const [lpOutTotal, setLpOutTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const { getDecimals } = useMint()
  const { decimalizeMintAmount } = useOracles()

  const estimateImpactPriceAndLP = useCallback(async () => {
    const { reserves, weights, fee, mints } = poolData
    setImpactPrice(0)

    let amountIns: BN[] = []
    let decimalIns: number[] = []

    for (let i in amounts) {
      const decimalIn = await getDecimals(mints[i].toBase58())
      const amountBn = await decimalizeMintAmount(amounts[i], mints[i])
      amountIns.push(amountBn)
      decimalIns.push(decimalIn)
    }

    const { lpOut, impactPrice } = calcDepositPriceImpact(
      amountIns,
      reserves,
      weights,
      supply,
      decimalIns,
      fee,
    )

    setLpOutTotal(lpOut)
    setImpactPrice(impactPrice)
  }, [amounts, decimalizeMintAmount, getDecimals, poolData, supply])

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
                    <span style={{ color: priceImpactColor(impactPrice) }}>
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
              disabled={!lpOutTotal}
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
