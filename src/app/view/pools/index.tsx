import { Col, Row } from 'antd'
import { AppState } from 'app/model'
import { useSelector } from 'react-redux'

import DetailsCard from './detailsCard'
import New from './newPool'
import Search from './search'

const Pools = () => {
  const { pools } = useSelector((state: AppState) => state)

  return (
    <Row gutter={[24, 24]} justify="center" align="middle">
      <Col xs={24} md={20} lg={16}>
        <Row gutter={12}>
          <Col span={24}>
            <Row
              gutter={[24, 24]}
              align={'middle'}
              justify="end"
              className="chart-title"
            >
              <Col xs={24} md={12}>
                <Search />
              </Col>
              <Col xs={24} md={12}>
                <Row justify={'end'}>
                  <Col xs={24} md={8}>
                    <New />
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
      <Col xs={24} md={20} lg={16}>
        <Row gutter={[24, 24]}>
          {Object.keys(pools).map((poolAddress) => {
            return (
              <Col xs={24} md={12} key={poolAddress}>
                <DetailsCard poolAddress={poolAddress} />
              </Col>
            )
          })}
        </Row>
      </Col>
    </Row>
  )
}
export default Pools
