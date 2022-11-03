import { Button, Col, Empty, Row } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

import { useAppRouter } from 'hooks/useAppRouter'

type PageNotFoundProps = {
  label: string
  redirect: string
}

const PageNotFound = ({ label, redirect }: PageNotFoundProps) => {
  const { pushHistory } = useAppRouter()

  return (
    <Row justify="center">
      <Col span={24} style={{ textAlign: 'center' }}>
        <Empty description={`${label} not found`} />
      </Col>
      <Col span={24} style={{ textAlign: 'center' }}>
        <Button
          type="text"
          icon={<IonIcon name="arrow-back-outline" />}
          onClick={() => pushHistory(redirect)}
        >
          Go Back Home
        </Button>
      </Col>
    </Row>
  )
}

export default PageNotFound
