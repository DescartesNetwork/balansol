import { Fragment } from 'react'

import { Space } from 'antd'
import IonIcon from 'shared/antd/ionicon'

import { MintAvatar } from 'shared/antd/mint'

const RouteAvatar = () => {
  return (
    <Space>
      {[]?.map((mintAddress, i) => (
        <Fragment key={i}>
          <MintAvatar mintAddress={mintAddress} />
          {[].length > i + 1 && <IonIcon name="chevron-forward-outline" />}
        </Fragment>
      ))}
    </Space>
  )
}
export default RouteAvatar
