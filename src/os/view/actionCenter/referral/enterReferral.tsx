import { useCallback, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { account } from '@senswap/sen-js'

import { Button, Col, Input, Row, Typography, Space } from 'antd'
import IonIcon from 'shared/antd/ionicon'
import ConfirmSuccessFully from './confirmSuccess'

import configs from 'os/configs'
import {
  RootDispatch,
  RootState,
  useRootDispatch,
  useRootSelector,
} from 'os/store'
import { shortenAddress, explorer } from 'shared/util'
import { getReferrer, setReferrer } from 'os/helpers/utils'
import PDB from 'shared/pdb'
import { setWalkthrough, WalkThroughType } from 'os/store/walkthrough.reducer'

const {
  referral: { base },
} = configs

const EnterReferral = () => {
  const dispatch = useRootDispatch<RootDispatch>()
  const {
    wallet: { address: walletAddress },
    walkthrough: { run, step },
  } = useRootSelector((state: RootState) => state)
  const [referrerAddress, setReferrerAddress] = useState('')
  const [value, setValue] = useState('')
  const [visible, setVisible] = useState(false)
  const query = new URLSearchParams(useLocation().search)
  const paramReferrerAddress = query.get('referral') || ''

  const loadReferrerAddress = useCallback(async () => {
    if (!account.isAddress(walletAddress)) return setReferrerAddress('')
    const address = await getReferrer(walletAddress)
    if (account.isAddress(address)) return setReferrerAddress(address)
    setReferrerAddress('')
    if (account.isAddress(paramReferrerAddress))
      return setValue(paramReferrerAddress)
  }, [paramReferrerAddress, walletAddress])

  // For testing only
  const removeReferrerAddress = useCallback(async () => {
    if (!account.isAddress(walletAddress)) return
    const db = new PDB(walletAddress).createInstance('sentre')
    db.removeItem('referrerAddress')
    return loadReferrerAddress()
  }, [walletAddress, loadReferrerAddress])

  const validLink = account.isAddress(referrerAddress)

  const onConfirm = useCallback(async () => {
    if (run && step === 2)
      await dispatch(
        setWalkthrough({ type: WalkThroughType.Referral, step: 3 }),
      )
    try {
      if (!value.startsWith(base)) throw new Error('Broken referral link')
      const temp = value.split('/')
      const address = temp.find((e) => account.isAddress(e))
      await setReferrer(walletAddress, address)
      setVisible(true)
      return loadReferrerAddress()
    } catch (er: any) {
      return window.notify({ type: 'warning', description: er.message })
    }
  }, [run, step, dispatch, value, walletAddress, loadReferrerAddress])

  useEffect(() => {
    loadReferrerAddress()
  }, [loadReferrerAddress])

  return (
    <Row gutter={[12, 12]}>
      <Col flex="auto">
        <Input
          size="large"
          placeholder="Referral link"
          value={validLink ? base + referrerAddress : value}
          onChange={(e) => setValue(e.target.value)}
          readOnly={validLink}
        />
      </Col>
      <Col>
        <Button
          id="button-confirm-referral"
          type="primary"
          size="large"
          onClick={onConfirm}
          disabled={validLink}
          block
        >
          Confirm
        </Button>
      </Col>
      <Col span={24} style={{ fontSize: 12 }}>
        {!validLink ? (
          <Typography.Text type="secondary">
            Enter the referral link to receive the reward for both.
          </Typography.Text>
        ) : (
          <Space size={4}>
            <IonIcon name="close" onClick={removeReferrerAddress} />
            <Typography.Text type="secondary">
              You was invited by
            </Typography.Text>
            <Typography.Text
              style={{ cursor: 'pointer' }}
              onClick={() => window.open(explorer(referrerAddress), '_blank')}
            >
              {shortenAddress(referrerAddress)} <IonIcon name="open-outline" />
            </Typography.Text>
          </Space>
        )}
      </Col>
      <ConfirmSuccessFully
        visible={visible}
        onCancel={() => setVisible(false)}
      />
    </Row>
  )
}
export default EnterReferral
