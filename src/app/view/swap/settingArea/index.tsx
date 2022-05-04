import React from 'react'

import { Button, Divider, Popover, Space } from 'antd'
import IonIcon from 'shared/antd/ionicon'
import PoweredBySentre from './poweredBySentre'
import Setting from './setting'

const SettingArea = () => {
  return (
    <Space>
      <PoweredBySentre />
      <Divider
        type="vertical"
        style={{ border: '1px solid #394360', padding: 0, margin: 0 }}
      />
      <Popover
        placement="bottomRight"
        content={<Setting />}
        trigger="click"
        overlayClassName="slippage"
        overlayInnerStyle={{ borderRadius: 24 }}
      >
        <Button
          type="text"
          shape="circle"
          size="large"
          icon={<IonIcon name="cog-outline" style={{ color: '#ffffff' }} />}
          style={{ background: 'transparent', width: 'unset' }}
        />
      </Popover>
    </Space>
  )
}

export default SettingArea
