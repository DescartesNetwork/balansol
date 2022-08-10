import { useSelector } from 'react-redux'
import { PoolState } from '@senswap/balancer'

import { Tabs } from 'antd'
import ThawPool from './pool/thawPool'
import FreezePool from './pool/freezePool'
import { FreezeToken } from './freezeToken'

import { AppState } from 'model'

const FreezeAndThaw = ({ poolAddress }: { poolAddress: string }) => {
  const poolData = useSelector((state: AppState) => state.pools[poolAddress])
  const state = poolData.state as PoolState

  return (
    <Tabs className="freeze-thaw" type="card">
      <Tabs.TabPane key="pool" tab="Pool">
        {state['initialized'] && <FreezePool poolAddress={poolAddress} />}
        {state['frozen'] && <ThawPool poolAddress={poolAddress} />}
      </Tabs.TabPane>
      <Tabs.TabPane
        key="individual_token"
        tab="Individual token"
        disabled={!!state['frozen']}
      >
        <FreezeToken poolAddress={poolAddress} />
      </Tabs.TabPane>
    </Tabs>
  )
}

export default FreezeAndThaw
