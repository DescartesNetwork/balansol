import { useState } from 'react'
import { useSelector } from 'react-redux'

import { Button, Col, Row } from 'antd'
import ConfirmSwap from './confirmSwap'

import { AppState } from 'model'
import { useSwap } from 'hooks/useSwap'

import './index.less'

const ReviewSwap = () => {
  const bidAmount = useSelector((state: AppState) => state.swap.bidAmount)
  const askAmount = useSelector((state: AppState) => state.swap.askAmount)
  const loading = useSelector((state: AppState) => state.swap.loading)

  const [visible, setVisible] = useState(false)
  const { route } = useSwap()

  const disabled =
    !Number(bidAmount) || !Number(askAmount) || !route.length || loading

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Button
          type="primary"
          onClick={() => setVisible(true)}
          disabled={disabled}
          loading={loading && Number(bidAmount) + Number(askAmount) !== 0}
          block
          size="large"
        >
          {!disabled ? 'Review' : 'Enter an amount'}
        </Button>
      </Col>
      <ConfirmSwap visible={visible} onCancel={() => setVisible(false)} />
    </Row>
  )
}

export default ReviewSwap
