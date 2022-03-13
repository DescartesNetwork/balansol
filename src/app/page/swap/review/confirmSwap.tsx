import { useCallback, useState } from 'react'
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

import { AppState } from 'app/model'
import PreviewSwap from 'app/components/previewSwap'

import './index.less'

const ConfirmSwap = ({
  visible = false,
  onCancel = () => {},
}: {
  visible?: boolean
  onCancel?: (visible: boolean) => void
}) => {
  const [checked, setChecked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const onCloseModal = useCallback(() => {
    onCancel(false)
    setChecked(false)
  }, [onCancel])

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
                  <MintAvatar mintAddress={''} />
                  <Typography.Text>
                    <MintSymbol mintAddress={''} />
                  </Typography.Text>
                </Space>
                <Typography.Title level={4}>122</Typography.Title>
              </Space>
            </Col>
            <Col>
              <IonIcon name="arrow-forward-outline" style={{ fontSize: 24 }} />
            </Col>
            <Col>
              <Space direction="vertical" align="end">
                <Typography.Text>To</Typography.Text>
                <Space>
                  <MintAvatar mintAddress={''} />
                  <Typography.Text>
                    <MintSymbol mintAddress={''} />
                  </Typography.Text>
                </Space>
                <Typography.Title level={4}>112</Typography.Title>
              </Space>
            </Col>
          </Row>
        </Col>
        <Col>
          <Card bordered={false} className="confirm-info">
            <PreviewSwap />
          </Card>
        </Col>
        {true && (
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
            onClick={() => {
              setIsLoading(true)
              setTimeout(() => {
                setIsLoading(false)
              }, 2000)
            }}
            disabled={isLoading}
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
