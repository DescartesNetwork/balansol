import { useMint } from '@senhub/providers'
import { TokenInfo } from '@solana/spl-token-registry'
import { Avatar } from 'antd'
import { AppState } from 'app/model'
import { ReactNode, useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import IonIcon from 'shared/antd/ionicon'

export const PoolAvatar = ({
  poolAddress,
  size = 24,
  icon = <IonIcon name="diamond-outline" />,
}: {
  poolAddress: string
  size?: number
  icon?: ReactNode
}) => {
  const [tokensInfo, setTokensInfo] = useState<(TokenInfo | undefined)[]>([])
  const {
    pools: { [poolAddress]: poolData },
  } = useSelector((state: AppState) => state)
  const { tokenProvider } = useMint()

  const getTokenInfos = useCallback(async () => {
    const newTokensInfo = await Promise.all(
      poolData.mints.map((mint) =>
        tokenProvider.findByAddress(mint.toBase58()),
      ),
    )
    setTokensInfo(newTokensInfo)
  }, [poolData.mints, tokenProvider])

  useEffect(() => {
    getTokenInfos()
  }, [getTokenInfos])

  return (
    <Avatar.Group style={{ display: 'block', whiteSpace: 'nowrap' }}>
      {tokensInfo.map((token, i) => (
        <Avatar
          key={token?.address || i}
          src={token?.logoURI}
          size={size}
          style={{ backgroundColor: '#2D3355', border: 'none' }}
        >
          {icon}
        </Avatar>
      ))}
    </Avatar.Group>
  )
}
