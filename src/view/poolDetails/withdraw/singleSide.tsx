import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { BN } from '@project-serum/anchor'
import { useMint, util } from '@sentre/senhub'

import { Button, Col, Row, Typography } from 'antd'
import TokenWillReceive from '../tokenWillReceive'

import { calcWithdrawPriceImpact } from 'helper/oracles'
import { notifyError, notifySuccess, priceImpactColor } from 'helper'
import { AppState } from 'model'
import { LPTDECIMALS } from 'constant/index'
import { useOracles } from 'hooks/useOracles'
import { useLptSupply } from 'hooks/useLptSupply'

import './index.less'

type WithdrawSingleSideProps = {
  lptAmount: string
  poolAddress: string
  mintAddress: string
  onSuccess?: () => void
  withdrawableMax: number
}

const WithdrawSingleSide = ({
  poolAddress,
  lptAmount,
  mintAddress,
  onSuccess = () => {},
  withdrawableMax,
}: WithdrawSingleSideProps) => {
  const [amountReserve, setAmountReserve] = useState<BN>(new BN(0))
  const [impactPrice, setImpactPrice] = useState(0)
  const [loading, setLoading] = useState(false)
  const { getDecimals } = useMint()
  const poolData = useSelector((state: AppState) => state.pools[poolAddress])
  const { decimalize } = useOracles()
  const { supply } = useLptSupply(poolData.mintLpt)

  const isExceedWithdrawLimitation = Number(lptAmount) > withdrawableMax

  const onSubmit = async () => {
    if (Number(lptAmount) > withdrawableMax)
      return notifyError({
        message: 'Please input amount less than 30% Liquidity Provider!',
      })

    try {
      setLoading(true)
      let lptAmountBN = decimalize(lptAmount, LPTDECIMALS)
      const { txId } = await window.balansol.removeSidedLiquidity(
        poolAddress,
        mintAddress,
        lptAmountBN,
      )
      notifySuccess('Withdraw', txId)
      onSuccess()
    } catch (error) {
      notifyError(error)
    } finally {
      setLoading(false)
    }
  }

  const estimateImpactPriceAndLP = useCallback(async () => {
    let amount = decimalize(lptAmount, LPTDECIMALS)
    setImpactPrice(0)

    let decimals: number[] = []

    for (let i in poolData.reserves) {
      const decimalIn = await getDecimals(poolData.mints[i].toBase58())
      decimals.push(decimalIn)
    }
    const indexTokenOut = poolData.mints
      .map((value) => value.toBase58())
      .indexOf(mintAddress)

    const { tokenAmountOut, impactPrice } = calcWithdrawPriceImpact(
      amount,
      indexTokenOut,
      poolData.reserves,
      poolData.weights,
      supply,
      decimals,
      poolData.fee.add(poolData.taxFee),
    )
    setAmountReserve(tokenAmountOut || new BN(0))
    setImpactPrice(impactPrice)
  }, [decimalize, getDecimals, lptAmount, mintAddress, poolData, supply])

  useEffect(() => {
    estimateImpactPriceAndLP()
  }, [estimateImpactPriceAndLP])

  return (
    <Row gutter={[12, 12]} className="withdraw">
      <Col span={24}>
        <Row>
          <Col flex="auto">
            <Typography.Text type="secondary" style={{ fontSize: '14px' }}>
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
        <Row gutter={[14, 14]}>
          <Col span={24}>
            <Typography.Text type="secondary" style={{ fontSize: '14px' }}>
              You will receive
            </Typography.Text>
          </Col>
          <Col span={24}>
            <TokenWillReceive
              mintAddress={mintAddress}
              amount={amountReserve}
            />
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <Row gutter={[0, 8]}>
          <Col span={24}>
            <Button
              type="primary"
              size="large"
              block
              onClick={onSubmit}
              disabled={amountReserve.isZero() || isExceedWithdrawLimitation}
              loading={loading}
            >
              Withdraw
            </Button>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default WithdrawSingleSide
