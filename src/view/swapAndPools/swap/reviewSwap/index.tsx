import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import { Button, Col, Row } from 'antd'
import ConfirmSwap from './confirmSwap'

import { AppState } from 'model'
import { useSwap } from 'hooks/useSwap'
import { useWrapAccountBalance } from 'hooks/useWrapAccountBalance'

import './index.less'

const ReviewSwap = () => {
  const bidAmount = useSelector((state: AppState) => state.swap.bidAmount)
  const askAmount = useSelector((state: AppState) => state.swap.askAmount)
  const bidMint = useSelector((state: AppState) => state.swap.bidMint)
  const loading = useSelector((state: AppState) => state.swap.loading)

  const [visible, setVisible] = useState(false)
  const { route } = useSwap()
  const { balance } = useWrapAccountBalance(bidMint)

  const errorMessage = useMemo(() => {
    if (!Number(bidAmount)) return 'Enter an amount'
    if (balance < Number(bidAmount)) return 'Balance not enough'
    if (!Number(askAmount) || !route.length) return 'Route not found'

    return ''
  }, [askAmount, balance, bidAmount, route.length])

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Button
          type="primary"
          onClick={() => setVisible(true)}
          disabled={!!errorMessage}
          loading={loading && Number(bidAmount) + Number(askAmount) !== 0}
          block
          size="large"
        >
          {!errorMessage ? 'Review' : errorMessage}
        </Button>
      </Col>
      <ConfirmSwap visible={visible} onCancel={() => setVisible(false)} />
    </Row>
  )
}

export default ReviewSwap
