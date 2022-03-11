import { useCallback, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useWallet } from '@senhub/providers'

import { Row, Col, Typography, Button, Space } from 'antd'
import IonIcon from 'shared/antd/ionicon'

import { AppDispatch, AppState } from 'app/model'
import { increaseCounter } from 'app/model/main.controller'
import configs from 'app/configs'
import { createPDB } from 'shared/pdb'
import { AppLoader } from 'app/components/appLoader'

const {
  manifest: { appId },
} = configs

const Page = () => {
  const {
    wallet: { address },
  } = useWallet()
  const dispatch = useDispatch<AppDispatch>()
  const { counter } = useSelector((state: AppState) => state.main)

  const pdb = useMemo(() => createPDB(address, appId), [address])
  const increase = useCallback(() => dispatch(increaseCounter()), [dispatch])
  useEffect(() => {
    if (pdb) pdb.setItem('counter', counter)
  }, [pdb, counter])

  return (
    <AppLoader>
      <Row gutter={[24, 24]} align="middle">
        <Col span={24}>
          <Space align="center">
            <IonIcon name="newspaper-outline" />
            <Typography.Title level={4}>Page</Typography.Title>
          </Space>
        </Col>
        <Col span={24}>
          <Typography.Text>Address: {address}</Typography.Text>
        </Col>
        <Col>
          <Typography.Text>Counter: {counter}</Typography.Text>
        </Col>
        <Col>
          <Button onClick={increase}>Increase</Button>
        </Col>
      </Row>
    </AppLoader>
  )
}

export default Page
