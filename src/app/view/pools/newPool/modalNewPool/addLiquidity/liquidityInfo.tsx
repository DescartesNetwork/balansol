import { useCallback, useEffect, useMemo, useState } from 'react'
import { useMint } from '@senhub/providers'

import { Button, Col, Row, Typography } from 'antd'
import { MintSymbol } from 'shared/antd/mint'

import { notifyError, notifySuccess } from 'app/helper'
import { fetchCGK, numeric } from 'shared/util'
import { PoolCreatingStep } from 'app/constant'
import { useSelector } from 'react-redux'
import { AppState } from 'app/model'
import { useOracles } from 'app/hooks/useOracles'
import { useMintBalance } from 'app/hooks/useMintBalance'

const LiquidityInfo = ({
  poolAddress,
  setCurrentStep,
  amounts,
  onClose = () => {},
}: {
  poolAddress: string
  setCurrentStep: (step: PoolCreatingStep) => void
  amounts: string[]
  onClose?: () => void
}) => {
  const {
    pools: { [poolAddress]: poolData },
  } = useSelector((state: AppState) => state)
  const [tokenPrice, setTokenPrice] = useState<(CgkData | null)[]>([])
  const [loadingAdd, setLoadingAdd] = useState(false)
  const [loadingClose, setLoadingClose] = useState(false)
  const [disableSupply, setDisableSupply] = useState(true)
  const { tokenProvider } = useMint()
  const { decimalizeMintAmount } = useOracles()
  const { getMintBalance } = useMintBalance()

  const fetchMarketData = useCallback(async () => {
    const tokensPrice = await Promise.all(
      poolData.mints.map(async (mint) => {
        const token = await tokenProvider.findByAddress(mint.toBase58())
        const ticket = token?.extensions?.coingeckoId
        if (!ticket) return null
        const cgkData = await fetchCGK(ticket)
        return cgkData
      }),
    )
    setTokenPrice(tokensPrice)
  }, [poolData.mints, tokenProvider])

  useEffect(() => {
    fetchMarketData()
  }, [fetchMarketData])

  const onAddLiquidity = async () => {
    try {
      setLoadingAdd(true)
      let lastTxID = ''
      for (const idx in poolData.mints) {
        const mintAddress = poolData.mints[idx]
        if (!poolData.reserves[idx].isZero()) continue
        const amount = await decimalizeMintAmount(amounts[idx], mintAddress)
        const { txId } = await window.balansol.initializeJoin(
          poolAddress,
          mintAddress,
          amount,
        )
        lastTxID = txId
      }
      notifySuccess('Fund pool', lastTxID)
      setCurrentStep(PoolCreatingStep.confirmCreatePool)
    } catch (error) {
      notifyError(error)
    } finally {
      setLoadingAdd(false)
    }
  }

  const onClosePool = async () => {
    try {
      setLoadingClose(true)
      setDisableSupply(true)
      const { txId } = await window.balansol.closePool(poolAddress)
      notifySuccess('Close pool', txId)
      onClose()
    } catch (error) {
      notifyError(error)
    } finally {
      setLoadingClose(false)
    }
  }

  const totalValue = useMemo(() => {
    let total = 0
    amounts.forEach((amount, idx) => {
      if (!poolData.reserves[idx].isZero()) return
      total += Number(amount) * (tokenPrice[idx]?.price || 0)
    })
    return total
  }, [amounts, poolData.reserves, tokenPrice])

  const checkAmountIns = useCallback(async () => {
    const { mints } = poolData
    for (let i in amounts) {
      const { balance } = await getMintBalance(mints[i].toBase58())
      if (Number(amounts[i]) > balance || Number(amounts[i]) <= 0) {
        return setDisableSupply(true)
      }
      return setDisableSupply(false)
    }
  }, [amounts, getMintBalance, poolData])

  useEffect(() => {
    checkAmountIns()
  }, [checkAmountIns])

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        {poolData.mints.map((mint, idx) => {
          if (poolData.reserves[idx]) return null
          const mintValue = Number(amounts[idx]) * (tokenPrice[idx]?.price || 0)
          return (
            <Row key={idx}>
              <Col flex={1}>
                <Typography.Text type="secondary">
                  <MintSymbol mintAddress={mint.toBase58()} />
                </Typography.Text>
                <Typography.Text>
                  ({numeric(tokenPrice[idx]?.price).format('0,0.[0000]')})
                </Typography.Text>
              </Col>
              <Col>
                <Typography.Text>
                  ${numeric(mintValue).format('0,0.[0000]')}
                </Typography.Text>
              </Col>
            </Row>
          )
        })}
      </Col>
      <Col span={24}>
        <Row align="middle">
          <Col flex={1}>
            <Typography.Text type="secondary">Total value</Typography.Text>
          </Col>
          <Col>
            <Typography.Title level={3}>
              ${numeric(totalValue).format('0,0.[0000]')}
            </Typography.Title>
          </Col>
        </Row>
      </Col>
      <Col span={12}>
        <Button
          type="ghost"
          disabled={loadingAdd}
          loading={loadingClose}
          onClick={onClosePool}
          block
        >
          Delete pool
        </Button>
      </Col>
      <Col span={12}>
        <Button
          type="primary"
          onClick={onAddLiquidity}
          disabled={disableSupply}
          loading={loadingAdd}
          block
        >
          Supply
        </Button>
      </Col>
    </Row>
  )
}

export default LiquidityInfo
