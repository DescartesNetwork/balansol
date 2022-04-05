import { Card, Tabs } from 'antd'
import FreezeAndThaw from './freezeAndThaw'
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
        <Tabs.TabPane key="fee" tab="Fee">
          fee
        </Tabs.TabPane>
        <Tabs.TabPane key="transfer-owner" tab="Transfer Owner">
          weight
        </Tabs.TabPane>
      </Tabs>
    </Card>
  )
}

export default PoolManagement
