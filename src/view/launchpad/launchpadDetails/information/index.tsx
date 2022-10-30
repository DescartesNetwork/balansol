import { useMemo } from 'react'
import { useWalletAddress } from '@sentre/senhub'

import { Card, Tabs } from 'antd'
import LaunchpadInfo from './launchpadInfo'
import Management from './management'
import ProjectInfo from './projectInfo'

import { useLaunchpadData } from 'hooks/launchpad/useLaunchpadData'

import './index.less'

const Information = ({ launchpadAddress }: { launchpadAddress: string }) => {
  const {
    launchpadData: { authority },
  } = useLaunchpadData(launchpadAddress)
  const walletAddress = useWalletAddress()
  const owner = walletAddress === authority.toBase58()

  const tabItem = useMemo(() => {
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
    if (!owner) return items

    items.push({
      label: 'Manage',
      key: 'manage',
      children: <Management launchpadAddress={launchpadAddress} />,
    })

    return items
  }, [launchpadAddress, owner])

  return (
    <Card style={{ marginBottom: 24 }}>
      <Tabs items={tabItem} />
    </Card>
  )
}

export default Information
