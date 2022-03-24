import React, { Dispatch, Fragment, useState } from 'react'
import { useMint } from '@senhub/providers'

import { Col, Row, Space, Switch, Tooltip, Typography } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import { TokenInfo } from '../index'
import LiquidityInfo from '../liquidityInfo'
import MintInput from 'app/components/mintInput'

import { fetchCGK } from 'shared/util'
import { PoolCreatingStep } from 'app/constant'
import { calcOptimizedDepositedAmount } from 'app/helper/oracles'

const AddLiquidty = ({
  tokenList,
  setCurrentStep,
  poolAddress,
  depositedAmounts,
  setDepositedAmounts,
  restoredDepositedAmounts,
}: {
  tokenList: TokenInfo[]
  setCurrentStep: Dispatch<React.SetStateAction<PoolCreatingStep>>
  poolAddress: string
  depositedAmounts: string[]
  setDepositedAmounts: Dispatch<React.SetStateAction<string[]>>
  restoredDepositedAmounts: string[]
}) => {
  const [isOptimizeLiquidity, setIsOptimizeLiquidity] = useState(false)
  const { tokenProvider } = useMint()
  const [disable, setDisable] = useState(true)
  const [baseTokenIndex, setBaseTokenIndex] = useState(0)

  const onSwitchOptimize = async (checked: boolean) => {
    setIsOptimizeLiquidity(checked)

    if (!checked) return

    const newState = [...depositedAmounts]
    const token = await tokenProvider.findByAddress(
      tokenList[baseTokenIndex].addressToken,
    )
    const ticket = token?.extensions?.coingeckoId

    if (!ticket) {
      const state = new Array<string>(newState.length)
      state[baseTokenIndex] = newState[baseTokenIndex]
      return setDepositedAmounts(state)
    }

    const CGKEnteredTokenInfo = await fetchCGK(ticket)

    const autoDepositedAmount = await Promise.all(
      tokenList.map(async ({ addressToken, weight }, calcedIdx) => {
        const token = await tokenProvider.findByAddress(addressToken)
        const ticket = token?.extensions?.coingeckoId
        if (!ticket) return '0'
        const CGKTokenInfo = await fetchCGK(ticket)
        if (calcedIdx === baseTokenIndex) return newState[baseTokenIndex]
        return String(
          (CGKEnteredTokenInfo?.price *
            Number(newState[baseTokenIndex]) *
            Number(weight)) /
            (CGKTokenInfo?.price * Number(tokenList[calcedIdx].weight)),
        )
      }),
    )

    return setDepositedAmounts(autoDepositedAmount)
  }
  const onChangeAmount = async (
    value: string,
    idx: number,
    balance: number,
  ) => {
    setBaseTokenIndex(idx)

    const valueInNumber = Number(value)

    if (valueInNumber < balance && valueInNumber !== 0) setDisable(false)
    if (
      valueInNumber > balance ||
      valueInNumber === 0 ||
      depositedAmounts.includes('0')
    )
      setDisable(true)

    const newState = [...depositedAmounts]
    const token = await tokenProvider.findByAddress(tokenList[idx].addressToken)
    const ticket = token?.extensions?.coingeckoId

    if (!isOptimizeLiquidity) {
      newState[idx] = value
      return setDepositedAmounts(newState)
    }

    if (!ticket) {
      const state = new Array<string>(newState.length)
      state[idx] = value
      return setDepositedAmounts(state)
    }

    const CGKEnteredTokenInfo = await fetchCGK(ticket)

    const autoDepositedAmount = await Promise.all(
      tokenList.map(async ({ addressToken, weight }, calcedIdx) => {
        const token = await tokenProvider.findByAddress(addressToken)
        const ticket = token?.extensions?.coingeckoId
        if (!ticket) return '0'
        const CGKTokenInfo = await fetchCGK(ticket)
        if (idx === calcedIdx) return value
        if (
          !!restoredDepositedAmounts[idx] &&
          restoredDepositedAmounts[idx] !== '0'
        )
          return restoredDepositedAmounts[idx]
        return String(
          calcOptimizedDepositedAmount(
            CGKEnteredTokenInfo,
            CGKTokenInfo,
            value,
            weight,
            tokenList[calcedIdx].weight,
          ),
        )
      }),
    )

    return setDepositedAmounts(autoDepositedAmount)
  }

  return (
    <Fragment>
      <Col span={24}>
        <Row justify="center" gutter={[8, 8]}>
          {tokenList.map((value, idx) => (
            <Col span={24}>
              <MintInput
                amount={depositedAmounts[idx]}
                selectedMint={value.addressToken}
                onChangeAmount={(value: string, balance: number) =>
                  onChangeAmount(value, idx, balance)
                }
              />
            </Col>
          ))}
          <Col span={24}>
            <Row justify="end" gutter={[8, 0]}>
              <Col>
                <Space>
                  <Tooltip title="prompt text">
                    <InfoCircleOutlined style={{ color: '#9CA1AF' }} />
                  </Tooltip>
                  <Typography.Text>Auto optimize liquidity</Typography.Text>
                </Space>
              </Col>
              <Col>
                <Switch size="small" onChange={onSwitchOptimize} />
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <LiquidityInfo
          disableBtnSupply={disable}
          tokenList={tokenList}
          depositedAmounts={depositedAmounts}
          poolAddress={poolAddress}
          setCurrentStep={setCurrentStep}
          restoredDepositedAmounts={restoredDepositedAmounts}
        />
      </Col>
    </Fragment>
  )
}

export default AddLiquidty