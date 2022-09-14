import { useCallback, useEffect, useMemo, useState } from 'react'
import { PoolState } from '@senswap/balancer'
import LazyLoad from '@sentre/react-lazyload'

import { Col, Row } from 'antd'
import DetailsCard from './detailsCard'

import { useFilterPools } from 'hooks/pools/useFilterPools'
import { useSearchedPools } from 'hooks/pools/useSearchedPools'
import { useTVL } from 'hooks/useTVL'

const ListPools = () => {
  const { getTVL } = useTVL()
  const { poolsFilter } = useFilterPools()
  const listPools = useSearchedPools(poolsFilter)
  const pools = useMemo(() => Object.keys(listPools), [listPools])
  const [filteredPools, setFilteredPools] = useState(pools)

  const onFilteredPools = useCallback(async () => {
    if (!pools.length) return setFilteredPools(pools)
    const nextPools = await Promise.all(
      Object.keys(listPools).map(async (poolAddress) => {
        const tvl = await getTVL(listPools[poolAddress])
        return {
          poolAddress,
          tvl,
        }
      }),
    )
    nextPools.sort((poolA, poolB) => poolB.tvl - poolA.tvl)
    const result = nextPools.map(({ poolAddress }) => poolAddress)
    return setFilteredPools(result)
  }, [getTVL, listPools, pools])

  useEffect(() => {
    onFilteredPools()
  }, [onFilteredPools])

  return (
    <Row gutter={[24, 24]}>
      {filteredPools.map((poolAddress) => {
        const poolData = listPools[poolAddress]
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
