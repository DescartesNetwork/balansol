import { useCallback, useEffect, useMemo, useState } from 'react'
import { PoolState } from '@senswap/balancer'
import LazyLoad from '@sentre/react-lazyload'

import { Col, Row, Spin } from 'antd'
import DetailsCard from './detailsCard'

import { useFilterPools } from 'hooks/pools/useFilterPools'
import { useSearchedPools } from 'hooks/pools/useSearchedPools'
import { useTVL } from 'hooks/useTVL'

const ListPools = () => {
  const { getTVL } = useTVL()
  const { poolsFilter } = useFilterPools()
  const listPools = useSearchedPools(poolsFilter)
  const pools = useMemo(() => Object.keys(listPools), [listPools])
  const [sortedPools, setSortedPools] = useState(pools)
  const [loading, setLoading] = useState(false)

  const onSortedPools = useCallback(async () => {
    try {
      setLoading(true)
      if (!pools.length) return setSortedPools(pools)
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
      return setSortedPools(result)
    } catch (err) {
      return setSortedPools(pools)
    } finally {
      setLoading(false)
    }
  }, [getTVL, listPools, pools])

  useEffect(() => {
    onSortedPools()
  }, [onSortedPools])

  if (loading)
    return (
      <Row justify="center">
        <Spin />
      </Row>
    )

  return (
    <Row gutter={[24, 24]}>
      {sortedPools.map((poolAddress) => {
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
