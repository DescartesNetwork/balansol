import { ReactNode } from 'react'
import { useSelector } from 'react-redux'

import { Avatar } from 'antd'
import IonIcon from 'shared/antd/ionicon'
import { MintAvatar } from 'shared/antd/mint'

import { AppState } from 'app/model'

export const PoolAvatar = ({
  poolAddress,
  size = 24,
  icon = <IonIcon name="diamond-outline" />,
}: {
  poolAddress: string
  size?: number
  icon?: ReactNode
}) => {
  const {
    pools: { [poolAddress]: poolData },
  } = useSelector((state: AppState) => state)

  return (
    <Avatar.Group style={{ display: 'block', whiteSpace: 'nowrap' }}>
      {poolData.mints.map((mint) => (
        <MintAvatar mintAddress={mint.toBase58()} size={size} icon={icon} />
      ))}
    </Avatar.Group>
  )
}
