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

const { Step } = Steps

export type TokenInfo = {
  addressToken: string
  weight: string
  isLocked: boolean
}

const NewPool = () => {
  const { pools } = useSelector((state: AppState) => state)
  const [visible, setVisible] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [poolAddress, setPoolAddress] = useState('')
  const [depositedAmounts, setDepositedAmounts] = useState<string[]>([])
  const [restoredDepositedAmounts, setRestoreDepositedAmounts] = useState<
    string[]
  >([])
  const [tokenList, setTokenList] = useState<TokenInfo[]>([
    { addressToken: '', weight: '50', isLocked: false },
    { addressToken: '', weight: '50', isLocked: false },
  ])
  const { getDecimals } = useMint()

  const recoverCreatPoolProcess = useCallback(async () => {
    const poolAddresses = Object.keys(pools)
    for (let i = 0; i < poolAddresses.length; i++) {
      if (
        Object.keys(pools[poolAddresses[i]].state as any).includes(
          'uninitialized',
        )
      ) {
        setCurrentStep(1)
        setPoolAddress(poolAddresses[i])
        const recoveryPoolState = pools[poolAddresses[i]].mints.map(
          (mint, idx) => {
            return {
              addressToken: mint.toBase58(),
              weight: pools[poolAddresses[i]].weights[idx].toString(),
              isLocked: false,
            }
          },
        )
        setTokenList(recoveryPoolState)
        const recoveryReservePool = await Promise.all(
          pools[poolAddresses[i]].reserves.map(async (value) => {
            const decimals = await getDecimals(poolAddresses[i])
            return numeric(undecimalizeWrapper(value, decimals)).format(
              '0.[000]',
            )
          }),
        )
        setDepositedAmounts(recoveryReservePool)
        setRestoreDepositedAmounts(recoveryReservePool)
        return
      }
    }
  }, [getDecimals, pools])

  useEffect(() => {
    recoverCreatPoolProcess()
  }, [recoverCreatPoolProcess])

  const creatingPoolProcess = useMemo(() => {
    switch (currentStep) {
      case 0:
        return (
          <SelectToken
            tokenList={tokenList}
            onSetTokenList={setTokenList}
            setCurrentStep={setCurrentStep}
            setPoolAddress={setPoolAddress}
          />
        )
      case 1:
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
      case 2:
        return (
          <ConfirmPoolInfo
            tokenList={tokenList}
            onSetTokenList={setTokenList}
            setCurrentStep={setCurrentStep}
            poolAddress={poolAddress}
            depositedAmounts={depositedAmounts}
            setVisible={setVisible}
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

  const onChange = (value: number) => {
    setCurrentStep(value)
  }

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
            <Steps size="small" current={currentStep} onChange={onChange}>
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
