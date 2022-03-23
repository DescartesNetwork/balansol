import { Fragment } from 'react'

import { Space } from 'antd'
import IonIcon from 'shared/antd/ionicon'

import { MintAvatar } from 'shared/antd/mint'
import { useRouteSwap } from 'app/hooks/useRouteSwap'

const RouteAvatar = () => {
  const { askMint, bidMint } = useRouteSwap()
  return (
    <Space>
      {[bidMint, askMint]?.map((mintAddress, i) => (
        <Fragment key={i}>
          <MintAvatar mintAddress={mintAddress} />
          {[bidMint, askMint].length > i + 1 && (
            <IonIcon name="chevron-forward-outline" />
          )}
        </Fragment>
      ))}
    </Space>
  )
}
export default RouteAvatar
