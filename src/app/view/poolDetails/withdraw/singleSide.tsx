import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { BN, utils, web3 } from '@project-serum/anchor'
import { useAccount, useWallet } from '@senhub/providers'

import { Button, Col, Row, Typography } from 'antd'
import TokenWillReceive from '../tokenWillReceive'

import {
  calcMintReceiveRemoveSingleSide,
  getMintInfo,
} from 'app/helper/oracles'
import { notifyError, notifySuccess } from 'app/helper'
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
}: {
  lptAmount: string
  poolAddress: string
  mintAddress: string
}) => {
  const [amountReserve, setAmountReserve] = useState<BN>(new BN(0))
  const [impactPrice, setImpactPrice] = useState(0)

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

  const calcMintReceiveSingleSide = useCallback(async () => {
    let amount = decimalize(lptAmount, LPTDECIMALS)
    const mintPoolInfo = getMintInfo(poolData, mintAddress)
    let amountReserver = calcMintReceiveRemoveSingleSide(
      new BN(String(amount)),
      supply,
      Number(mintPoolInfo.normalizedWeight),
      mintPoolInfo.reserve,
      new BN(String(poolData.fee)),
    )
    return setAmountReserve(amountReserver)
  }, [decimalize, lptAmount, mintAddress, poolData, supply])

  const estimateImpactPriceAndLP = useCallback(async () => {
    setImpactPrice(0)
    if (Number(lptAmount) === 0) return setLpOutTotal(0)

    let amountIns: BN[] = []
    let decimalIns: number[] = []

    for (let i in amounts) {
      const decimalIn = await getDecimals(poolData.mints[i].toBase58())
      const amountBn = await decimalizeMintAmount(amounts[i], poolData.mints[i])
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
    const { lpOut, impactPrice } = calcPriceImpact(
      'join',
      amountIns,
      poolData.reserves,
      poolData.weights,
      totalSupplyBN,
      decimalIns,
      poolData.fee,
    )

    setLpOutTotal(lpOut)
    setImpactPrice(impactPrice)
  }, [amounts, decimalizeMintAmount, getDecimals, poolData])

  useEffect(() => {
    estimateImpactPriceAndLP()
  }, [estimateImpactPriceAndLP])

  useEffect(() => {
    calcMintReceiveSingleSide()
  }, [calcMintReceiveSingleSide])

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
            <span style={{ color: '#03A326' }}>
              {numeric(impactPrice).format('0,0.[0000]')} %
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
          <TokenWillReceive mintAddress={mintAddress} amount={amountReserve} />
        </Row>
      </Col>
      <Col span={24}>
        <Button
          className="balansol-btn"
          type="primary"
          block
          onClick={onSubmit}
          disabled={amountReserve.isZero() || Number(lptAmount) > balance}
        >
          Withdraw
        </Button>
      </Col>
    </Row>
  )
}

export default WithdrawSingleSide
