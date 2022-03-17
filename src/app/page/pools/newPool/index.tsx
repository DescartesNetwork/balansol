import { Fragment, useMemo, useState } from 'react'

import { Button, Col, Modal, Row, Steps, Typography } from 'antd'
import IonIcon from 'shared/antd/ionicon'
import SelectToken from './selectToken'
import AddLiquidty from './addLiquidity'
import ConfirmPoolInfo from './confirmPoolInfo'

const { Step } = Steps

export type TokenInfo = {
  addressToken: string
  weight: string
  isLocked: boolean
}

const NewPool = () => {
  const [visible, setVisible] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [poolAddress, setPoolAddress] = useState('')
  const [depositedAmounts, setDepositedAmounts] = useState<string[]>([])
  const [tokenList, setTokenList] = useState<TokenInfo[]>([
    { addressToken: '', weight: '50', isLocked: false },
    { addressToken: '', weight: '50', isLocked: false },
  ])

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
  }, [currentStep, depositedAmounts, poolAddress, tokenList])

  const onChange = (value: number) => {
    setCurrentStep(value)
  }

  const onChangeTokenInfo = (value: TokenInfo, index: number) => {
    if (tokenList[index].weight !== value.weight) {
      const portionWeight =
        (100 - Number(value.weight)) / (tokenList.length - 1)
      const newTokenList: TokenInfo[] = tokenList.map((token, idx) => {
        if (index !== idx) return { ...token, weight: String(portionWeight) }
        return value
      })
      return setTokenList(newTokenList)
    }
    const newTokenList = tokenList.map((token, idx) => {
      if (idx === index) return value
      return token
    })

    setTokenList(newTokenList)
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
