import { Infix, useInfix } from '@sentre/senhub'
import { Col, Row } from 'antd'

import ListPools from './listPools'
import New from './newPool'
import Search from './search'

const Pools = () => {
  const infix = useInfix()

  const isMobile = infix < Infix.md

  return (
    <Row gutter={[12, 12]} justify="center" align="middle">
      <Col xs={24} md={20} lg={16} xl={12} xxl={8}>
        <Row gutter={[12, 12]} justify="space-between">
          <Col flex="auto">
            <Search />
          </Col>
          <Col span={isMobile ? 24 : undefined}>
            <New />
          </Col>
        </Row>
      </Col>
      <Col span={24} />
      <Col xs={24} md={20} lg={16} xl={12} xxl={8}>
        <ListPools />
      </Col>
      <Col span={24} />
    </Row>
  )
}
export default Pools
