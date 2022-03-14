import { Col, Row } from 'antd'

import DetailsCard from './detailsCard'
import New from './newPool'
import Search from './search'

export default function Pools() {
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
          {[1, 2, 3].map((value) => {
            return (
              <Col span={12}>
                <DetailsCard />
              </Col>
            )
          })}
        </Row>
      </Col>
    </Row>
  )
}
