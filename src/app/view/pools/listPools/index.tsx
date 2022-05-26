import { Col, Row } from 'antd'
import { useFilterPools } from 'app/hooks/pools/useFilterPools'
import { useSearchedPools } from 'app/hooks/pools/useSearchedPools'
import DetailsCard from './detailsCard'

const ListPools = () => {
  const { poolsFilter } = useFilterPools()
  const listPools = useSearchedPools(poolsFilter)

  return (
    <Row gutter={[24, 24]}>
      {Object.keys(listPools).map((poolAddress) => {
        let poolState: any = listPools[poolAddress].state
        if (poolState['uninitialized'] || poolState['deleted']) return null
        return (
          <Col xs={24} md={24} key={poolAddress}>
            <DetailsCard poolAddress={poolAddress} />
          </Col>
        )
      })}
    </Row>
  )
}

export default ListPools
