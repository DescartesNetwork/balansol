import React, { Dispatch, Fragment, useState } from 'react'
import { useMint } from '@senhub/providers'

import { Col, Row, Space, Switch, Tooltip, Typography } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import { TokenInfo } from '../index'
import LiquidityInfo from './liquidityInfo'
import MintInput from 'app/components/mintInput'

import { fetchCGK } from 'shared/util'
import { PoolCreatingStep } from 'app/constant'
import { calcOptimizedDepositedAmount } from 'app/helper/oracles'
import { useMintBalance } from 'app/hooks/useMintBalance'

const AddLiquidity = ({
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
  const { getMintBalance } = useMintBalance()

  const checkExceedBalance = async (amountIns: string[]) => {
    const sum = amountIns.reduce((a, b) => a + Number(b), 0)
    if (sum <= 0) return true

    for (let i in tokenList) {
      const { balance } = await getMintBalance(tokenList[i].addressToken)
      if (Number(amountIns[i]) > balance) return true
    }
    return false
  }

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
        return (
          (CGKEnteredTokenInfo?.price *
            Number(newState[baseTokenIndex]) *
            Number(weight)) /
          (CGKTokenInfo?.price * Number(tokenList[calcedIdx].weight))
        ).toFixed(9)
      }),
    )
    const checkAmountIns = await checkExceedBalance(autoDepositedAmount)
    setDisable(checkAmountIns)

    return setDepositedAmounts(autoDepositedAmount)
  }

  const onUpdateAmount = async (
    value: string,
    idx: number,
    invalid?: boolean,
  ) => {
    setBaseTokenIndex(idx)

    const valueInNumber = Number(value)

    if (!invalid && valueInNumber !== 0) setDisable(false)
    if (invalid || valueInNumber === 0 || depositedAmounts.includes('0'))
      setDisable(true)

    const newState = [...depositedAmounts]
    const token = await tokenProvider.findByAddress(tokenList[idx].addressToken)
    const ticket = token?.extensions?.coingeckoId

    if (!isOptimizeLiquidity) {
      newState[idx] = value
      const checkAmountIns = await checkExceedBalance(newState)
      setDisable(checkAmountIns)
      return setDepositedAmounts(newState)
    }

    if (!ticket) {
      const state = new Array<string>(newState.length)
      state[idx] = value
      return setDepositedAmounts(state)
    }

    const CGKEnteredTokenInfo = await fetchCGK(ticket)

    const autoDepositedAmount = await Promise.all(
      tokenList.map(async ({ addressToken, weight }, index) => {
        const token = await tokenProvider.findByAddress(addressToken)
        const ticket = token?.extensions?.coingeckoId
        if (!ticket) return '0'
        const CGKTokenInfo = await fetchCGK(ticket)
        if (idx === index) return value
        if (
          !!restoredDepositedAmounts[idx] &&
          restoredDepositedAmounts[idx] !== '0'
        )
          return restoredDepositedAmounts[idx]
        return calcOptimizedDepositedAmount(
          CGKEnteredTokenInfo,
          CGKTokenInfo,
          value,
          weight,
          tokenList[index].weight,
        ).toFixed(9)
      }),
    )
    const checkAmountIns = await checkExceedBalance(autoDepositedAmount)
    setDisable(checkAmountIns)

    return setDepositedAmounts(autoDepositedAmount)
  }

  return (
    <Fragment>
      <Col span={24}>
        <Row justify="center" gutter={[8, 8]}>
          {tokenList.map((value, idx) => (
            <Col span={24} key={`${value.addressToken}${idx}`}>
              <MintInput
                amount={depositedAmounts[idx]}
                selectedMint={value.addressToken}
                onChangeAmount={(value: string, invalid?: boolean) =>
                  onUpdateAmount(value, idx, invalid)
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

export default AddLiquidity
