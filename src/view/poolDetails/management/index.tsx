import { Card, Tabs } from 'antd'
import Fee from './fee'
import FreezeAndThaw from './freezeAndThaw'
import TransferOwner from './transferOwner'
import Weight from './weight'

import './index.less'

const PoolManagement = ({ poolAddress }: { poolAddress: string }) => {
  return (
    <Card>
      <Tabs>
        <Tabs.TabPane key="weights" tab="Weights">
          <Weight poolAddress={poolAddress} />
        </Tabs.TabPane>
        <Tabs.TabPane key="freeze-thaw" tab="Freeze/Unfreeze">
          <FreezeAndThaw poolAddress={poolAddress} />
        </Tabs.TabPane>
        <Tabs.TabPane key="fee" tab="Fee">
          <Fee poolAddress={poolAddress} />
        </Tabs.TabPane>
        <Tabs.TabPane key="transfer-ownership" tab="Transfer Ownership">
          <TransferOwner poolAddress={poolAddress} />
        </Tabs.TabPane>
      </Tabs>
    </Card>
  )
}

export default PoolManagement
