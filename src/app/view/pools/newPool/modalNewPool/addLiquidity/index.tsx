import { Fragment, useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { Button, Col, Row } from 'antd'
import LiquidityInfo from './liquidityInfo'
import MintInput from 'app/components/mintInput'

import { PoolCreatingStep } from 'app/constant'
import { AppState } from 'app/model'
import { useOracles } from 'app/hooks/useOracles'
import { useMint } from '@senhub/providers'
import { fetchCGK } from 'shared/util'
import { calcNormalizedWeight } from 'app/helper/oracles'

const AddLiquidity = ({
  setCurrentStep,
  poolAddress,
  onClose = () => {},
}: {
  setCurrentStep: (step: PoolCreatingStep) => void
  onClose?: () => void
  poolAddress: string
}) => {
  const [inputAmounts, setInputAmounts] = useState<string[]>([])
  const [baseTokenIndex, setBaseTokenIndex] = useState(0)
  const {
    pools: { [poolAddress]: poolData },
  } = useSelector((state: AppState) => state)
  const { undecimalizeMintAmount } = useOracles()
  const { tokenProvider } = useMint()

  const initInputAmountFromPoolData = useCallback(async () => {
    if (!poolData || inputAmounts.length !== 0) return
    const initInputAmounts = await Promise.all(
      poolData.mints.map((mint, idx) => {
        if (Number(inputAmounts[idx])) return inputAmounts[idx]
        return undecimalizeMintAmount(poolData.reserves[idx], mint)
      }),
    )
    setInputAmounts(initInputAmounts)
  }, [inputAmounts, poolData, undecimalizeMintAmount])

  useEffect(() => {
    initInputAmountFromPoolData()
  }, [initInputAmountFromPoolData])

  const onApplySuggestion = async (index: number) => {
    const { mints, weights } = poolData
    const baseToken = await tokenProvider.findByAddress(
      mints[baseTokenIndex].toBase58(),
    )
    const appliedToken = await tokenProvider.findByAddress(
      mints[index].toBase58(),
    )
    const baseTicket = baseToken?.extensions?.coingeckoId
    const appliedTicket = appliedToken?.extensions?.coingeckoId

    if (!baseTicket && !appliedTicket) return null

    const baseTokenCGKData = await fetchCGK(baseTicket)
    const appliedTokenCGKData = await fetchCGK(appliedTicket)

    let newAmounts = [...inputAmounts]
    const baseNormalizedWeight = calcNormalizedWeight(
      weights,
      weights[baseTokenIndex],
    )
    const appliedNormalizedWeight = calcNormalizedWeight(
      weights,
      weights[index],
    )
    if (!baseTokenCGKData?.price || appliedTokenCGKData?.price) return null

    const suggestedAmount = (
      (baseTokenCGKData.price *
        Number(newAmounts[baseTokenIndex]) *
        baseNormalizedWeight) /
      (appliedTokenCGKData.price * appliedNormalizedWeight)
    ).toFixed(9)
    newAmounts[index] = String(suggestedAmount)

    setInputAmounts(newAmounts)
  }

  const onUpdateAmount = async (value: string, idx: number) => {
    const newAmounts = [...inputAmounts]
    newAmounts[idx] = value
    setBaseTokenIndex(idx)
    return setInputAmounts(newAmounts)
  }

  return (
    <Fragment>
      <Col span={24}>
        <Row justify="center" gutter={[8, 8]}>
          {poolData.mints.map((mint, idx) => {
            return (
              <Col span={24} key={`${mint.toBase58() + idx}`}>
                <MintInput
                  amount={inputAmounts[idx]}
                  selectedMint={mint.toBase58()}
                  onChangeAmount={
                    !poolData.reserves[idx].toNumber()
                      ? (value: string) => onUpdateAmount(value, idx)
                      : undefined
                  }
                  force
                  ratioButton={
                    baseTokenIndex !== idx && (
                      <Button
                        type="text"
                        style={{ color: '#63e0b3' }}
                        onClick={() => onApplySuggestion(idx)}
                      >
                        Apply suggestion
                      </Button>
                    )
                  }
                />
              </Col>
            )
          })}
        </Row>
      </Col>
      <Col span={24}>
        <LiquidityInfo
          onClose={onClose}
          amounts={inputAmounts}
          poolAddress={poolAddress}
          setCurrentStep={setCurrentStep}
        />
      </Col>
    </Fragment>
  )
}

export default AddLiquidity
