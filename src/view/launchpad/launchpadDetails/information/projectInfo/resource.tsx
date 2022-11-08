import IonIcon from '@sentre/antd-ionicon'
import { Divider, Space, Typography } from 'antd'
import { validURL } from 'helper'

import { useLaunchpadData } from 'hooks/launchpad/useLaunchpadData'

const Resource = ({ launchpadAddress }: { launchpadAddress: string }) => {
  const { metadata } = useLaunchpadData(launchpadAddress)

  const onRedirect = (url?: string) => {
    if (!url || !validURL(url)) return
    return window.open(url, '_blank')
  }

  return (
    <Space style={{ cursor: 'pointer' }}>
      <Space onClick={() => onRedirect(metadata?.website)}>
        <IonIcon name="globe-outline" />
        <Typography.Text>Website</Typography.Text>
        <Divider
          style={{ borderColor: '#D3D3D6', margin: 2 }}
          type="vertical"
        />
      </Space>
      <Space onClick={() => onRedirect(metadata?.whitepaper)}>
        <IonIcon name="book-outline" />
        <Typography.Text>Whitepaper</Typography.Text>
        <Divider
          style={{ borderColor: '#D3D3D6', margin: 2 }}
          type="vertical"
        />
      </Space>
      <Space onClick={() => onRedirect(metadata?.github)}>
        <IonIcon name="logo-github" />
        <Typography.Text>Github</Typography.Text>
      </Space>
    </Space>
  )
}

export default Resource
