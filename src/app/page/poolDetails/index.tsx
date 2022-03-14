import { Col, Row } from 'antd'
import Deposit from './deposit'
import Withdraw from './withdraw'

import { useAppRouter } from 'app/hooks/useAppRoute'

const PoolDetails = () => {
  const { getQuery } = useAppRouter()
  const poolAddress = getQuery('pool')

  if (!poolAddress) return null
  return (
    <Row gutter={[24, 24]} justify="center">
      <Col>
        <Deposit poolAddress={poolAddress} />
        <Withdraw poolAddress={poolAddress} />
      </Col>
    </Row>
  )
}
export default PoolDetails
