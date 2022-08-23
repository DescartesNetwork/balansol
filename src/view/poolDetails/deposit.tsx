import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { BN } from '@project-serum/anchor'
import { useGetMintDecimals, util } from '@sentre/senhub'
import { Button, Checkbox, Col, Modal, Row, Typography } from 'antd'
import MintInput from 'components/mintInput'
import IonIcon from '@sentre/antd-ionicon'
import { MintSymbol } from '@sen-use/app'

import { notifyError, notifySuccess, priceImpactColor } from 'helper'
import { AppState } from 'model'
import { calcDepositPriceImpact, calcNormalizedWeight } from 'helper/oracles'
import { useOracles } from 'hooks/useOracles'
import { useLptSupply } from 'hooks/useLptSupply'
import { useMintBalance } from 'hooks/useMintBalance'
import { PriceImpact } from 'constant'

const Deposit = ({ poolAddress }: { poolAddress: string }) => {
  const poolData = useSelector((state: AppState) => state.pools[poolAddress])
  const { supply } = useLptSupply(poolData.mintLpt)
  const [amounts, setAmounts] = useState<string[]>(
    new Array(poolData.mints.length).fill('0'),
  )
  const [visible, setVisible] = useState(false)
  const [impactPrice, setImpactPrice] = useState(0)
  const [lpOutTotal, setLpOutTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [disable, setDisable] = useState(true)
  const [isAcceptHighPrice, setIsAcceptHighPrice] = useState(false)
  const [baseTokenIndex, setBaseTokenIndex] = useState(0)
  const getDecimals = useGetMintDecimals()
  const { decimalizeMintAmount, undecimalizeMintAmount } = useOracles()
  const { getMintBalance } = useMintBalance()

  const estimateImpactPriceAndLP = useCallback(async () => {
    setImpactPrice(0)
    const { reserves, weights, fee, taxFee, mints } = poolData
    let amountIns: BN[] = []
    let decimalIns: number[] = []
    for (let i in amounts) {
      const decimalIn =
        (await getDecimals({ mintAddress: mints[i].toBase58() })) || 0
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
      fee.add(taxFee),
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
    setBaseTokenIndex(idx)
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
      setVisible(false)
    } catch (error) {
      notifyError(error)
    } finally {
      setLoading(false)
    }
  }

  const lpOutDisplay = useMemo(() => {
    const clonedLp = util.numeric(lpOutTotal).format('0,0.[0000]')
    if (lpOutTotal > 0 && lpOutTotal < 0.0001) return 'LP < 0.0001'

    return clonedLp
  }, [lpOutTotal])

  const onApplySuggestion = async (index: number) => {
    const { reserves, mints } = poolData
    const mintDecimal = await getDecimals({
      mintAddress: mints[index].toBase58(),
    })
    const baseBalance = await undecimalizeMintAmount(
      reserves[baseTokenIndex],
      mints[baseTokenIndex],
    )
    const currentBalance = await undecimalizeMintAmount(
      reserves[index],
      mints[index],
    )
    const balanceRatio =
      (Number(baseBalance) + Number(amounts[baseTokenIndex])) /
      Number(baseBalance)
    const suggestedAmount = (
      Number(currentBalance) *
      (balanceRatio - 1)
    ).toFixed(mintDecimal)
    let newAmounts = [...amounts]
    newAmounts[index] = String(suggestedAmount)
    setAmounts(newAmounts)
  }

  const checkAmountIns = useCallback(async () => {
    const { mints } = poolData
    for (let i in amounts) {
      const { balance } = await getMintBalance(mints[i].toBase58())
      if (Number(amounts[i]) > balance) return setDisable(true)
    }
    if (!lpOutTotal) return setDisable(true)
    if (impactPrice > PriceImpact.acceptableSwap && !isAcceptHighPrice)
      return setDisable(true)

    return setDisable(false)
  }, [
    amounts,
    getMintBalance,
    impactPrice,
    isAcceptHighPrice,
    lpOutTotal,
    poolData,
  ])

  useEffect(() => {
    checkAmountIns()
  }, [checkAmountIns])

  return (
    <Fragment>
      <Button type="primary" onClick={() => setVisible(true)} block>
        Deposit
      </Button>
      {/* Modal deposit */}
      <Modal
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        destroyOnClose={true}
        centered={true}
        closeIcon={<IonIcon name="close-outline" />}
      >
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Typography.Title level={4}>Deposit</Typography.Title>
          </Col>
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
                            {util
                              .numeric(normalizedWeight)
                              .format('0,0.[0000]%')}
                          </Typography.Text>
                        </Fragment>
                      }
                      ratioButton={
                        baseTokenIndex !== index &&
                        Number(amounts[baseTokenIndex]) > 0 && (
                          <Button
                            type="text"
                            style={{ marginRight: -15 }}
                            onClick={() => onApplySuggestion(index)}
                          >
                            Apply suggestion
                          </Button>
                        )
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
                      {util.numeric(impactPrice).format('0,0.[0000]%')}
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
          {impactPrice > PriceImpact.acceptableSwap && (
            <Col span={24}>
              <Checkbox
                onChange={(e) => setIsAcceptHighPrice(e.target.checked)}
                checked={isAcceptHighPrice}
              >
                I agree to execute this trade with the high price impact.
              </Checkbox>
            </Col>
          )}
          <Col span={24}>
            <Button
              size="large"
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
