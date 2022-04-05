import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { BN } from '@project-serum/anchor'

import { Button, Col, Row, Space, Typography } from 'antd'
import IonIcon from 'shared/antd/ionicon'
import { MintAvatar, MintSymbol } from 'shared/antd/mint'
import NumericInput from 'shared/antd/numericInput'

import { calcNormalizedWeight } from 'app/helper/oracles'
import { AppState } from 'app/model'
import { numeric } from 'shared/util'
import { TokenInfo } from 'app/view/pools/newPool'
import { notifyError, notifySuccess } from 'app/helper'
import { GENERAL_NORMALIZED_NUMBER } from 'app/constant'

const TOTAL_PERCENT = 100

const Token = ({ mintAddress }: { mintAddress: string }) => (
  <Space>
    <MintAvatar mintAddress={mintAddress} />
    <MintSymbol mintAddress={mintAddress} />
  </Space>
)

const Weight = ({ poolAddress }: { poolAddress: string }) => {
  const [tokensInfo, setTokensInfo] = useState<Record<string, TokenInfo>>()
  const [loading, setLoading] = useState(false)
  const { pools } = useSelector((state: AppState) => state)
  const { mints, weights } = pools[poolAddress]

  const fetchWeights = useCallback(() => {
    const nextWeights: Record<string, TokenInfo> = {}
    mints.forEach((mint, index) => {
      const normalizedWeight = calcNormalizedWeight(weights, weights[index])
      const addressToken = mint.toBase58()

      nextWeights[addressToken] = {
        addressToken,
        weight: numeric(normalizedWeight * 100).format('0,0.[00]'),
        isLocked: false,
      }
    })
    setTokensInfo(nextWeights)
  }, [mints, weights])

  const onWeightChange = (val: string, mint: string) => {
    const newWeights = { ...tokensInfo }
    newWeights[mint] = { ...newWeights[mint], weight: val }
    let remainingPercent = TOTAL_PERCENT - Number(val)

    const amountTokenNotLock = Object.values(newWeights).filter(
      (token) => !token.isLocked && token.addressToken !== mint,
    ).length
    let firstTime = true

    for (const mintAddress of mints) {
      const { isLocked, weight, addressToken } =
        newWeights[mintAddress.toBase58()]

      if (mint === addressToken) continue
      if (isLocked) {
        remainingPercent -= Number(weight)
        continue
      }

      const nextWeight = numeric(remainingPercent / amountTokenNotLock).format(
        '0,0.[00]',
      )

      if (firstTime) {
        const newWeight =
          remainingPercent - Number(nextWeight) * (amountTokenNotLock - 1)

        newWeights[addressToken] = {
          ...newWeights[addressToken],
          weight: numeric(newWeight).format('0,0.[00]'),
        }

        firstTime = false
        continue
      }

      newWeights[addressToken] = {
        ...newWeights[addressToken],
        weight: nextWeight,
      }
    }

    return setTokensInfo(newWeights)
  }

  const lockWeight = (mint: string) => {
    const newWeights = { ...tokensInfo }
    const { isLocked } = newWeights[mint]
    newWeights[mint] = { ...newWeights[mint], isLocked: !isLocked }

    setTokensInfo(newWeights)
  }

  const validateWeight = useCallback(
    (mint: string) => {
      if (!tokensInfo) return false
      const { weight } = tokensInfo[mint]
      const numWeight = Number(weight)
      if (numWeight > TOTAL_PERCENT || numWeight < 0) return false

      let remainingPercent = 0
      for (const { addressToken, weight } of Object.values(tokensInfo)) {
        if (mint === addressToken) continue
        remainingPercent += Number(weight)
      }
      const actualWeight = TOTAL_PERCENT - remainingPercent
      return numWeight === Number(numeric(actualWeight).format('0,0.[00]'))
    },
    [tokensInfo],
  )

  const disabled = useMemo(() => {
    if (!tokensInfo) return true
    for (const mintAddress of Object.keys(tokensInfo)) {
      if (!validateWeight(mintAddress)) return true
    }
    return false
  }, [tokensInfo, validateWeight])

  const updateWeights = async () => {
    setLoading(true)
    if (!tokensInfo) return
    const weights = Object.values(tokensInfo).map(({ weight }) => {
      const nextWeight = Number(weight) * GENERAL_NORMALIZED_NUMBER
      const newWeight = new BN(nextWeight)
      return newWeight
    })

    try {
      const { updateWeights } = window.balansol
      const { txId } = await updateWeights(poolAddress, weights)
      return notifySuccess('Update weights', txId)
    } catch (err) {
      notifyError(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWeights()
  }, [fetchWeights])

  return (
    <Row gutter={[12, 12]}>
      {mints.map((mint, idx) => {
        const addressToken = mint.toBase58()
        if (!tokensInfo) return null
        const { isLocked, weight } = tokensInfo[addressToken]

        return (
          <Col span={24} key={addressToken + idx} className="weight">
            <Row gutter={12} align="middle">
              <Col flex="auto">
                <NumericInput
                  prefix={<Token mintAddress={addressToken} />}
                  className={
                    validateWeight(addressToken)
                      ? 'weight-input'
                      : 'weight-input-error'
                  }
                  disabled={isLocked}
                  suffix={<Typography.Text>%</Typography.Text>}
                  value={weight}
                  name={addressToken}
                  onValue={(val: string) => onWeightChange(val, addressToken)}
                />
              </Col>
              <Col>
                <Button
                  shape="circle"
                  type="text"
                  onClick={() => lockWeight(addressToken)}
                  icon={
                    <IonIcon
                      name={
                        isLocked ? 'lock-closed-outline' : 'lock-open-outline'
                      }
                    />
                  }
                />
              </Col>
            </Row>
          </Col>
        )
      })}
      <Col span={24} /> {/** Safe place */}
      <Col span={24}>
        <Button
          onClick={updateWeights}
          loading={loading}
          disabled={disabled}
          block
          ghost
          size="large"
        >
          Update
        </Button>
      </Col>
    </Row>
  )
}

export default Weight
