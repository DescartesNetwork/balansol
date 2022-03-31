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

  useEffect(() => {
    calcMintReceiveSingleSide()
  }, [calcMintReceiveSingleSide])

  return (
    <Row gutter={[0, 24]} className="withdraw">
      <Col span={24}>
        <Row gutter={[0, 14]}>
          <Col span={24}>
            <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
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
