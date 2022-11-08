import { MouseEvent } from 'react'

import IonIcon from '@sentre/antd-ionicon'
import { Avatar, Button, Space, Spin, Typography } from 'antd'
import CategoryTag from 'components/categoryTag'

import { LaunchpadCardProps } from './launchpadCard'
import { useLaunchpadData } from 'hooks/launchpad/useLaunchpadData'
import { getDataWebsite, validURL } from 'helper'

const LaunchpadProfile = ({ launchpadAddress }: LaunchpadCardProps) => {
  const { metadata } = useLaunchpadData(launchpadAddress)
  const onRedirect = (e: MouseEvent<HTMLElement>, url?: string) => {
    e.stopPropagation()
    if (!url || !validURL(url)) return
    return window.open(url, '_blank')
  }

  return (
    <Spin spinning={!metadata}>
      <Space size={24} align="center">
        <Avatar shape="square" size={69} src={metadata?.coverPhoto} />
        <Space size={0} direction="vertical">
          <Typography.Title level={4}>{metadata?.projectName}</Typography.Title>
          <Space size={4} wrap>
            {metadata?.category.map((tag: any) => (
              <CategoryTag key={tag} category={tag} style={{ margin: 0 }} />
            ))}
          </Space>
          {!!metadata?.socials.length && (
            <Space size={2}>
              {metadata?.socials.map((social, index) => {
                const data = getDataWebsite(social)
                return (
                  <Button
                    key={index}
                    type="text"
                    icon={<IonIcon name={data?.iconName} />}
                    onClick={(e) => onRedirect(e, social)}
                  />
                )
              })}
            </Space>
          )}
        </Space>
      </Space>
    </Spin>
  )
}

export default LaunchpadProfile
