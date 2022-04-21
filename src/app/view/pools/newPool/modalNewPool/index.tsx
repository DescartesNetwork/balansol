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
  const [currentStep, setCurrentStep] = useState(PoolCreatingStep.setupToken)
  const [poolAddress, setPoolAddress] = useState('')

  const { wallet } = useWallet()

  const recoverCreatePoolProcess = useCallback(async () => {
    if (poolAddress) return
    for (const poolAddress in pools) {
      const poolData = pools[poolAddress]
      if (poolData.authority.toBase58() !== wallet.address) continue
      if (!(poolData.state as PoolState)['uninitialized']) continue
      setCurrentStep(PoolCreatingStep.addLiquidity)
      return setPoolAddress(poolAddress)
    }
    return setPoolAddress('')
  }, [poolAddress, pools, wallet.address])

  useEffect(() => {
    recoverCreatePoolProcess()
  }, [recoverCreatePoolProcess])

  const creatingPoolProcess = useMemo(() => {
    switch (currentStep) {
      case PoolCreatingStep.setupToken:
        return <ListTokenSetup setCurrentStep={setCurrentStep} />
      case PoolCreatingStep.addLiquidity:
        if (!pools[poolAddress]) return null
        return (
          <AddLiquidity
            setCurrentStep={setCurrentStep}
            poolAddress={poolAddress}
            onClose={onClose}
          />
        )
      case PoolCreatingStep.confirmCreatePool:
        if (!pools[poolAddress]) return null
        return <ConfirmPoolInfo onConfirm={onClose} poolAddress={poolAddress} />
    }
  }, [currentStep, onClose, poolAddress, pools])

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Steps size="small" current={currentStep}>
          <Step title="Select tokens & weights" />
          <Step title="Add liquidity" />
          <Step title="Confirm" />
        </Steps>
      </Col>
      {creatingPoolProcess}
    </Row>
  )
}

export default ModalNewPool
