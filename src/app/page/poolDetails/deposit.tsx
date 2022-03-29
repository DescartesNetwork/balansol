import { Fragment, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Button, Col, Modal, Row, Typography } from 'antd'
import MintInput from 'app/components/mintInput'
import IonIcon from 'shared/antd/ionicon'
import { MintSymbol } from 'shared/antd/mint'
import { DepositInfo, setDepositState } from 'app/model/deposit.controller'

import { notifyError, notifySuccess } from 'app/helper'
import { AppState } from 'app/model'
import {
  caclLpForTokensZeroPriceImpact,
  calcBptOutGivenExactTokensIn,
  calcNormalizedWeight,
  calcTotalSupplyPool,
  getMintInfo,
} from 'app/helper/oracles'
import { useOracles } from 'app/hooks/useOracles'
import { GENERAL_NORMALIZED_NUMBER } from 'app/constant'
import { BN } from '@project-serum/anchor'

const Deposit = ({ poolAddress }: { poolAddress: string }) => {
  const {
    pools: { [poolAddress]: poolData },
    deposits: { depositInfo },
  } = useSelector((state: AppState) => state)

  const [visible, setVisible] = useState(false)
  const [disable, setDisable] = useState(true)
  const [impactPrice, setImpactPrice] = useState('0')
  const [lpOutTotal, setLpOutTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  const { decimalizeMintAmount, undecimalizeMintAmount } = useOracles()

  useEffect(() => {
    const initialData: DepositInfo[] = []
    poolData.mints.map((value) => {
      initialData.push({ address: value.toBase58(), amount: '' })
      return null
    })
    dispatch(setDepositState({ poolAddress, depositInfo: initialData }))
  }, [dispatch, poolAddress, poolData.mints])

  useEffect(() => {
    for (let i = 0; i < depositInfo.length; i++) {
      if (Number(depositInfo[i].amount) !== 0) return setDisable(false)
    }
    setDisable(true)
  }, [depositInfo])

  useEffect(() => {
    ;(async () => {
      const noneZeroAmouts = depositInfo.filter((value) => {
        return !!value.amount && Number(value.amount) !== 0
      })

      setImpactPrice('0')

      if (noneZeroAmouts.length === 0) return setLpOutTotal(0)

      const mintInfos = []

      for (let i = 0; i < noneZeroAmouts.length; i++) {
        const mintInfo = getMintInfo(poolData, noneZeroAmouts[i].address)
        if (!mintInfo?.reserve || !mintInfo.normalizedWeight) {
          return setLpOutTotal(0)
        }
        mintInfos.push(mintInfo.reserve)
      }

      const poolReverses = await Promise.all(
        poolData.reserves.map(async (value, idx) => {
          const undecilizedReserves = await undecimalizeMintAmount(
            value,
            poolData.mints[idx],
          )
          return undecilizedReserves
        }),
      )

      const poolWeights = await Promise.all(
        poolData.weights.map(async (value, idx) => {
          const undecilizedWeights = await undecimalizeMintAmount(
            value,
            poolData.mints[idx],
          )
          return undecilizedWeights
        }),
      )

      const totalSuply = calcTotalSupplyPool(poolReverses, poolWeights)
      const totalSupplyBN = await decimalizeMintAmount(
        totalSuply,
        poolData.mintLpt,
      )

      let amountIns: BN[] = []
      let balanceIns: BN[] = []
      let weightIns: BN[] = []

      for (let i = 0; i < depositInfo.length; i++) {
        console.log(poolData.reserves[i].toNumber(), 'poolData.reserves[i]')

        const amountBn = await decimalizeMintAmount(
          depositInfo[i].amount,
          depositInfo[i].address,
        )
        balanceIns.push(poolData.reserves[i])
        weightIns.push(poolData.weights[i])

        amountIns.push(amountBn)
      }

      // let LpOut = calcBptOutGivenExactTokensIn(
      //   amountIns,
      //   balanceIns,
      //   weightIns,
      //   totalSuply,
      //   poolData.fee.toNumber() / GENERAL_NORMALIZED_NUMBER,
      // )

      const LpOutZeroPriceImpact = caclLpForTokensZeroPriceImpact(
        amountIns,
        balanceIns,
        weightIns,
        totalSupplyBN,
        poolData.fee,
      )

      // setLpOutTotal(LpOut)
      // Need to double check again later
      console.log(LpOutZeroPriceImpact.toNumber(), 'balanceIns')
      // if (LpOut > LpOutZeroPriceImpact) {
      //   return setImpactPrice('0')
      // }
      // const impactPrice = ((1 - LpOut / LpOutZeroPriceImpact) * 100).toFixed(2)
      setImpactPrice(impactPrice)
    })()
  }, [decimalizeMintAmount, depositInfo, poolData, undecimalizeMintAmount])

  const onChange = (mint: string, value: string) => {
    const depositeInfoClone = depositInfo.map((info, idx) => {
      if (info.address === mint) {
        return { address: info.address, amount: value }
      }
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

  const lpOutDisplay = useMemo(() => {
    const clonedLp = lpOutTotal.toFixed(4)
    console.log(clonedLp, 'clonedLp')
    if (Number(clonedLp) < 0.0001) {
      return 'LP < 0.0001'
    }
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
                    <span style={{ color: '#03A326' }}>{impactPrice} %</span>
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
