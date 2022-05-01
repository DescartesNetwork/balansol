import { Button, Col, Row, Typography } from 'antd'
import IonIcon from 'shared/antd/ionicon'

import { useAppRouter } from 'app/hooks/useAppRouter'

const PoolNotFound = () => {
  const { pushHistory } = useAppRouter()

  return (
    <Row justify="center">
      <Col span={24} style={{ textAlign: 'center' }}>
        <Typography.Title>Not found!!!</Typography.Title>
      </Col>
      <Col span={24} style={{ textAlign: 'center' }}>
        <Button
          type="text"
          icon={<IonIcon name="arrow-back-outline" />}
          onClick={() => pushHistory(`/?tab=pools`)}
        >
          Go Back Home
        </Button>
      </Col>
    </Row>
  )
}

export default PoolNotFound
