import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useWallet } from '@senhub/providers'

import { Col, Row, Steps } from 'antd'
import ListTokenSetup from './listTokenSetup'
import AddLiquidity from './addLiquidity'
import ConfirmPoolInfo from './confirmPoolInfo'

import { AppState } from 'app/model'
import { PoolCreatingStep } from 'app/constant'
import { PoolState } from '@senswap/balancer'

const { Step } = Steps

export type MintSetup = {
  addressToken: string
  weight: string
  isLocked: boolean
}

const ModalNewPool = ({ onClose }: { onClose: () => void }) => {
  const { pools } = useSelector((state: AppState) => state)
  const [currentStep, setCurrentStep] = useState(PoolCreatingStep.setGradient)
  const [poolAddress, setPoolAddress] = useState('')

  const { wallet } = useWallet()

  const recoverCreatePoolProcess = useCallback(async () => {
    for (const poolAddress in pools) {
      const poolData = pools[poolAddress]
      if (poolData.authority.toBase58() !== wallet.address) continue
      if (!(poolData.state as PoolState)['uninitialized']) continue
      return setPoolAddress(poolAddress)
    }
    return setPoolAddress('2QFTcywVTVFaGUUbLY1cbDdF1KkPWXSeu6qzzR6uUscV')
  }, [pools, wallet.address])

  useEffect(() => {
    recoverCreatePoolProcess()
  }, [recoverCreatePoolProcess])

  const creatingPoolProcess = useMemo(() => {
    switch (currentStep) {
      case PoolCreatingStep.setGradient:
        return <ListTokenSetup setCurrentStep={setCurrentStep} />
      case PoolCreatingStep.addLiquidity:
        return (
          <AddLiquidity
            setCurrentStep={setCurrentStep}
            poolAddress={poolAddress}
          />
        )
      case PoolCreatingStep.confirmCreatePool:
        return <ConfirmPoolInfo onReset={onClose} poolAddress={poolAddress} />
    }
  }, [currentStep, onClose, poolAddress])

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Steps size="small" current={currentStep}>
          <Step title="Select tokens & weights" />
          <Step title="Set liquidity" />
          <Step title="Confirm" />
        </Steps>
      </Col>
      {creatingPoolProcess}
    </Row>
  )
}

export default ModalNewPool
