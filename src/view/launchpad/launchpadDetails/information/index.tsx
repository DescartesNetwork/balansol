import { Card, Tabs } from 'antd'
import LaunchpadInfo from './launchpadInfo'
import ProjectInfo from './projectInfo'

import './index.less'

const Information = ({ launchpadAddress }: { launchpadAddress: string }) => {
  const items = [
    {
      label: 'Launchpad info',
      key: 'launchpad-info"',
      children: <LaunchpadInfo launchpadAddress={launchpadAddress} />,
    },
    {
      label: 'Project info',
      key: 'project-info',
      children: <ProjectInfo launchpadAddress={launchpadAddress} />,
    },
  ]

  return (
    <Card style={{ marginBottom: 24 }}>
      <Tabs items={items} />
    </Card>
  )
}

export default Information
