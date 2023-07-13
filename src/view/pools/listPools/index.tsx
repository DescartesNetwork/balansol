import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { PoolState } from '@senswap/balancer'
import LazyLoad from '@sentre/react-lazyload'
import { notifyError } from '@sen-use/app'

import { Col, Row, Spin } from 'antd'
import DetailsCard from './detailsCard'

import { useFilterPools } from 'hooks/pools/useFilterPools'
import { useSearchedPools } from 'hooks/pools/useSearchedPools'
import { fetchServerTVL } from 'helper'

const PRIORITIZE_POOL = [
  'CT2QmamF6kBBDVbkg8WkvF5gnq6q8mDranPi21tdGeeL',
  '4JFd9kHUC4FoKaTL38YMGoXP68MNBT9sC1FZCmfMn1FC',
  'AzPdQteHNWLvgRtFQX2N9K2U14M7rwub4VjEeKhaSbuh',
  '2gtDG2iYam6z4eCjx9yfBD7ayRXQGTDymjqQLiHqr7Z6',
  'FhownP7d2EP7PCeoXVFk11WennsSaCoj4sZaQCEpvC89',
  '13Jn5xugRGjVorHWakzjvdZBMFwPLQniKHRoE6j4BMCC',
  'kPbhNnVmuhqWApxhr156XQV8hhKsysrvwVFmDhCWFY5',
]

const ListPools = () => {
  const [loading, setLoading] = useState(true)
  const [tvls, setTVLs] = useState<Record<string, number>>({})
  const { poolsFilter } = useFilterPools()
  const listPool = useSearchedPools(poolsFilter)

  const sortedPool = useMemo(() => {
    const sorted = Object.keys(listPool).sort(
      (a, b) => (tvls[b] || 0) - (tvls[a] || 0),
    )
    const filtered = new Set(PRIORITIZE_POOL.filter((addr) => listPool[addr]))
    for (const elm of sorted) filtered.add(elm)
    return Array.from(filtered)
  }, [listPool, tvls])

  const fetchTVL = useCallback(async () => {
    try {
      setLoading(true)
      const poolTVLs = await fetchServerTVL()
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
      {sortedPool.map((poolAddress) => {
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
