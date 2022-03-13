import { Fragment, useMemo } from 'react'
import { useSelector } from 'react-redux'

import { Divider, Space } from 'antd'
import IonIcon from 'shared/antd/ionicon'

import { AppState } from 'app/model'
import { account } from '@senswap/sen-js'
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
