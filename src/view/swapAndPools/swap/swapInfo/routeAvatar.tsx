import { Fragment } from 'react'

import { Divider, Space } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import { MintAvatar } from 'shared/antd/mint'
import PoweredByJupiter from '../../../../components/poweredByJupiter'

import { SwapPlatform, useSwap } from 'hooks/useSwap'

const RouteAvatar = () => {
  const { route, platform } = useSwap()

  const routeMints: string[] = []
  route.forEach((routeElm, idx) => {
    if (idx === 0) routeMints.push(routeElm.bidMint)
    routeMints.push(routeElm.askMint)
  })

  return (
    <Space>
      {routeMints.map((mintAddress, i) => (
        <Fragment key={i}>
          {i > 0 && <IonIcon name="chevron-forward-outline" />}
          <MintAvatar mintAddress={mintAddress} />
        </Fragment>
      ))}
      {!!route.length && platform === SwapPlatform.Jupiter && (
        <Fragment>
          <Divider type="vertical" style={{ margin: 0 }} />
          <PoweredByJupiter />
        </Fragment>
      )}
      {!route.length && <Fragment>--</Fragment>}
    </Space>
  )
}
export default RouteAvatar
