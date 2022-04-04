import { Fragment } from 'react'

import { Space } from 'antd'
import IonIcon from 'shared/antd/ionicon'

import { MintAvatar } from 'shared/antd/mint'
import { useRouteSwap } from 'app/hooks/swap/useRouteSwap'

const RouteAvatar = () => {
  const { route } = useRouteSwap()

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
    </Space>
  )
}
export default RouteAvatar
