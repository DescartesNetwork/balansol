import React from 'react'

import { Button, Divider, Popover, Space } from 'antd'
import IonIcon from 'shared/antd/ionicon'
import PoweredBySentre from './poweredBySentre'
import Setting from './setting'

export default function SettingArea() {
  return (
    <Space>
      <PoweredBySentre />
      <Divider type="vertical" style={{ padding: 0, margin: 0 }} />
      <Popover
        placement="bottomRight"
        overlayInnerStyle={{ width: 300 }}
        content={<Setting />}
        trigger="click"
      >
        <Button
          type="text"
          shape="circle"
          size="large"
          icon={<IonIcon name="cog-outline" style={{ color: '#ffffff' }} />}
          style={{ background: 'transparent' }}
        />
      </Popover>
    </Space>
  )
}
