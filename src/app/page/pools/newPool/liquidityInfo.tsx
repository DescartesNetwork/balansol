import React, { Dispatch, useCallback, useEffect, useState } from 'react'
import { BN, web3 } from '@project-serum/anchor'
import { useMint } from '@senhub/providers'

import { Button, Col, Row, Typography } from 'antd'
import { MintSymbol } from 'shared/antd/mint'

import { notifyError, notifySuccess } from 'app/helper'
import { fetchCGK, numeric } from 'shared/util'
import { TokenInfo } from './index'
import { utils } from '@senswap/sen-js'

type TokenPrice = {
  price: number
  valuation: number
}

const LiquidityInfo = ({
  tokenList,
  depositAmounts,
  poolAddress,
  setCurrentStep,
}: {
  tokenList: TokenInfo[]
  depositAmounts: string[]
  poolAddress: string
  setCurrentStep: Dispatch<React.SetStateAction<number>>
}) => {
  const [tokenPrice, setTokenPrice] = useState<TokenPrice[]>([])

  const { tokenProvider, getDecimals } = useMint()

  const getTokensPrice = useCallback(async () => {
    const tokensPrice = await Promise.all(
      tokenList.map(async ({ addressToken }, idx) => {
        const token = await tokenProvider.findByAddress(addressToken)
        const ticket = token?.extensions?.coingeckoId
        const CGKTokenInfo = await fetchCGK(ticket)
        if (!CGKTokenInfo) return { price: 0, valuation: 0 }
        return {
          price: CGKTokenInfo?.price,
          valuation: Number(
            numeric(
              CGKTokenInfo?.price * Number(depositAmounts[idx] || 0),
            ).format('0,0.[00]'),
          ),
        }
      }),
    )
    console.log(tokensPrice, 'toekekekek', depositAmounts)
    setTokenPrice(tokensPrice)
  }, [depositAmounts, tokenList, tokenProvider])

  useEffect(() => {
    getTokensPrice()
  }, [getTokensPrice, tokenList])

  const onAddLiquidity = async () => {
    try {
      for (let i = 0; i < tokenList.length; i++) {
        let decimals = await getDecimals(tokenList[i].addressToken)
        let mintAmmount = utils.decimalize(depositAmounts[i], decimals)

        await window.balansol.initializeJoin(
          poolAddress,
          new web3.PublicKey(tokenList[i].addressToken),
          new BN(String(mintAmmount)),
        )
      }
      setCurrentStep(2)
      notifySuccess('Fund pool', '')
    } catch (error) {
      notifyError(error)
    }
  }

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        {tokenList.map((value, idx) => (
          <Row>
            <Col flex={1}>
              <MintSymbol mintAddress={value.addressToken} />
              <Typography.Text>{tokenPrice[idx]?.price}</Typography.Text>
            </Col>
            <Col>
              <Typography.Text>{tokenPrice[idx]?.valuation} $</Typography.Text>
            </Col>
          </Row>
        ))}
      </Col>
      <Col span={24}>
        <Row>
          <Col flex={1}>
            <Typography.Text type="secondary">Total value</Typography.Text>
          </Col>
          <Col>
            <Typography.Title level={3}>
              {tokenPrice.reduce(
                (previousSum, currentValue) =>
                  previousSum + currentValue?.valuation,
                0,
              )}{' '}
              $
            </Typography.Title>
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <Button type="primary" onClick={onAddLiquidity} disabled={false} block>
          Supply
        </Button>
      </Col>
    </Row>
  )
}

export default LiquidityInfo
