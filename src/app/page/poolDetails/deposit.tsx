import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BN } from '@project-serum/anchor'

import { Button, Col, Modal, Row, Typography } from 'antd'
import MintInput from 'app/components/mintInput'
import IonIcon from 'shared/antd/ionicon'
import { MintSymbol } from 'shared/antd/mint'

import { checkDepositInfo, notifyError, notifySuccess } from 'app/helper'
import { AppState } from 'app/model'
import {
  calcDepositPriceImpact,
  calcNormalizedWeight,
  calcTotalSupplyPool,
} from 'app/helper/oracles'
import { useOracles } from 'app/hooks/useOracles'
import { useMint } from '@senhub/providers'
import { DepositInfo } from 'app/constant'
import { numeric } from 'shared/util'

const Deposit = ({ poolAddress }: { poolAddress: string }) => {
  const {
    pools: { [poolAddress]: poolData },
  } = useSelector((state: AppState) => state)

  const [deposits, setDeposits] = useState<DepositInfo[]>([])
  const [visible, setVisible] = useState(false)
  const [disable, setDisable] = useState(true)
  const [impactPrice, setImpactPrice] = useState(0)
  const [lpOutTotal, setLpOutTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const { getDecimals } = useMint()
  const { decimalizeMintAmount } = useOracles()

  useEffect(() => {
    const initialData: DepositInfo[] = poolData.mints.map((value) => {
      return { address: value.toBase58(), amount: '' }
    })
    setDeposits(initialData)
  }, [dispatch, poolAddress, poolData.mints])

  useEffect(() => {
    for (let i = 0; i < deposits.length; i++) {
      if (Number(deposits[i].amount) !== 0) return setDisable(false)
    }
    setDisable(true)
  }, [deposits])

  const estimateImpactPriceAndLP = useCallback(async () => {
    setImpactPrice(0)
    if (!checkDepositInfo(deposits, poolData)) return setLpOutTotal(0)

    let amountIns: BN[] = []
    let decimalIns: number[] = []

    for (let i = 0; i < deposits.length; i++) {
      const decimalIn = await getDecimals(deposits[i].address)
      const amountBn = await decimalizeMintAmount(
        deposits[i].amount,
        deposits[i].address,
      )
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
    const { lpOut, impactPrice } = calcDepositPriceImpact(
      amountIns,
      poolData.reserves,
      poolData.weights,
      totalSupplyBN,
      decimalIns,
      poolData.fee,
    )

    setLpOutTotal(lpOut)
    setImpactPrice(impactPrice)
  }, [decimalizeMintAmount, deposits, getDecimals, poolData])

  useEffect(() => {
    estimateImpactPriceAndLP()
  }, [estimateImpactPriceAndLP])

  const onChange = (mint: string, value: string) => {
    const depositeInfoClone = deposits.map((info) => {
      if (info.address !== mint) return info

      return { address: info?.address, amount: value }
    })

    setDeposits(depositeInfoClone)
  }

  const onSubmit = async () => {
    setLoading(true)
    try {
      const amountsIn = await Promise.all(
        deposits.map(
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

  const lpOutDisplay = useMemo(() => {
    const clonedLp = numeric(lpOutTotal).format('0,0.[00]')
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
                      amount={String(deposits[index]?.amount)}
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
                    <span style={{ color: '#03A326' }}>
                      {impactPrice.toFixed(2)} %
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
