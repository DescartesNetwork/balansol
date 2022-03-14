import React, { Fragment, useState } from 'react'

import { Button, Typography } from 'antd'
import IonIcon from 'shared/antd/ionicon'

export default function WeightControl() {
  const [lock, setLock] = useState(false)
  return (
    <Fragment>
      <Typography.Title level={4}>50%</Typography.Title>
      <Button
        type="text"
        onClick={() => {
          setLock(!lock)
        }}
        shape="circle"
        icon={
          <IonIcon name={lock ? 'lock-closed-outline' : 'lock-open-outline'} />
        }
      />
      <Button
        type="text"
        onClick={() => {}}
        shape="circle"
        icon={<IonIcon name="trash-outline" />}
      />
    </Fragment>
  )
}
