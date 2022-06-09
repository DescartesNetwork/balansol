import { PoolState } from '@senswap/balancer'

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
        const poolData = listPools[poolAddress]
        let poolState: PoolState = poolData.state
        if (poolState['uninitialized'] || poolState['deleted']) return null
        if (poolData.reserves.map((val) => val.toString()).includes('0'))
          return null

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
