import { Button, Col, Empty, Row } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

import { useAppRouter } from 'app/hooks/useAppRouter'

const PoolNotFound = () => {
  const { pushHistory } = useAppRouter()

  return (
    <Row justify="center">
      <Col span={24} style={{ textAlign: 'center' }}>
        <Empty description="Pool not found" />
      </Col>
      <Col span={24} style={{ textAlign: 'center' }}>
        <Button
          type="text"
          icon={<IonIcon name="arrow-back-outline" />}
          onClick={() => pushHistory(`/pools`)}
        >
          Go Back Home
        </Button>
      </Col>
    </Row>
  )
}

export default PoolNotFound
