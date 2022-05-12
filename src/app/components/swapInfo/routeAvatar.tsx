import { Fragment } from 'react'

import { Divider, Space } from 'antd'
import IonIcon from 'shared/antd/ionicon'
import { MintAvatar } from 'shared/antd/mint'
import PoweredByJupiter from '../poweredByJupiter'

import { SwapPlatform, useSwap } from 'app/hooks/useSwap'

const RouteAvatar = () => {
  const { route, platform } = useSwap()

  const routeMints: string[] = []
  for (const routeElm of route) {
    if (!routeMints.includes(routeElm.bidMint))
      routeMints.push(routeElm.bidMint)
    if (!routeMints.includes(routeElm.askMint))
      routeMints.push(routeElm.askMint)
  }

  return (
    <Space>
      {routeMints.map((mintAddress, i) => (
        <Fragment key={i}>
          {i > 0 && <IonIcon name="chevron-forward-outline" />}
          <MintAvatar mintAddress={mintAddress} />
        </Fragment>
      ))}
      {platform === SwapPlatform.Jupiter && (
        <Fragment>
          <Divider type="vertical" style={{ margin: 0 }} />
          <PoweredByJupiter />
        </Fragment>
      )}
    </Space>
  )
}
export default RouteAvatar
