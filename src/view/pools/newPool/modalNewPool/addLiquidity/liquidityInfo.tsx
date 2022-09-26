import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { rpc, useWalletAddress, util } from '@sentre/senhub'
import { MintPrice, MintSymbol, useGetMintPrice } from '@sen-use/app'
import { getAnchorProvider } from 'sentre-web3'
import { web3 } from '@project-serum/anchor'

import { Button, Col, Row, Space, Typography } from 'antd'

import { notifyError, notifySuccess } from 'helper'
import { PoolCreatingStep } from 'constant'
import { AppDispatch, AppState } from 'model'
import { useOracles } from 'hooks/useOracles'
import { useMintBalance } from 'hooks/useMintBalance'
import { removePool } from 'model/pools.controller'
import { useWrapAndUnwrapSolIfNeed } from 'hooks/useWrapAndUnwrapSolIfNeed'

export type LiquidityInfoProps = {
  poolAddress: string
  setCurrentStep: (step: PoolCreatingStep) => void
  amounts: string[]
  onClose?: () => void
}

const LiquidityInfo = ({
  poolAddress,
  setCurrentStep,
  amounts,
  onClose = () => {},
}: LiquidityInfoProps) => {
  const poolData = useSelector((state: AppState) => state.pools[poolAddress])
  const dispatch = useDispatch<AppDispatch>()
  const [tokenPrice, setTokenPrice] = useState<number[]>([])
  const [loadingAdd, setLoadingAdd] = useState(false)
  const [loadingClose, setLoadingClose] = useState(false)
  const [disabledSupply, setDisabledSupply] = useState(true)
  const { decimalizeMintAmount } = useOracles()
  const { getMintBalance } = useMintBalance()
  const getPrice = useGetMintPrice()
  const walletAddress = useWalletAddress()
  const { createWrapSolTxIfNeed } = useWrapAndUnwrapSolIfNeed()

  const fetchMarketData = useCallback(async () => {
    const tokensPrice = await Promise.all(
      poolData.mints.map(async (mint) => (await getPrice(mint)) || 0),
    )
    setTokenPrice(tokensPrice)
  }, [getPrice, poolData.mints])

  useEffect(() => {
    fetchMarketData()
  }, [fetchMarketData])

  const onAddLiquidity = async () => {
    try {
      setLoadingAdd(true)
      const txs: web3.Transaction[] = []
      for (const idx in poolData.mints) {
        const mintAddress = poolData.mints[idx]
        if (!poolData.reserves[idx].isZero()) continue
        const amount = await decimalizeMintAmount(amounts[idx], mintAddress)
        const wrapSolTx = await createWrapSolTxIfNeed(
          mintAddress.toBase58(),
          amounts[idx],
        )
        if (wrapSolTx) txs.push(wrapSolTx)

        const { transaction } = await window.balansol.initializeJoin(
          poolAddress,
          mintAddress,
          amount,
          false,
        )
        txs.push(transaction)
      }
      const anchorProvider = getAnchorProvider(
        rpc,
        walletAddress,
        window.sentre.wallet,
      )
      const txIds = await anchorProvider.sendAll(
        txs.map((tx) => {
          return { tx, signers: [] }
        }),
      )
      notifySuccess('Fund pool', txIds[txIds.length])
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
      const { txId } = await window.balansol.closePool(poolAddress)
      notifySuccess('Close pool', txId)
      onClose()
      dispatch(removePool({ address: poolAddress }))
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
      total += Number(amount) * (tokenPrice[idx] || 0)
    })
    return total
  }, [amounts, poolData.reserves, tokenPrice])

  const checkAmountIns = useCallback(async () => {
    const { mints } = poolData
    for (let i in amounts) {
      const { balance } = await getMintBalance(mints[i].toBase58(), true)
      if (Number(amounts[i]) > balance || Number(amounts[i]) <= 0)
        return setDisabledSupply(true)
    }
    return setDisabledSupply(false)
  }, [amounts, getMintBalance, poolData])

  useEffect(() => {
    checkAmountIns()
  }, [checkAmountIns])

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Row gutter={[12, 12]}>
          {poolData.mints.map((mint, idx) => {
            const mintValue = Number(amounts[idx]) * (tokenPrice[idx] || 0)
            return (
              <Col span={24} key={mint.toBase58()}>
                <Row key={idx}>
                  <Col flex={1}>
                    <Space>
                      <Typography.Text type="secondary">
                        <MintSymbol mintAddress={mint.toBase58()} />
                      </Typography.Text>
                      <Typography.Text type="secondary">
                        (<MintPrice mintAddress={mint} />)
                      </Typography.Text>
                    </Space>
                  </Col>
                  <Col>
                    <Typography.Text>
                      {util.numeric(mintValue).format('$0,0.[0000]')}
                    </Typography.Text>
                  </Col>
                </Row>
              </Col>
            )
          })}
        </Row>
      </Col>
      <Col span={24}>
        <Row align="middle">
          <Col flex={1}>
            <Typography.Text type="secondary">Total value</Typography.Text>
          </Col>
          <Col>
            <Typography.Title level={3}>
              ${util.numeric(totalValue).format('0,0.[0000]')}
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
          disabled={disabledSupply || loadingClose}
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
