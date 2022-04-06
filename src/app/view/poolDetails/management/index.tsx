import { Card, Tabs } from 'antd'
import FreezeAndThaw from './freezeAndThaw'
import TransferOwner from './transferOwner'
import Weight from './weight'

const PoolManagement = ({ poolAddress }: { poolAddress: string }) => {
  return (
    <Card>
      <Tabs>
        <Tabs.TabPane key="weight" tab="Weight">
          <Weight poolAddress={poolAddress} />
        </Tabs.TabPane>
        <Tabs.TabPane key="freeze-thaw" tab="Freeze/Thaw">
          <FreezeAndThaw poolAddress={poolAddress} />
        </Tabs.TabPane>
        <Tabs.TabPane key="transfer-owner" tab="Transfer Owner">
          <TransferOwner poolAddress={poolAddress} />
        </Tabs.TabPane>
      </Tabs>
    </Card>
  )
}

export default PoolManagement
