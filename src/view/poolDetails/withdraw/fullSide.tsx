import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { BN } from '@coral-xyz/anchor'
import { initTxCreateMultiTokenAccount } from '@sen-use/web3'
import { useGetMintData, getAnchorProvider } from '@sentre/senhub'

import { Button, Col, Row, Typography } from 'antd'
import TokenWillReceive from '../tokenWillReceive'

import { notifyError, notifySuccess } from 'helper'
import { calcMintReceivesRemoveFullSide } from 'helper/oracles'
import { AppState } from 'model'
import { LPTDECIMALS } from 'constant/index'
import { useOracles } from 'hooks/useOracles'
import { useWrapAndUnwrapSolIfNeed } from 'hooks/useWrapAndUnwrapSolIfNeed'

const WithdrawFullSide = ({
  poolAddress,
  lptAmount,
  onSuccess = () => {},
}: {
  lptAmount: string
  poolAddress: string
  onSuccess?: () => void
}) => {
  const [amounts, setAmounts] = useState<BN[]>([])
  const [loading, setLoading] = useState(false)
  const poolData = useSelector((state: AppState) => state.pools[poolAddress])
  const getMint = useGetMintData()
  const { decimalize } = useOracles()
  const { createUnWrapSolTxIfNeed } = useWrapAndUnwrapSolIfNeed()

  const onSubmit = async () => {
    try {
      setLoading(true)
      let amount = decimalize(lptAmount, LPTDECIMALS)
      const provider = getAnchorProvider()!

      const transactions = await initTokenAccountTxs()
      const { transaction } =
        await window.balansol.createRemoveLiquidityTransaction(
          poolAddress,
          amount,
        )
      transactions.push(transaction)

      for (const mint of poolData.mints) {
        const unwrapSolTx = await createUnWrapSolTxIfNeed(mint.toBase58())
        if (unwrapSolTx) transactions.push(unwrapSolTx)
      }
      const txIds = await provider.sendAll(
        transactions.map((tx) => {
          return { tx, signers: [] }
        }),
      )
      notifySuccess('Withdraw', txIds[txIds.length - 1])
      onSuccess()
    } catch (error) {
      notifyError(error)
    } finally {
      setLoading(false)
    }
  }

  async function initTokenAccountTxs() {
    const provider = getAnchorProvider()!
    const transactions = await initTxCreateMultiTokenAccount(provider, {
      mints: poolData.mints,
    })
    return transactions
  }

  const calcMintReceiveFullSide = useCallback(async () => {
    let minPltAddress = poolData.mintLpt.toBase58()
    let mintPool = await getMint({ mintAddress: minPltAddress })
    if (!mintPool) {
      const emptyAmounts = new Array(poolData.reserves.length).fill(new BN(0))
      return setAmounts(emptyAmounts)
    }
    let lptSupply = mintPool[minPltAddress]?.supply
    let amount = await decimalize(lptAmount, LPTDECIMALS)

    let amounts = calcMintReceivesRemoveFullSide(
      new BN(String(amount)),
      new BN(String(lptSupply)),
      poolData.reserves,
    )
    return setAmounts(amounts)
  }, [decimalize, getMint, lptAmount, poolData.mintLpt, poolData.reserves])

  useEffect(() => {
    calcMintReceiveFullSide()
  }, [calcMintReceiveFullSide])

  return (
    <Row gutter={[0, 24]} className="withdraw">
      <Col span={24}>
        <Row gutter={[0, 14]}>
          <Col span={24}>
            <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
              You will receive
            </Typography.Text>
          </Col>
          {poolData.mints.map((mint, index) => (
            <Col span={24} key={mint.toBase58()}>
              <TokenWillReceive
                key={index}
                mintAddress={mint.toBase58()}
                amount={amounts[index]}
              />
            </Col>
          ))}
        </Row>
      </Col>
      <Col span={24}>
        <Button
          type="primary"
          block
          onClick={onSubmit}
          size="large"
          loading={loading}
          disabled={!Number(lptAmount)}
        >
          Withdraw
        </Button>
      </Col>
    </Row>
  )
}

export default WithdrawFullSide
