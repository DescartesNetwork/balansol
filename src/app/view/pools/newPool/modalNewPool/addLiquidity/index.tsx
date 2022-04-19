import { Fragment, useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { Col, Row } from 'antd'
import LiquidityInfo from './liquidityInfo'
import MintInput from 'app/components/mintInput'

import { PoolCreatingStep } from 'app/constant'
import { AppState } from 'app/model'
import { useOracles } from 'app/hooks/useOracles'

const AddLiquidity = ({
  setCurrentStep,
  poolAddress,
}: {
  setCurrentStep: (step: PoolCreatingStep) => void
  poolAddress: string
}) => {
  const [inputAmounts, setInputAmounts] = useState<string[]>([])
  const {
    pools: { [poolAddress]: poolData },
  } = useSelector((state: AppState) => state)
  const { undecimalizeMintAmount } = useOracles()

  const initInputAmountFromPoolData = useCallback(async () => {
    if (!poolData) return []
    const initInputAmounts = await Promise.all(
      poolData.mints.map((mint, idx) =>
        undecimalizeMintAmount(poolData.reserves[idx], mint),
      ),
    )
    setInputAmounts(initInputAmounts)
  }, [poolData, undecimalizeMintAmount])

  useEffect(() => {
    initInputAmountFromPoolData()
  }, [initInputAmountFromPoolData])

  const onUpdateAmount = async (value: string, idx: number) => {
    const newAmounts = [...inputAmounts]
    newAmounts[idx] = value
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
                />
              </Col>
            )
          })}
        </Row>
      </Col>
      <Col span={24}>
        <LiquidityInfo
          amounts={inputAmounts}
          poolAddress={poolAddress}
          setCurrentStep={setCurrentStep}
        />
      </Col>
    </Fragment>
  )
}

export default AddLiquidity
