import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useMint } from '@senhub/providers'

import { Button, Col, Modal, Row, Steps, Typography } from 'antd'
import IonIcon from 'shared/antd/ionicon'
import SelectToken from './selectToken'
import AddLiquidty from './addLiquidity'
import ConfirmPoolInfo from './confirmPoolInfo'

import { AppState } from 'app/model'
import { numeric } from 'shared/util'
import { undecimalizeWrapper } from 'app/helper'

import './index.less'
import { PoolCreatingStep } from 'app/constant'

const { Step } = Steps

export type TokenInfo = {
  addressToken: string
  weight: string
  isLocked: boolean
}

const initializedTokenList = [
  { addressToken: '', weight: '50', isLocked: false },
  { addressToken: '', weight: '50', isLocked: false },
]

const NewPool = () => {
  const { pools } = useSelector((state: AppState) => state)
  const [visible, setVisible] = useState(false)
  const [currentStep, setCurrentStep] = useState(PoolCreatingStep.setGradient)
  const [poolAddress, setPoolAddress] = useState('')
  const [depositedAmounts, setDepositedAmounts] = useState<string[]>([])
  const [restoredDepositedAmounts, setRestoreDepositedAmounts] = useState<
    string[]
  >([])
  const [tokenList, setTokenList] = useState<TokenInfo[]>(initializedTokenList)
  const { getDecimals } = useMint()

  const recoverCreatPoolProcess = useCallback(async () => {
    if (visible) return
    const addressWallet = await window.sentre.wallet?.getAddress()
    const createdPools = Object.keys(pools).filter(
      (value) => pools[value].authority.toBase58() === addressWallet,
    )
    for (let i = 0; i < createdPools.length; i++) {
      if (
        Object.keys(pools[createdPools[i]].state as any).includes(
          'uninitialized',
        )
      ) {
        setCurrentStep(PoolCreatingStep.addLiquidity)
        setPoolAddress(createdPools[i])
        const recoveryPoolState = pools[createdPools[i]].mints.map(
          (mint, idx) => {
            return {
              addressToken: mint.toBase58(),
              weight: (
                pools[createdPools[i]].weights[idx].toNumber() /
                10 ** 9
              ).toString(),
              isLocked: false,
            }
          },
        )
        setTokenList(recoveryPoolState)
        const recoveryReservePool = await Promise.all(
          pools[createdPools[i]].reserves.map(async (value, idx) => {
            const decimals = await getDecimals(
              pools[createdPools[i]].mints[idx].toBase58(),
            )
            return numeric(undecimalizeWrapper(value, decimals)).format(
              '0.[000]',
            )
          }),
        )
        setDepositedAmounts(recoveryReservePool)

        setRestoreDepositedAmounts(recoveryReservePool)
      }
    }
  }, [getDecimals, pools, visible])

  useEffect(() => {
    recoverCreatPoolProcess()
  }, [recoverCreatPoolProcess])

  const onReset = () => {
    setVisible(false)
    setTokenList(initializedTokenList)
    setPoolAddress('')
    setDepositedAmounts([])
    setRestoreDepositedAmounts([])
    setCurrentStep(PoolCreatingStep.setGradient)
  }

  const creatingPoolProcess = useMemo(() => {
    switch (currentStep) {
      case PoolCreatingStep.setGradient:
        return (
          <SelectToken
            tokenList={tokenList}
            onSetTokenList={setTokenList}
            setCurrentStep={setCurrentStep}
            setPoolAddress={setPoolAddress}
          />
        )
      case PoolCreatingStep.addLiquidity:
        return (
          <AddLiquidty
            tokenList={tokenList}
            onSetTokenList={setTokenList}
            setCurrentStep={setCurrentStep}
            poolAddress={poolAddress}
            depositedAmounts={depositedAmounts}
            setDepositedAmounts={setDepositedAmounts}
            restoredDepositedAmounts={restoredDepositedAmounts}
          />
        )
      case PoolCreatingStep.confirmCreatePool:
        return (
          <ConfirmPoolInfo
            tokenList={tokenList}
            onSetTokenList={setTokenList}
            setCurrentStep={setCurrentStep}
            poolAddress={poolAddress}
            depositedAmounts={depositedAmounts}
            setVisible={setVisible}
            onReset={onReset}
          />
        )
    }
  }, [
    currentStep,
    depositedAmounts,
    poolAddress,
    restoredDepositedAmounts,
    tokenList,
  ])

  return (
    <Fragment>
      <Button
        type="primary"
        icon={<IonIcon name="add-outline" />}
        onClick={() => setVisible(!visible)}
        style={{ borderRadius: 40 }}
      >
        New pool
      </Button>
      <Modal
        visible={visible}
        onCancel={() => {
          setVisible(false)
        }}
        closeIcon={<IonIcon name="close" />}
        footer={null}
        destroyOnClose={true}
        centered={true}
      >
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Typography.Title level={4}>New Pool</Typography.Title>
          </Col>
          <Col span={24}>
            <Steps size="small" current={currentStep}>
              <Step title="Select tokens & weights" />
              <Step title="Set liquidity" />
              <Step title="Confirm" />
            </Steps>
          </Col>
          {creatingPoolProcess}
        </Row>
      </Modal>
    </Fragment>
  )
}

export default NewPool
