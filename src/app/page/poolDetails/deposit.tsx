import { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BN, web3 } from '@project-serum/anchor'
import { utils } from '@senswap/sen-js'

import { Button, Col, Modal, Row, Typography } from 'antd'
import MintInput from 'app/components/mintInput'
import IonIcon from 'shared/antd/ionicon'
import { MintSymbol } from 'shared/antd/mint'
import { DepositInfo, setDepositState } from 'app/model/deposit.controller'

import { notifyError, notifySuccess } from 'app/helper'
import { AppState } from 'app/model'
import { useMint } from '@senhub/providers'
import {
  calcLpOutMultiGivenIn,
  calcLpSingleGivenIn,
  calcNormalizedWeight,
  calTotalSupplyPool as calcTotalSupplyPool,
  getMintInfo,
} from 'app/helper/oracles'
import { useOracles } from 'app/hooks/useOracles'

const Deposit = ({ poolAddress }: { poolAddress: string }) => {
  const {
    pools: { [poolAddress]: poolData },
    deposits: { poolAddress: depositPoolAddr, depositInfo },
  } = useSelector((state: AppState) => state)

  const [visible, setVisible] = useState(false)
  const [disable, setDisable] = useState(true)
  const [mintsAmount, setMintAmount] = useState<Record<string, string>>({})
  const [impactPrice, setImpactPrice] = useState(0)
  const [totalValue, setTotalValue] = useState(0)
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  const { decimalizeMintAmount, undecimalizeMintAmount } = useOracles()

  useEffect(() => {
    const initialData: DepositInfo[] = []
    poolData.mints.map((value) => {
      initialData.push({ address: value.toBase58(), amount: 0 })
      return null
    })
    dispatch(setDepositState({ poolAddress, depositInfo: initialData }))
  }, [dispatch, poolAddress, poolData.mints])

  useEffect(() => {
    for (let i = 0; i < depositInfo.length; i++) {
      if (depositInfo[i].amount === 0) return setDisable(true)
    }
    setDisable(false)
  }, [depositInfo])

  useEffect(() => {
    ;(async () => {
      const noneZeroAmouts = depositInfo.filter((value) => {
        return !!value.amount
      })

      if (noneZeroAmouts.length === 0) return setTotalValue(0)

      const mintInfos = []

      for (let i = 0; i < noneZeroAmouts.length; i++) {
        const mintInfo = getMintInfo(poolData, noneZeroAmouts[i].address)
        if (!mintInfo?.reserve || !mintInfo.normalizedWeight) {
          return setTotalValue(0)
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

      const amountsBN = await Promise.all(
        noneZeroAmouts.map(async (value) => {
          const amountBN = await decimalizeMintAmount(
            value.amount,
            value.address,
          )
          return amountBN
        }),
      )

      // const totalSupplyBN = await decimalizeMintAmount(
      //   totalSuply,
      //   poolData.mintLpt.toBase58(),
      // )
      const newTotalValue = calcLpOutMultiGivenIn(
        amountsBN,
        mintInfos,
        totalSuply,
      )
      setTotalValue(newTotalValue)
    })()
  }, [decimalizeMintAmount, depositInfo, poolData, undecimalizeMintAmount])

  const onChange = (mint: string, value: string) => {
    const depositeInfoClone = depositInfo.map((info, idx) => {
      if (info.address === mint) {
        return { address: info.address, amount: Number(value) }
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
                            {normalizedWeight}
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
                    <span style={{ color: '#03A326' }}>{} %</span>
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
                      {totalValue} LP
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
