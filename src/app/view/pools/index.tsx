import { Col, Row } from 'antd'
import { AppState } from 'app/model'
import { useSelector } from 'react-redux'

import DetailsCard from './detailsCard'
import New from './newPool'
import Search from './search'

export default function Pools() {
  const { pools } = useSelector((state: AppState) => state)

  return (
    <Row gutter={[24, 24]} justify="center" align="middle">
      <Col span={16}>
        <Row justify="center" gutter={12}>
          <Col flex="auto">
            <Search />
          </Col>
          <Col>
            <New />
          </Col>
        </Row>
      </Col>
      <Col span={16}>
        <Row gutter={[24, 24]}>
          {Object.keys(pools).map((poolAddress) => {
            return (
              <Col span={12} key={poolAddress}>
                <DetailsCard poolAddress={poolAddress} />
              </Col>
            )
          })}
        </Row>
      </Col>
    </Row>
  )
}
