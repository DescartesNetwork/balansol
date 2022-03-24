import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { Button, Col, Row } from 'antd'
import ConfirmSwap from './confirmSwap'

import { AppState } from 'app/model'

import './index.less'

const ReviewSwap = () => {
  const {
    swap: { bidAmount },
  } = useSelector((state: AppState) => state)

  const [visible, setVisivle] = useState(false)
  const [disable, setDisable] = useState(false)

  useEffect(() => {
    if (!!bidAmount) return setDisable(false)
    setDisable(true)
  }, [bidAmount])

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Button
          type="primary"
          onClick={() => setVisivle(true)}
          disabled={disable}
          style={{
            borderRadius: 40,
            borderColor: 'transparent',
          }}
          block
        >
          Review
        </Button>
      </Col>
      <ConfirmSwap
        visible={visible}
        onCancel={() => {
          setVisivle(false)
        }}
      />
    </Row>
  )
}

export default ReviewSwap
