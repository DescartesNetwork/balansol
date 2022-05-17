import React from 'react'

import { Button, Divider, Popover, Space } from 'antd'
import IonIcon from 'shared/antd/ionicon'
import PoweredBySentre from './poweredBySentre'
import Setting from './setting'

const SettingArea = () => {
  return (
    <Space>
      <PoweredBySentre />
      <Divider type="vertical" />
      <Popover
        placement="bottomRight"
        content={<Setting />}
        trigger="click"
        overlayClassName="slippage"
        overlayInnerStyle={{ borderRadius: 24 }}
      >
        <Button
          style={{ marginRight: -7 }}
          type="text"
          icon={<IonIcon name="cog-outline" />}
        />
      </Popover>
    </Space>
  )
}

export default SettingArea
