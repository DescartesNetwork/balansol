import { BN, web3 } from '@project-serum/anchor'
import { MintActionStates } from '@senswap/balancer'
import { Button, Col, Row, Space, Typography } from 'antd'
import Proportion from 'app/components/proportion'
import { PoolCreatingStep } from 'app/constant'
import { notifyError, notifySuccess } from 'app/helper'
import React, { Dispatch, Fragment, useEffect, useState } from 'react'
import IonIcon from 'shared/antd/ionicon'
import { TokenInfo } from '..'
import TokenSetup from '../tokenSetup'

const SelectToken = ({
  tokenList,
  onSetTokenList,
  setCurrentStep,
  setPoolAddress,
}: {
  tokenList: TokenInfo[]
  onSetTokenList: Dispatch<React.SetStateAction<TokenInfo[]>>
  setCurrentStep: Dispatch<React.SetStateAction<PoolCreatingStep>>
  setPoolAddress: Dispatch<React.SetStateAction<string>>
}) => {
  const [disable, setDisable] = useState(true)

  useEffect(() => {
    const currentWeightTotal = tokenList.reduce(
      (previousSum, currentToken) => Number(currentToken.weight) + previousSum,
      0,
    )
    if (currentWeightTotal !== 100) {
      return setDisable(true)
    }
    for (let index = 0; index < tokenList.length; index++) {
      const token = tokenList[index]
      if (token.addressToken === '' || Number(token.weight) === 0) {
        return setDisable(true)
      }
    }
    setDisable(false)
  }, [tokenList])

  const onCreate = async () => {
    try {
      const fee = new BN(500_000_000)
      const mintsConfig = tokenList.map((e) => {
        const normalizeWeight = Number(e.weight) * 10 ** 9
        return {
          publicKey: new web3.PublicKey(e.addressToken),
          action: MintActionStates.Active,
          amountIn: new BN(0),
          weight: new BN(normalizeWeight),
        }
      })
      const { txId, poolAddress } = await window.balansol.initializePool(
        fee,
        mintsConfig,
      )

      setPoolAddress(poolAddress)
      setCurrentStep(PoolCreatingStep.addLiquidity)
      notifySuccess('Create pool', txId)
    } catch (error) {
      notifyError(error)
    }
  }

  const onChangeTokenInfo = (value: TokenInfo, index: number) => {
    if (Number(value.weight) > 100) {
      const newTokenList = tokenList.map((token, idx) => {
        if (idx === index) {
          return value
        }
        if (token.isLocked) {
          return token
        }
        return { ...token, weight: '0' }
      })

      return onSetTokenList(newTokenList)
    }
    const tokensNotLock = tokenList.filter((value) => value.isLocked === false)
    const lockedTokens = tokenList.filter((value) => value.isLocked === true)

    if (tokensNotLock.length === 1) {
      const newTokenList = tokenList.map((token, idx) => {
        if (idx === index) {
          return value
        }
        return token
      })

      return onSetTokenList(newTokenList)
    }

    if (tokenList[index].weight !== value.weight) {
      const lockedTokenWeight = lockedTokens.reduce(
        (previousSum, currentValue) =>
          previousSum + Number(currentValue.weight),
        0,
      )
      const portionWeight =
        (100 - Number(value.weight) - lockedTokenWeight) /
        (tokensNotLock.length - 1)

      const newTokenList: TokenInfo[] = tokenList.map((tokenIn, ind) => {
        if (index !== ind && !tokenIn.isLocked) {
          return { ...tokenIn, weight: String(portionWeight) }
        }
        if (index === ind) {
          return value
        }
        return tokenIn
      })
      return onSetTokenList(newTokenList)
    }
    const newTokenList = tokenList.map((token, idx) => {
      if (idx === index) {
        return value
      }
      return token
    })

    onSetTokenList(newTokenList)
  }

  const onAddNewToken = () => {
    if (tokenList.length >= 8) return
    const tokensNotLock = tokenList.filter((value) => value.isLocked === false)
    const remainingWeight = tokensNotLock.reduce(
      (previousSum, currentValue) => previousSum + Number(currentValue.weight),
      0,
    )
    const newProportionalWeight =
      Math.round((remainingWeight / (tokensNotLock.length + 1)) * 100) / 100
    let flag = false
    let newTokenList: TokenInfo[] = []

    for (let i = 0; i < tokenList.length; i++) {
      if (tokenList[i].isLocked) {
        newTokenList.push(tokenList[i])
        continue
      }
      if (flag === false) {
        newTokenList.push({
          ...tokenList[i],
          weight: (
            remainingWeight -
            Number((newProportionalWeight * tokensNotLock.length).toFixed(2))
          ).toFixed(2),
        })
        flag = true
        continue
      }
      newTokenList.push({
        ...tokenList[i],
        weight: String(newProportionalWeight),
      })
    }

    onSetTokenList([
      ...newTokenList,
      {
        addressToken: '',
        weight: String(newProportionalWeight),
        isLocked: false,
      },
    ])
  }

  const onRemoveToken = (index: number) => {
    const newTokenList = [...tokenList]
    newTokenList.splice(index, 1)
    const tokensNotLock = newTokenList.filter(
      (value) => value.isLocked === false,
    )
    const lockedTokens = newTokenList.filter((value) => value.isLocked === true)
    const remainingWeight =
      100 -
      lockedTokens.reduce(
        (previousSum, currentValue) =>
          previousSum + Number(currentValue.weight),
        0,
      )

    const newProportionalWeight =
      Math.round((remainingWeight / tokensNotLock.length) * 100) / 100
    let flag = false
    let newRecalculatedTokenList: TokenInfo[] = []

    for (let i = 0; i < newTokenList.length; i++) {
      if (newTokenList[i].isLocked) {
        newRecalculatedTokenList.push(newTokenList[i])
        continue
      }
      if (flag === false) {
        newRecalculatedTokenList.push({
          ...newTokenList[i],
          weight: (
            remainingWeight -
            Number(
              (newProportionalWeight * (tokensNotLock.length - 1)).toFixed(2),
            )
          ).toFixed(2),
        })
        flag = true
        continue
      }
      newRecalculatedTokenList.push({
        ...newTokenList[i],
        weight: String(newProportionalWeight),
      })
    }
    onSetTokenList(newRecalculatedTokenList)
  }

  return (
    <Fragment>
      <Col span={24}>
        <Row>
          <Col flex="auto">Token</Col>
          <Col>Weight</Col>
        </Row>
      </Col>
      {tokenList.map((value, index) => (
        <Col span={24}>
          <TokenSetup
            tokenList={tokenList}
            tokenInfo={value}
            onChangeTokenInfo={onChangeTokenInfo}
            onRemoveToken={onRemoveToken}
            index={index}
          />
        </Col>
      ))}
      <Col span={24}>
        <Button
          type="primary"
          icon={<IonIcon name="add-outline" />}
          onClick={() => {
            onAddNewToken()
          }}
          style={{ borderRadius: 40 }}
        >
          New pool
        </Button>
      </Col>
      <Col span={24}>
        <Proportion tokenList={tokenList} />
      </Col>
      <Col span={24}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Button type="primary" onClick={onCreate} disabled={disable} block>
              Supply
            </Button>
          </Col>
          {false && (
            <Col span={24}>
              <Space align="start">
                <Typography.Text className="caption" type="danger">
                  <IonIcon name="warning-outline" />
                </Typography.Text>
                <Typography.Text className="caption" type="danger">
                  A pool of the desired pair of tokens had already created. We
                  highly recommend to deposit your liquidity to the pool
                  instead.
                </Typography.Text>
              </Space>
            </Col>
          )}
        </Row>
      </Col>
    </Fragment>
  )
}

export default SelectToken
