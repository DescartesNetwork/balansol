import { Card, Tabs } from 'antd'
import LaunchpadInfo from './launchpadInfo'
import ProjectInfo from './projectInfo'

import './index.less'

const Information = () => {
  return (
    <Card style={{ marginBottom: 24 }}>
      <Tabs>
        <Tabs.TabPane key="launchpad-info" tab="Launchpad info">
          <LaunchpadInfo />
        </Tabs.TabPane>
        <Tabs.TabPane key="project-info" tab="Project info">
          <ProjectInfo />
        </Tabs.TabPane>
      </Tabs>
    </Card>
  )
}

export default Information
