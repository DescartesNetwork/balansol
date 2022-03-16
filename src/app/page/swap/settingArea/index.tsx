import React from 'react'

import { Button, Col, Divider, Popover, Row, Space, Typography } from 'antd'
import IonIcon from 'shared/antd/ionicon'
import PoweredBySentre from './poweredBySentre'

export default function SettingArea() {
  return (
    <Space>
      <PoweredBySentre />
      <Divider type="vertical" style={{ padding: 0 }} />
      <Popover
        placement="bottomRight"
        overlayInnerStyle={{ width: 300 }}
        content={
          <Row gutter={[8, 8]}>
            <Col span={24}>
              <Typography.Title level={5}>Settings</Typography.Title>
            </Col>
          </Row>
        }
        trigger="click"
      >
        <Button
          type="text"
          shape="circle"
          size="small"
          icon={<IonIcon name="cog-outline" />}
        />
      </Popover>
    </Space>
  )
}
