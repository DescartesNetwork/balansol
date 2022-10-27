import { Card, Tabs } from 'antd'
import LaunchpadInfo from './launchpadInfo'
import ProjectInfo from './projectInfo'

import './index.less'

const Information = ({ launchpadAddress }: { launchpadAddress: string }) => {
  return (
    <Card style={{ marginBottom: 24 }}>
      <Tabs>
        <Tabs.TabPane key="launchpad-info" tab="Launchpad info">
          <LaunchpadInfo launchpadAddress={launchpadAddress} />
        </Tabs.TabPane>
        <Tabs.TabPane key="project-info" tab="Project info">
          <ProjectInfo launchpadAddress={launchpadAddress} />
        </Tabs.TabPane>
      </Tabs>
    </Card>
  )
}

export default Information
