import { Button, Col, Row } from 'antd'
import { useState } from 'react'
import ConfirmSwap from './confirmSwap'

import './index.less'

const ReviewSwap = () => {
  const [visible, setVisivle] = useState(false)
  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Button
          type="primary"
          onClick={() => setVisivle(true)}
          disabled={false}
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
