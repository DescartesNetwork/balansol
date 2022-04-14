import React, { Dispatch, useCallback, useEffect, useState } from 'react'
import { BN, web3 } from '@project-serum/anchor'
import { useMint } from '@senhub/providers'
import { utils } from '@senswap/sen-js'

import { Button, Col, Row, Typography } from 'antd'
import { MintSymbol } from 'shared/antd/mint'

import { notifyError, notifySuccess } from 'app/helper'
import { fetchCGK, numeric } from 'shared/util'
import { TokenInfo } from '../index'
import { PoolCreatingStep } from 'app/constant'

type TokenPrice = {
  price: number
  valuation: number
}

const LiquidityInfo = ({
  disableBtnSupply,
  tokenList,
  depositedAmounts,
  poolAddress,
  setCurrentStep,
  restoredDepositedAmounts,
}: {
  disableBtnSupply: boolean
  tokenList: TokenInfo[]
  depositedAmounts: string[]
  poolAddress: string
  setCurrentStep: Dispatch<React.SetStateAction<number>>
  restoredDepositedAmounts: string[]
}) => {
  const [tokenPrice, setTokenPrice] = useState<TokenPrice[]>([])

  const { tokenProvider, getDecimals } = useMint()

  const getTokensPrice = useCallback(async () => {
    const tokensPrice = await Promise.all(
      tokenList.map(async ({ addressToken }, idx) => {
        const token = await tokenProvider.findByAddress(addressToken)
        const ticket = token?.extensions?.coingeckoId

        if (!ticket) return { price: 0, valuation: 0 }

        const CGKTokenInfo = await fetchCGK(ticket)

        return {
          price: CGKTokenInfo?.price,
          valuation:
            Number(CGKTokenInfo?.price * Number(depositedAmounts[idx])) || 0,
        }
      }),
    )
    setTokenPrice(tokensPrice)
  }, [depositedAmounts, tokenList, tokenProvider])

  useEffect(() => {
    getTokensPrice()
  }, [getTokensPrice, tokenList])

  const onAddLiquidity = async () => {
    try {
      for (let i = 0; i < tokenList.length; i++) {
        if (
          isNaN(Number(restoredDepositedAmounts[i])) !== true &&
          Number(restoredDepositedAmounts[i]) !== 0
        )
          continue

        let decimals = await getDecimals(tokenList[i].addressToken)
        let mintAmmount = utils.decimalize(depositedAmounts[i], decimals)

        await window.balansol.initializeJoin(
          poolAddress,
          new web3.PublicKey(tokenList[i].addressToken),
          new BN(String(mintAmmount)),
        )
      }

      setCurrentStep(PoolCreatingStep.confirmCreatePool)
      notifySuccess('Fund pool', '')
    } catch (error) {
      notifyError(error)
    }
  }

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        {tokenList.map((value, idx) => (
          <Row key={idx}>
            <Col flex={1}>
              <Typography.Text type="secondary">
                <MintSymbol mintAddress={value.addressToken} />
              </Typography.Text>
              <Typography.Text>
                ({numeric(tokenPrice[idx]?.price).format('0,0.[0000]')})
              </Typography.Text>
            </Col>
            <Col>
              <Typography.Text>
                ${numeric(tokenPrice[idx]?.valuation).format('0,0.[0000]')}
              </Typography.Text>
            </Col>
          </Row>
        ))}
      </Col>
      <Col span={24}>
        <Row align="middle">
          <Col flex={1}>
            <Typography.Text type="secondary">Total value</Typography.Text>
          </Col>
          <Col>
            <Typography.Title level={3}>
              $
              {numeric(
                tokenPrice.reduce(
                  (previousSum, currentValue) =>
                    previousSum + currentValue?.valuation,
                  0,
                ),
              ).format('0,0.[0000]')}
            </Typography.Title>
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <Button
          type="primary"
          onClick={onAddLiquidity}
          disabled={disableBtnSupply}
          block
        >
          Supply
        </Button>
      </Col>
    </Row>
  )
}

export default LiquidityInfo
