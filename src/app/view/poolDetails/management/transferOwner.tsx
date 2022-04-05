import { ChangeEvent, useState } from 'react'

import { Button, Col, Input, Row, Space, Typography } from 'antd'
import IonIcon from 'shared/antd/ionicon'
import { account } from '@senswap/sen-js'
import { notifyError, notifySuccess } from 'app/helper'

const TransferOwner = ({ poolAddress }: { poolAddress: string }) => {
  const [newOwner, setNewOwner] = useState('')
  const [loading, setLoading] = useState(false)

  const transferOwner = async () => {
    setLoading(true)
    if (!account.isAddress(newOwner)) return
    try {
      const { transferOwnership } = window.balansol
      const { txId } = await transferOwnership(poolAddress, newOwner)
      return notifySuccess('Update weights', txId)
    } catch (err) {
      notifyError(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Space size={12} align="center">
          <IonIcon style={{ fontSize: 16 }} name="information-circle-outline" />
          <Typography.Text type="secondary">
            Your current account will lose the pool control when you transfer
            ownership.
          </Typography.Text>
        </Space>
      </Col>
      <Col span={24}>
        <Typography.Text>Transfer to Owner</Typography.Text>
      </Col>
      <Col span={24} className="transfer-owner">
        <Input
          className="transfer-owner-input"
          value={newOwner}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setNewOwner(e.target.value)
          }
          placeholder="E.g. AgTMC..."
        />
      </Col>
      <Col span={24}>
        <Button
          ghost
          size="large"
          onClick={transferOwner}
          loading={loading}
          disabled={!newOwner}
          block
        >
          Transfer
        </Button>
      </Col>
    </Row>
  )
}

export default TransferOwner
