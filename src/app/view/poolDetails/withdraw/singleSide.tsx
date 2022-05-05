import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { BN, utils, web3 } from '@project-serum/anchor'

import { Button, Col, Row, Typography } from 'antd'
import TokenWillReceive from '../tokenWillReceive'

import { useAccount, useMint, useWallet } from '@senhub/providers'
import { calcWithdrawPriceImpact } from 'app/helper/oracles'
import { notifyError, notifySuccess, priceImpactColor } from 'app/helper'
import { AppState } from 'app/model'
import { LPTDECIMALS } from 'app/constant/index'
import { useOracles } from 'app/hooks/useOracles'
import { useLptSupply } from 'app/hooks/useLptSupply'
import { useAccountBalanceByMintAddress } from 'shared/hooks/useAccountBalance'
import { numeric } from 'shared/util'

const WithdrawSingleSide = ({
  poolAddress,
  lptAmount,
  mintAddress,
  onSuccess = () => {},
}: {
  lptAmount: string
  poolAddress: string
  mintAddress: string
  onSuccess?: () => void
}) => {
  const [amountReserve, setAmountReserve] = useState<BN>(new BN(0))
  const [impactPrice, setImpactPrice] = useState(0)
  const { getDecimals } = useMint()

  const {
    pools: { [poolAddress]: poolData },
  } = useSelector((state: AppState) => state)
  const {
    wallet: { address: walletAddress },
  } = useWallet()
  const { accounts } = useAccount()
  const { decimalize } = useOracles()

  const { supply } = useLptSupply(poolData.mintLpt)
  const { balance } = useAccountBalanceByMintAddress(
    poolData.mintLpt.toBase58(),
  )

  const onSubmit = async () => {
    if (Number(lptAmount) > balance * 0.3) {
      return notifyError({
        message: 'Please input amount less than 30% available supply!',
      })
    }

    try {
      await initializeAccountIfNeeded()
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
    }
  }

  const initializeAccountIfNeeded = async () => {
    const tokenAccount = await utils.token.associatedAddress({
      owner: new web3.PublicKey(walletAddress),
      mint: new web3.PublicKey(mintAddress),
    })
    if (!accounts[tokenAccount.toBase58()]) {
      const { wallet, splt } = window.sentre
      if (!wallet) throw new Error('Login first')
      await splt.initializeAccount(
        new web3.PublicKey(mintAddress).toBase58(),
        walletAddress,
        wallet,
      )
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
    if (!!tokenAmountOut) setAmountReserve(tokenAmountOut)
    setImpactPrice(impactPrice)
  }, [decimalize, getDecimals, lptAmount, mintAddress, poolData, supply])

  useEffect(() => {
    estimateImpactPriceAndLP()
  }, [estimateImpactPriceAndLP])

  return (
    <Row gutter={[0, 12]} className="withdraw">
      <Col span={24}>
        <Row>
          <Col flex="auto">
            <Typography.Text type="secondary" style={{ fontSize: '14px' }}>
              Price impact
            </Typography.Text>
          </Col>
          <Col>
            <span style={{ color: priceImpactColor(impactPrice) }}>
              {numeric(impactPrice).format('0,0.[0000]')}%
            </span>
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <Row gutter={[0, 14]}>
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
        <Button
          className="balansol-btn"
          type="primary"
          block
          onClick={onSubmit}
          disabled={amountReserve.isZero() || Number(lptAmount) > balance * 0.3}
        >
          Withdraw
        </Button>
      </Col>
    </Row>
  )
}

export default WithdrawSingleSide
