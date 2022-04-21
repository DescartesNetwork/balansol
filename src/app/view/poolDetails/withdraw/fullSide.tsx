import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { BN, utils, web3 } from '@project-serum/anchor'
import { useAccount, useMint, useWallet } from '@senhub/providers'

import { Button, Col, Row, Typography } from 'antd'
import TokenWillReceive from '../tokenWillReceive'

import { notifyError, notifySuccess } from 'app/helper'
import { calcMintReceivesRemoveFullSide } from 'app/helper/oracles'
import { AppState } from 'app/model'
import { LPTDECIMALS } from 'app/constant/index'
import { useOracles } from 'app/hooks/useOracles'

const WithdrawFullSide = ({
  poolAddress,
  lptAmount,
  onSuccess = () => {},
}: {
  lptAmount: string
  poolAddress: string
  onSuccess?: () => void
}) => {
  const {
    pools: { [poolAddress]: poolData },
  } = useSelector((state: AppState) => state)
  const {
    wallet: { address: walletAddress },
  } = useWallet()
  const { accounts } = useAccount()
  const { getMint } = useMint()
  const { decimalize } = useOracles()

  const [amounts, setAmounts] = useState<BN[]>([])

  const onSubmit = async () => {
    try {
      await initializeAccountIfNeeded()
      let amount = decimalize(lptAmount, LPTDECIMALS)
      const { txId } = await window.balansol.removeLiquidity(
        poolAddress,
        amount,
      )
      notifySuccess('Withdraw', txId)
      onSuccess()
    } catch (error) {
      notifyError(error)
    }
  }

  const initializeAccountIfNeeded = async () => {
    for (const mint of poolData.mints) {
      const tokenAccount = await utils.token.associatedAddress({
        owner: new web3.PublicKey(walletAddress),
        mint,
      })
      if (!accounts[tokenAccount.toBase58()]) {
        const { wallet, splt } = window.sentre
        if (!wallet) throw new Error('Login first')
        await splt.initializeAccount(mint.toBase58(), walletAddress, wallet)
      }
    }
  }

  const calcMintReceiveFullSide = useCallback(async () => {
    let minPltAddress = poolData.mintLpt.toBase58()
    let mintPool = await getMint({ address: minPltAddress })
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
            <Col span={24}>
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
          className="balansol-btn"
          type="primary"
          block
          onClick={onSubmit}
        >
          Withdraw
        </Button>
      </Col>
    </Row>
  )
}

export default WithdrawFullSide
