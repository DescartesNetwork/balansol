import { useState } from 'react'
import { useSelector } from 'react-redux'
import { PoolState } from '@senswap/balancer'

import { Button, Row, Col, Typography, Badge, Space } from 'antd'
import IonIcon from 'shared/antd/ionicon'

import { AppState } from 'app/model'
import { notifyError, notifySuccess } from 'app/helper'
import { PresetStatusColorType } from 'antd/lib/_util/colors'

const FreezeAndThaw = ({ poolAddress }: { poolAddress: string }) => {
  const { pools } = useSelector((state: AppState) => state)

  const poolData = pools[poolAddress]
  const state = poolData.state as PoolState

  if (state['initialized']) return <FreezePool poolAddress={poolAddress} />
  if (state['frozen']) return <ThawPool poolAddress={poolAddress} />
  return null
}

export default FreezeAndThaw

const FreezePool = ({ poolAddress }: { poolAddress: string }) => {
  const [loading, setLoading] = useState(false)

  const onFreezePool = async () => {
    setLoading(true)
    try {
      const { freezePool } = window.balansol
      const { txId } = await freezePool(poolAddress)
      return notifySuccess('Freeze', txId)
    } catch (err) {
      notifyError(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <CardDescription
          statusColor="success"
          statusContent="Active"
          description="Freezing a pool will prevent all actions until the pool has been thawed."
        />
      </Col>
      <Col span={24}>
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
      </Col>
    </Row>
  )
}

const ThawPool = ({ poolAddress }: { poolAddress: string }) => {
  const [loading, setLoading] = useState(false)

  const onThawPool = async () => {
    setLoading(true)
    try {
      const { thawPool } = window.balansol
      const { txId } = await thawPool(poolAddress)
      return notifySuccess('Thaw', txId)
    } catch (err) {
      notifyError(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <CardDescription
          statusColor="error"
          statusContent="Frozen"
          description="Thaw a pool will active all actions"
        />
      </Col>
      <Col span={24}>
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
      </Col>
    </Row>
  )
}

const CardDescription = ({
  description,
  statusColor = 'success',
  statusContent,
}: {
  description: string
  statusColor?: PresetStatusColorType
  statusContent: string
}) => {
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
          <Badge status={statusColor} />
          <Typography.Text>Current status: {statusContent}</Typography.Text>
        </Space>
      </Col>
    </Row>
  )
}
