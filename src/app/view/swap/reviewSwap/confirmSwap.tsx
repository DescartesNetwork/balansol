import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import {
  Row,
  Col,
  Space,
  Typography,
  Modal,
  Card,
  Checkbox,
  Button,
} from 'antd'
import IonIcon from 'shared/antd/ionicon'
import { MintAvatar, MintSymbol } from 'shared/antd/mint'
import PreviewSwap from 'app/components/swapInfo'

import { AppState } from 'app/model'
import { notifyError, notifySuccess } from 'app/helper'
import { PriceImpact } from 'app/constant'

import './index.less'
import { useSwap } from 'app/hooks/useSwap'

export type ConfirmSwapProps = {
  visible?: boolean
  onCancel?: () => void
}

const ConfirmSwap = ({
  visible = false,
  onCancel = () => {},
}: ConfirmSwapProps) => {
  const {
    swap: { bidAmount, bidMint, askMint },
  } = useSelector((state: AppState) => state)

  const [checked, setChecked] = useState(false)
  const [isDisplayWarning, setIsDisplayWarning] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { askAmount, priceImpact, swap } = useSwap()

  useEffect(() => {
    if (priceImpact > PriceImpact.goodSwap) return setIsDisplayWarning(true)
    setIsDisplayWarning(false)
  }, [priceImpact])

  const onCloseModal = useCallback(() => {
    onCancel()
    setChecked(false)
  }, [onCancel])

  const onSwap = async () => {
    setIsLoading(true)
    try {
      const { txId } = await swap()
      onCancel()
      notifySuccess('Swap', txId)
    } catch (error) {
      notifyError(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal
      onCancel={onCloseModal}
      closeIcon={<IonIcon name="close" />}
      footer={null}
      visible={visible}
      forceRender
    >
      <Row gutter={[16, 24]}>
        <Col span={24}>
          <Typography.Title level={4}> Review</Typography.Title>
        </Col>
        <Col span={24}>
          <Row align="middle" justify="space-between">
            <Col>
              <Space direction="vertical">
                <Typography.Text>From</Typography.Text>
                <Space>
                  <MintAvatar mintAddress={bidMint} />
                  <Typography.Text>
                    <MintSymbol mintAddress={bidMint} />
                  </Typography.Text>
                </Space>
                <Typography.Title level={4}>{bidAmount}</Typography.Title>
              </Space>
            </Col>
            <Col>
              <IonIcon name="arrow-forward-outline" style={{ fontSize: 24 }} />
            </Col>
            <Col>
              <Space direction="vertical" align="end">
                <Typography.Text>To</Typography.Text>
                <Space>
                  <MintAvatar mintAddress={askMint} />
                  <Typography.Text>
                    <MintSymbol mintAddress={askMint} />
                  </Typography.Text>
                </Space>
                <Typography.Title level={4}>{askAmount}</Typography.Title>
              </Space>
            </Col>
          </Row>
        </Col>
        <Col>
          <Card bordered={false} className="confirm-info">
            <PreviewSwap />
          </Card>
        </Col>
        {isDisplayWarning && (
          <Col span={24}>
            <Checkbox checked={checked} onChange={() => setChecked(!checked)}>
              The price impact is currently high. Tick the checkbox to accept
              the swap.
            </Checkbox>
          </Col>
        )}

        <Col span={24}>
          <Button
            type="primary"
            onClick={onSwap}
            disabled={isDisplayWarning && !checked}
            loading={isLoading}
            block
          >
            Swap
          </Button>
        </Col>
      </Row>
    </Modal>
  )
}
export default ConfirmSwap
