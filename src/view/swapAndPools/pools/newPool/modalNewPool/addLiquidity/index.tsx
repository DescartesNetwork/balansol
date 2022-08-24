import { Fragment, useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useGetMintDecimals, util } from '@sentre/senhub'
import { MintSymbol, useGetMintPrice } from '@sen-use/app'

import { Button, Col, Row, Typography } from 'antd'
import LiquidityInfo from './liquidityInfo'
import MintInput from 'components/mintInput'

import { PoolCreatingStep } from 'constant'
import { AppState } from 'model'
import { useOracles } from 'hooks/useOracles'
import { calcNormalizedWeight } from 'helper/oracles'

export type AddLiquidityProps = {
  setCurrentStep: (step: PoolCreatingStep) => void
  onClose?: () => void
  poolAddress: string
}

const AddLiquidity = ({
  setCurrentStep,
  poolAddress,
  onClose = () => {},
}: AddLiquidityProps) => {
  const [inputAmounts, setInputAmounts] = useState<string[]>([])
  const [suggestedAmounts, setSuggestAmounts] = useState<string[]>([])
  const [baseTokenIndex, setBaseTokenIndex] = useState(0)
  const poolData = useSelector((state: AppState) => state.pools[poolAddress])
  const { undecimalizeMintAmount } = useOracles()
  const getPrice = useGetMintPrice()
  const getDecimals = useGetMintDecimals()

  const isVisibleSuggestion = (idx: number) =>
    baseTokenIndex !== idx &&
    Number(inputAmounts[baseTokenIndex]) > 0 &&
    Number(suggestedAmounts[idx]) > 0 &&
    Number(suggestedAmounts[idx]) !== Number(inputAmounts[idx]) &&
    !Number(inputAmounts[idx])

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
    const newAmounts = [...inputAmounts]
    newAmounts[index] = suggestedAmounts[index]
    setInputAmounts(newAmounts)
  }

  const onUpdateAmount = async (amount: string, baseIdx: number) => {
    const newAmounts = [...inputAmounts]
    newAmounts[baseIdx] = amount
    setBaseTokenIndex(baseIdx)
    setInputAmounts(newAmounts)
    // handle suggestion for other tokens
    const { mints, weights } = poolData
    const price = await getPrice(mints[baseIdx])
    if (!price) return null

    const baseNormalizedWeight = calcNormalizedWeight(
      weights,
      weights[baseTokenIndex],
    )
    const newSuggestAmounts = await Promise.all(
      mints.map(async (mint, index) => {
        if (baseIdx === index) return ''
        const price = await getPrice(mint)
        if (!price) return ''
        const appliedNormalizedWeight = calcNormalizedWeight(
          weights,
          weights[index],
        )
        const decimals = await getDecimals({ mintAddress: mint.toBase58() })
        const suggestedAmount = (
          (price * Number(amount) * baseNormalizedWeight) /
          (price * appliedNormalizedWeight)
        ).toFixed(decimals)

        return suggestedAmount
      }),
    )
    setSuggestAmounts(newSuggestAmounts)
  }

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Row justify="center" gutter={[8, 8]}>
          {poolData.mints.map((mint, idx) => {
            const normalizedWeight = calcNormalizedWeight(
              poolData.weights,
              poolData.weights[idx],
            )
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
                  mintLabel={
                    <Fragment>
                      <Typography.Text>
                        <MintSymbol mintAddress={mint.toBase58() || ''} />
                      </Typography.Text>
                      <Typography.Text type="secondary">
                        {util.numeric(normalizedWeight).format('0,0.[0000]%')}
                      </Typography.Text>
                    </Fragment>
                  }
                  placeholder={suggestedAmounts[idx]}
                  force
                  ratioButton={
                    isVisibleSuggestion(idx) && (
                      <Button
                        type="text"
                        onClick={() => onApplySuggestion(idx)}
                        style={{ marginRight: -15 }}
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
    </Row>
  )
}

export default AddLiquidity
