import { Fragment } from 'react'
import { PoolState } from '@senswap/balancer'
import LazyLoad from '@sentre/react-lazyload'

import { Col, Row } from 'antd'
import DetailsCard from './detailsCard'

import { useFilterPools } from 'hooks/pools/useFilterPools'
import { useSearchedPools } from 'hooks/pools/useSearchedPools'

const ListPools = () => {
  const { poolsFilter } = useFilterPools()
  const listPools = useSearchedPools(poolsFilter)

  return (
    <Row gutter={[24, 24]}>
      {Object.keys(listPools).map((poolAddress) => {
        const poolData = listPools[poolAddress]
        if (!poolData) return <Fragment />
        let poolState: PoolState = poolData.state
        if (poolState['uninitialized'] || poolState['deleted']) return null
        if (poolData.reserves.map((val) => val.toString()).includes('0'))
          return null

        return (
          <Col xs={24} md={24} key={poolAddress}>
            <LazyLoad height={198}>
              <DetailsCard poolAddress={poolAddress} />
            </LazyLoad>
          </Col>
        )
      })}
    </Row>
  )
}

export default ListPools
