import { useState } from 'react'
import { useSelector } from 'react-redux'

import { Button, Col, Row } from 'antd'
import ConfirmSwap from './confirmSwap'

import { AppState } from 'app/model'
import { useSwap } from 'app/hooks/useSwap'

import './index.less'

const ReviewSwap = () => {
  const {
    swap: { bidAmount, askAmount },
  } = useSelector((state: AppState) => state)

  const [visible, setVisible] = useState(false)
  const { loading, route } = useSwap()

  const disabled =
    !Number(bidAmount) || !Number(askAmount) || !route.length || loading

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Button
          type="primary"
          onClick={() => setVisible(true)}
          disabled={disabled}
          loading={loading}
          style={{
            borderRadius: 40,
            borderColor: 'transparent',
          }}
          block
        >
          Review
        </Button>
      </Col>
      <ConfirmSwap visible={visible} onCancel={() => setVisible(false)} />
    </Row>
  )
}

export default ReviewSwap
