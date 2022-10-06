import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { PoolState } from '@senswap/balancer'
import LazyLoad from '@sentre/react-lazyload'

import { Col, Row, Spin } from 'antd'
import DetailsCard from './detailsCard'

import { useFilterPools } from 'hooks/pools/useFilterPools'
import { useSearchedPools } from 'hooks/pools/useSearchedPools'
import { fetchServerTVL } from 'helper'
import { notifyError } from '@sen-use/app/dist'

const ListPools = () => {
  const [loading, setLoading] = useState(false)
  const [tvls, setTVLs] = useState<Record<string, number>>({})
  const { poolsFilter } = useFilterPools()
  const listPool = useSearchedPools(poolsFilter)
  const sortPool = useMemo(
    () => Object.keys(listPool).sort((a, b) => (tvls[b] || 0) - (tvls[a] || 0)),
    [listPool, tvls],
  )

  const fetchTVL = useCallback(async () => {
    try {
      setLoading(true)
      const poolTVLs: { address: string; tvl: number }[] =
        await fetchServerTVL()
      const newTVLs: Record<string, number> = {}
      for (const { address, tvl } of poolTVLs) newTVLs[address] = tvl

      setTVLs(newTVLs)
    } catch (err) {
      notifyError(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTVL()
  }, [fetchTVL])

  if (loading)
    return (
      <Row justify="center">
        <Col>
          <Spin />
        </Col>
      </Row>
    )

  return (
    <Row gutter={[24, 24]}>
      {sortPool.map((poolAddress) => {
        const poolData = listPool[poolAddress]
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
