import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useMint, useUI } from '@senhub/providers'
import { TokenInfo } from '@solana/spl-token-registry'

import { Card, Space, Typography } from 'antd'

import { AppState } from 'app/model'
import { calcNormalizedWeight } from 'app/helper/oracles'
import { numeric } from 'shared/util'

export type PercentGroupMintsProps = { poolAddress: string }

const PercentGroupMints = ({ poolAddress }: PercentGroupMintsProps) => {
  const {
    pools: { [poolAddress]: poolData },
  } = useSelector((state: AppState) => state)
  const [poolSymbol, setPoolSymbol] = useState<string[]>([])
  const { tokenProvider } = useMint()
  const {
    ui: { theme },
  } = useUI()

  useEffect(() => {
    ;(async () => {
      let poolSymbols = await Promise.all(
        poolData.mints.map(async (mint, index) => {
          const normalizedWeight = calcNormalizedWeight(
            poolData.weights,
            poolData.weights[index],
          )
          const tokenInfo: TokenInfo | undefined =
            await tokenProvider.findByAddress(mint.toBase58())

          return `${numeric(normalizedWeight).format('0,0.[00]%')} ${
            tokenInfo?.symbol
          }`
        }),
      )
      return setPoolSymbol(poolSymbols)
    })()
  }, [poolData.mints, poolData.weights, tokenProvider])

  return (
    <Space size={[16, 8]} align="center" wrap={true}>
      <Typography.Text style={{ whiteSpace: 'nowrap' }}>
        Balansol LP
      </Typography.Text>

      {poolSymbol.map((value) => (
        <Card
          bodyStyle={{ padding: '2px 8px' }}
          style={{
            background: theme === 'dark' ? '#394360' : '#ffffff',
            marginRight: '-8px',
            boxShadow: 'none',
          }}
        >
          <Typography.Text>{value}</Typography.Text>
        </Card>
      ))}
    </Space>
  )
}

export default PercentGroupMints
