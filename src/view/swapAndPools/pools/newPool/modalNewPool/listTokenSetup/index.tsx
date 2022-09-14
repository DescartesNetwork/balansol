import { useCallback, useEffect, useMemo, useState } from 'react'
import { BN, web3 } from '@project-serum/anchor'
import { MintActionStates } from '@senswap/balancer'

import { Button, Col, Row } from 'antd'
import Proportion from 'components/proportion'
import IonIcon from '@sentre/antd-ionicon'
import TokenSetup from './tokenSetup'

import { GENERAL_NORMALIZED_NUMBER, PoolCreatingStep } from 'constant'
import { notifyError, notifySuccess } from 'helper'
import { MintSetup } from '../index'
import configs from 'configs'

const DEFAULT_SWAP_FEE = new BN(2_500_000) // 0.25%
const DEFAULT_TAX_FEE = new BN(500_000) // 0.05%
const DEFAULT_EMPTY_TOKEN = {
  addressToken: '',
  weight: '',
  isLocked: false,
}
const TOKEN_LIMIT = 8

export type ListTokenSetupProps = {
  setCurrentStep: (step: PoolCreatingStep) => void
}

const ListTokenSetup = ({ setCurrentStep }: ListTokenSetupProps) => {
  const [listMintSetting, setListMintSetting] = useState<MintSetup[]>([])
  const [indexJustUpdated, setIndexJustUpdated] = useState(-1)
  const [loading, setLoading] = useState(false)

  const autoEstimateWeight = useCallback(() => {
    let totalWeight = 100
    // Locked mint
    let lockedMintsAmount = 0
    let lastUnlockIndex = -1
    listMintSetting.forEach((mintSetting, idx) => {
      const locked = mintSetting.isLocked || idx === indexJustUpdated
      if (!locked) return (lastUnlockIndex = idx)
      totalWeight -= Number(mintSetting.weight)
      lockedMintsAmount++
    })
    if (totalWeight < 0) totalWeight = 0

    // Unlocked mint
    const unlockedMintsAmount = listMintSetting.length - lockedMintsAmount
    let averageWeight = totalWeight / unlockedMintsAmount
    const newListMintSetting = JSON.parse(
      JSON.stringify(listMintSetting),
    ) as MintSetup[]
    newListMintSetting.forEach((mintSetting, idx) => {
      const locked = mintSetting.isLocked || idx === indexJustUpdated
      if (locked) return
      if (idx === lastUnlockIndex)
        return (mintSetting.weight = totalWeight.toFixed(2))
      mintSetting.weight = averageWeight.toFixed(2)
      return (totalWeight -= Number(mintSetting.weight))
    })
    if (JSON.stringify(listMintSetting) !== JSON.stringify(newListMintSetting))
      setListMintSetting(newListMintSetting)
  }, [indexJustUpdated, listMintSetting])

  useEffect(() => {
    autoEstimateWeight()
  }, [autoEstimateWeight])

  const onCreatePool = async () => {
    try {
      setLoading(true)
      const mintsConfig = listMintSetting.map(({ addressToken, weight }) => {
        const normalizeWeight = Number(weight) * GENERAL_NORMALIZED_NUMBER
        return {
          publicKey: new web3.PublicKey(addressToken),
          action: MintActionStates.Active,
          amountIn: new BN(0),
          weight: new BN(normalizeWeight),
        }
      })
      const { txId } = await window.balansol.initializePool(
        DEFAULT_SWAP_FEE,
        DEFAULT_TAX_FEE,
        mintsConfig,
        configs.sol.taxmanAddress,
      )
      notifySuccess('Create pool', txId)
      setCurrentStep(PoolCreatingStep.addLiquidity)
    } catch (error) {
      notifyError(error)
    } finally {
      setLoading(false)
    }
  }

  const onChangeTokenInfo = (mintSetting: MintSetup, index: number) => {
    if (loading) return
    const newListMintSetting = [...listMintSetting]
    newListMintSetting[index] = { ...mintSetting }
    setListMintSetting(newListMintSetting)
    // Change weight
    if (mintSetting.weight !== listMintSetting[index].weight)
      setIndexJustUpdated(index)
  }

  const onAddNewToken = () => {
    if (loading || listMintSetting.length >= TOKEN_LIMIT) return
    setListMintSetting([...listMintSetting, { ...DEFAULT_EMPTY_TOKEN }])
  }

  const onRemoveToken = (index: number) => {
    if (loading) return
    setListMintSetting(listMintSetting.filter((e, i) => i !== index))
  }

  // Set default tokens new pool
  useEffect(() => {
    setListMintSetting([{ ...DEFAULT_EMPTY_TOKEN }, { ...DEFAULT_EMPTY_TOKEN }])
  }, [])

  const disabled = useMemo(() => {
    if (listMintSetting.length < 2) return true
    let sum = 0
    for (const setting of listMintSetting) {
      if (!setting.addressToken || !Number(setting.weight)) return true
      sum += Number(setting.weight)
    }
    return sum !== 100
  }, [listMintSetting])

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Row gutter={[0, 12]}>
          <Col flex="auto">Token</Col>
          <Col>Weight</Col>
          {listMintSetting.map((mintSetup, index) => (
            <Col span={24} key={mintSetup.addressToken + index}>
              <TokenSetup
                tokenList={listMintSetting}
                mintSetup={mintSetup}
                onChangeTokenInfo={onChangeTokenInfo}
                onRemoveToken={onRemoveToken}
                id={index}
              />
            </Col>
          ))}
          {listMintSetting.length < TOKEN_LIMIT && (
            <Col span={24}>
              <Button
                icon={<IonIcon name="add-outline" />}
                onClick={onAddNewToken}
                ghost
                disabled={loading}
              >
                Add a token
              </Button>
            </Col>
          )}
        </Row>
      </Col>
      <Col span={24}>
        <Proportion tokenList={listMintSetting} />
      </Col>
      <Col span={24}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Button
              type="primary"
              onClick={onCreatePool}
              disabled={disabled}
              loading={loading}
              block
            >
              Supply
            </Button>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default ListTokenSetup
