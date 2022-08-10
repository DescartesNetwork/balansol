import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useWalletAddress } from '@sentre/senhub'

import { Col, Row, Steps, Typography } from 'antd'
import ListTokenSetup from './listTokenSetup'
import AddLiquidity from './addLiquidity'
import ConfirmPoolInfo from './confirmPoolInfo'

import { AppState } from 'model'
import { PoolCreatingStep } from 'constant'
import { PoolState } from '@senswap/balancer'

const { Step } = Steps

export type MintSetup = {
  addressToken: string
  weight: string
  isLocked: boolean
  decimal?: number
}

export type ModalNewPoolProps = { onClose: () => void }

const ModalNewPool = ({ onClose = () => {} }: ModalNewPoolProps) => {
  const pools = useSelector((state: AppState) => state.pools)
  const [currentStep, setCurrentStep] = useState(PoolCreatingStep.setupToken)
  const [poolAddress, setPoolAddress] = useState('')

  const walletAddress = useWalletAddress()

  const recoverCreatePoolProcess = useCallback(async () => {
    if (poolAddress) return
    for (const poolAddress in pools) {
      const poolData = pools[poolAddress]
      if (poolData.authority.toBase58() !== walletAddress) continue
      if (!(poolData.state as PoolState)['uninitialized']) continue
      setCurrentStep(PoolCreatingStep.addLiquidity)
      return setPoolAddress(poolAddress)
    }
    return setPoolAddress('')
  }, [poolAddress, pools, walletAddress])

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
        <Typography.Title level={4}>New Pool</Typography.Title>
      </Col>
      <Col span={24}>
        <Steps size="small" current={currentStep}>
          <Step title="Select tokens & weights" />
          <Step title="Add liquidity" />
          <Step title="Confirm" />
        </Steps>
      </Col>
      <Col span={24}>{creatingPoolProcess}</Col>
    </Row>
  )
}

export default ModalNewPool
