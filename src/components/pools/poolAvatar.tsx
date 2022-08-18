import { ReactNode } from 'react'
import { useSelector } from 'react-redux'

import { Avatar } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

import { MintAvatar } from '@sen-use/app'

import { AppState } from 'model'

type PoolAvatarProps = {
  poolAddress: string
  size?: number
  icon?: ReactNode
}

export const PoolAvatar = ({
  poolAddress,
  size = 24,
  icon = <IonIcon name="diamond-outline" />,
}: PoolAvatarProps) => {
  const poolData = useSelector((state: AppState) => state.pools[poolAddress])

  return (
    <Avatar.Group style={{ display: 'block', whiteSpace: 'nowrap' }}>
      {poolData &&
        poolData.mints.map((mint) => (
          <MintAvatar
            mintAddress={mint.toBase58()}
            size={size}
            icon={icon}
            key={mint.toBase58()}
          />
        ))}
    </Avatar.Group>
  )
}
