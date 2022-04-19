import React, {
  Dispatch,
  Fragment,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { useMint } from '@senhub/providers'

import { Col, Row, Space, Switch, Tooltip, Typography } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import { TokenInfo } from '../../index'
import LiquidityInfo from './liquidityInfo'
import MintInput from 'app/components/mintInput'

import { fetchCGK } from 'shared/util'
import { PoolCreatingStep } from 'app/constant'
import { calcOptimizedDepositedAmount } from 'app/helper/oracles'
import { useMintBalance } from 'app/hooks/useMintBalance'
import { useSelector } from 'react-redux'
import { AppState } from 'app/model'
import { useOracles } from 'app/hooks/useOracles'

const AddLiquidity = ({
  setCurrentStep,
  poolAddress,
}: {
  setCurrentStep: Dispatch<React.SetStateAction<PoolCreatingStep>>
  poolAddress: string
}) => {
  const [inputAmounts, setInputAmounts] = useState<string[]>([])
  const [isOptimizeLiquidity, setIsOptimizeLiquidity] = useState(false)
  const [disable, setDisable] = useState(true)
  const [baseTokenIndex, setBaseTokenIndex] = useState(0)

  const {
    pools: { [poolAddress]: poolData },
  } = useSelector((state: AppState) => state)

  const { tokenProvider } = useMint()
  const { undecimalizeMintAmount } = useOracles()
  const { getMintBalance } = useMintBalance()

  const fetchPoolAmounts = useCallback(async () => {
    const initInputAmounts = await Promise.all(
      poolData.mints.map((mint, idx) =>
        undecimalizeMintAmount(poolData.reserves[idx], mint),
      ),
    )
    setInputAmounts(initInputAmounts)
  }, [poolData.mints, poolData.reserves, undecimalizeMintAmount])
  useEffect(() => {
    fetchPoolAmounts()
  }, [fetchPoolAmounts])

  const checkExceedBalance = async (amountIns: string[]) => {
    const sum = amountIns.reduce((a, b) => a + Number(b), 0)
    if (sum <= 0) return true
    for (const idx in poolData.mints) {
      const { balance } = await getMintBalance(poolData.mints[idx].toBase58())
      if (Number(amountIns[idx]) > balance) return true
    }
    return false
  }

  const onSwitchOptimize = async (checked: boolean) => {
    setIsOptimizeLiquidity(checked)
    // if (!checked) return
    // const newState = [...depositedAmounts]
    // const token = await tokenProvider.findByAddress(
    //   tokenList[baseTokenIndex].addressToken,
    // )
    // const ticket = token?.extensions?.coingeckoId
    // if (!ticket) {
    //   const state = new Array<string>(newState.length)
    //   state[baseTokenIndex] = newState[baseTokenIndex]
    //   return setDepositedAmounts(state)
    // }
    // const CGKEnteredTokenInfo = await fetchCGK(ticket)
    // const autoDepositedAmount = await Promise.all(
    //   tokenList.map(async ({ addressToken, weight }, calcedIdx) => {
    //     const token = await tokenProvider.findByAddress(addressToken)
    //     const ticket = token?.extensions?.coingeckoId
    //     if (!ticket) return '0'
    //     const CGKTokenInfo = await fetchCGK(ticket)
    //     if (calcedIdx === baseTokenIndex) return newState[baseTokenIndex]
    //     return (
    //       (CGKEnteredTokenInfo?.price *
    //         Number(newState[baseTokenIndex]) *
    //         Number(weight)) /
    //       (CGKTokenInfo?.price * Number(tokenList[calcedIdx].weight))
    //     ).toFixed(9)
    //   }),
    // )
    // const checkAmountIns = await checkExceedBalance(autoDepositedAmount)
    // setDisable(checkAmountIns)
    // return setDepositedAmounts(autoDepositedAmount)
  }

  const onUpdateAmount = async (
    value: string,
    idx: number,
    invalid?: boolean,
  ) => {
    // setBaseTokenIndex(idx)
    // const valueInNumber = Number(value)
    // if (!invalid && valueInNumber !== 0) setDisable(false)
    // if (invalid || valueInNumber === 0 || depositedAmounts.includes('0'))
    //   setDisable(true)
    // const newState = [...depositedAmounts]
    // const token = await tokenProvider.findByAddress(tokenList[idx].addressToken)
    // const ticket = token?.extensions?.coingeckoId
    // if (!isOptimizeLiquidity) {
    //   newState[idx] = value
    //   const checkAmountIns = await checkExceedBalance(newState)
    //   setDisable(checkAmountIns)
    //   return setDepositedAmounts(newState)
    // }
    // if (!ticket) {
    //   const state = new Array<string>(newState.length)
    //   state[idx] = value
    //   return setDepositedAmounts(state)
    // }
    // const CGKEnteredTokenInfo = await fetchCGK(ticket)
    // const autoDepositedAmount = await Promise.all(
    //   tokenList.map(async ({ addressToken, weight }, index) => {
    //     const token = await tokenProvider.findByAddress(addressToken)
    //     const ticket = token?.extensions?.coingeckoId
    //     if (!ticket) return '0'
    //     const CGKTokenInfo = await fetchCGK(ticket)
    //     if (idx === index) return value
    //     if (
    //       !!restoredDepositedAmounts[idx] &&
    //       restoredDepositedAmounts[idx] !== '0'
    //     )
    //       return restoredDepositedAmounts[idx]
    //     return calcOptimizedDepositedAmount(
    //       CGKEnteredTokenInfo,
    //       CGKTokenInfo,
    //       value,
    //       weight,
    //       tokenList[index].weight,
    //     ).toFixed(9)
    //   }),
    // )
    // const checkAmountIns = await checkExceedBalance(autoDepositedAmount)
    // setDisable(checkAmountIns)
    // return setDepositedAmounts(autoDepositedAmount)
  }

  return (
    <Fragment>
      <Col span={24}>
        <Row justify="center" gutter={[8, 8]}>
          {poolData.mints.map((mint, idx) => (
            <Col span={24} key={`${mint.toBase58()}`}>
              <MintInput
                amount={inputAmounts[idx]}
                selectedMint={mint.toBase58()}
                onChangeAmount={(value: string, invalid?: boolean) =>
                  onUpdateAmount(value, idx, invalid)
                }
                force
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
      <Col span={24}></Col>
    </Fragment>
  )
}

export default AddLiquidity
