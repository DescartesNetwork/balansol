import { useState } from 'react'

import { Button, Row, Col } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import CardDescription from './cardDescription'

import { notifyError, notifySuccess } from 'helper'

const ThawPool = ({ poolAddress }: { poolAddress: string }) => {
  const [loading, setLoading] = useState(false)

  const onThawPool = async () => {
    setLoading(true)
    try {
      const { thawPool } = window.balansol
      const { txId } = await thawPool({ poolAddress })
      return notifySuccess('Unfreeze', txId)
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
          statusColor="error"
          statusContent="Frozen"
          description="Unfreeze a pool will active all actions"
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
          Unfreeze Pool
        </Button>
      </Col>
    </Row>
  )
}

export default ThawPool
