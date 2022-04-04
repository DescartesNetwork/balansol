import { PoolState } from '@senswap/balancer'
import { account } from '@senswap/sen-js'
import { useMemo, useState } from 'react'

import { Button, Row, Col, Typography, Badge, Space } from 'antd'
import IonIcon from 'shared/antd/ionicon'

import { useSelector } from 'react-redux'
import { AppState } from 'app/model'
import { notifyError, notifySuccess } from 'app/helper'

enum PoolStatus {
  Frozen = 2,
  Initialized = 1,
}

const CardDescription = ({
  poolStatus,
  description,
}: {
  poolStatus: PoolStatus
  description: string
}) => {
  const status = poolStatus === PoolStatus.Initialized
  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Space size={4} align="start">
          <IonIcon name="information-circle-outline" />
          <Space direction="vertical" size={0}>
            <Typography.Text type="secondary">{description}</Typography.Text>
          </Space>
        </Space>
      </Col>
      <Col span={24}>
        <Space size={0}>
          <Badge status={status ? 'success' : 'error'} />
          <Typography.Text>
            Current status: {status ? 'Active' : 'Frozen'}
          </Typography.Text>
        </Space>
      </Col>
    </Row>
  )
}

const FreezeAndThaw = ({ address }: { address: string }) => {
  const [loading, setLoading] = useState(false)
  const { pools } = useSelector((state: AppState) => state)

  const poolData = pools?.[address]
  const state = poolData.state as PoolState

  const onFreezePool = async () => {
    setLoading(true)
    if (!account.isAddress(address)) return
    try {
      const { freezePool } = window.balansol
      const { txId } = await freezePool(address)
      return notifySuccess('Freeze', txId)
    } catch (err) {
      notifyError(err)
    } finally {
      setLoading(false)
    }
  }

  const onThawPool = async () => {
    setLoading(true)
    if (!account.isAddress(address)) return
    try {
      const { thawPool } = window.balansol
      const { txId } = await thawPool(address)
      return notifySuccess('Thaw', txId)
    } catch (err) {
      notifyError(err)
    } finally {
      setLoading(false)
    }
  }

  const description = useMemo(() => {
    if (state['initialized'])
      return (
        <CardDescription
          poolStatus={PoolStatus.Initialized}
          description="Freezing a pool will prevent all actions until the pool has been thawed."
        />
      )

    if (state['frozen'])
      return (
        <CardDescription
          poolStatus={PoolStatus.Frozen}
          description="Thaw a pool will active all actions"
        />
      )
  }, [state])

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>{description}</Col>
      <Col span={24}>
        {state['initialized'] ? (
          <Button
            onClick={onFreezePool}
            icon={<IonIcon name="snow-outline" />}
            block
            loading={loading}
            ghost
            size="large"
          >
            Freeze Pool
          </Button>
        ) : (
          <Button
            ghost
            onClick={onThawPool}
            icon={<IonIcon name="sunny-outline" />}
            block
            loading={loading}
            size="large"
          >
            Thaw Pool
          </Button>
        )}
      </Col>
    </Row>
  )
}
export default FreezeAndThaw
