import { useState } from 'react'
import { useSelector } from 'react-redux'
import { MintActionState, MintActionStates } from '@senswap/balancer'

import { Button, Row, Col, Typography, Space } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import { MintAvatar, MintSymbol } from '@sen-use/app'

import { AppState } from 'model'
import { getMintState, notifyError, notifySuccess } from 'helper'

export const FreezeAndThawToken = ({
  poolAddress,
}: {
  poolAddress: string
}) => {
  const { mints, actions } = useSelector(
    (state: AppState) => state.pools[poolAddress],
  )
  const [mintActions, setMintActions] = useState<MintActionState[]>(
    actions as MintActionState[],
  )
  const [loading, setLoading] = useState(false)

  const onFreezeAndThawToken = async () => {
    setLoading(true)
    try {
      const { updateActions } = window.balansol
      const { txId } = await updateActions({
        poolAddress,
        actions: mintActions,
      })
      return notifySuccess('Freeze', txId)
    } catch (err) {
      notifyError(err)
    } finally {
      setLoading(false)
    }
  }

  const onClickToken = (index: number) => {
    const newMintActions = [...mintActions]
    const mintState = getMintState(newMintActions, index)

    switch (mintState) {
      case 'paused':
        newMintActions[index] = MintActionStates['Active']
        break
      case 'active':
        newMintActions[index] = MintActionStates['Paused']
        break
      default:
        break
    }
    setMintActions(newMintActions)
  }

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Space size={12} align="start">
          <IonIcon name="alert-circle-outline" />
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            Freezing tokens will prevent all actions until the tokens has been
            unfreezed.
          </Typography.Text>
        </Space>
      </Col>
      <Col span={24}>
        <Row gutter={[12, 12]}>
          {mints.map((mint, idx) => {
            const mintState = getMintState(mintActions, idx)
            return (
              <Col span={12}>
                <Button block onClick={() => onClickToken(idx)} size="large">
                  <Space size={8} className="individual-token">
                    <MintAvatar mintAddress={mint.toBase58()} />
                    <Typography.Text
                      ellipsis
                      style={{ fontWeight: 400, fontSize: 14 }}
                    >
                      <MintSymbol mintAddress={mint.toBase58()} />
                    </Typography.Text>
                  </Space>
                  {mintState === 'paused' && (
                    <Space className="disable-mask" align="center">
                      <IonIcon
                        name="snow-outline"
                        style={{ color: '#F3F3F5' }}
                      />
                    </Space>
                  )}
                </Button>
              </Col>
            )
          })}
        </Row>
      </Col>
      <Col span={24}>
        <Button
          block
          ghost
          onClick={onFreezeAndThawToken}
          size="large"
          disabled={JSON.stringify(actions) === JSON.stringify(mintActions)}
          loading={loading}
        >
          Confirm
        </Button>
      </Col>
    </Row>
  )
}
