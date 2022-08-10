import { useState } from 'react'

import { Button, Row, Col } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import CardDescription from './cardDescription'

import { notifyError, notifySuccess } from 'helper'

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
    <Row gutter={[16, 16]}>
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

export default FreezePool
