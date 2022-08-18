import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { BN } from '@project-serum/anchor'
import { useUI, util } from '@sentre/senhub'

import { Button, Col, Row, Space, Typography } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import { MintAvatar, MintSymbol } from '@sen-use/app'
import NumericInput from 'components/numericInput'

import { calcNormalizedWeight } from 'helper/oracles'
import { AppState } from 'model'
import { TokenInfo } from 'view/swapAndPools/pools/newPool'
import { notifyError, notifySuccess } from 'helper'
import { GENERAL_NORMALIZED_NUMBER } from 'constant'

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
  const { mints, weights } = useSelector(
    (state: AppState) => state.pools[poolAddress],
  )
  const {
    ui: { theme },
  } = useUI()

  const fetchWeights = useCallback(() => {
    const nextWeights: Record<string, TokenInfo> = {}
    mints.forEach((mint, index) => {
      const normalizedWeight = calcNormalizedWeight(weights, weights[index])
      const addressToken = mint.toBase58()

      nextWeights[addressToken] = {
        addressToken,
        weight: util.numeric(normalizedWeight * 100).format('0,0.[00]'),
        isLocked: false,
      }
    })
    setTokensInfo(nextWeights)
  }, [mints, weights])

  const onWeightChange = (val: string, mint: string) => {
    const newTokensInfo = { ...tokensInfo }
    newTokensInfo[mint] = { ...newTokensInfo[mint], weight: val }
    let remainingPercent = TOTAL_PERCENT - Number(val)

    const amountTokenNotLock = Object.values(newTokensInfo).filter(
      (token) => !token.isLocked && token.addressToken !== mint,
    ).length
    let firstTime = true

    for (const mintAddress of mints) {
      const { isLocked, weight, addressToken } =
        newTokensInfo[mintAddress.toBase58()]

      if (mint === addressToken) continue
      if (isLocked) {
        remainingPercent -= Number(weight)
        continue
      }

      const nextWeight = (remainingPercent / amountTokenNotLock).toFixed(2)

      if (firstTime) {
        const newWeight =
          remainingPercent - Number(nextWeight) * (amountTokenNotLock - 1)

        newTokensInfo[addressToken] = {
          ...newTokensInfo[addressToken],
          weight: util.numeric(newWeight).format('0,0.[00]'),
        }
        firstTime = false
        continue
      }

      newTokensInfo[addressToken] = {
        ...newTokensInfo[addressToken],
        weight: util.numeric(nextWeight).format('0,0.[00]'),
      }
    }

    return setTokensInfo(newTokensInfo)
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
      return numWeight === Number(util.numeric(actualWeight).format('0,0.[00]'))
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
              <Col
                flex="auto"
                className={
                  validateWeight(addressToken)
                    ? 'weight-input'
                    : 'weight-input-error'
                }
              >
                <NumericInput
                  prefix={<Token mintAddress={addressToken} />}
                  disabled={isLocked}
                  bordered={false}
                  controls={false}
                  styles={{
                    borderRadius: 40,
                    background: theme === 'light' ? '#e6eaf5' : '#142042',
                  }}
                  addonAfter={<Typography.Text>%</Typography.Text>}
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
