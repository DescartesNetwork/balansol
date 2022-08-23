import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { TokenInfo } from '@solana/spl-token-registry'
import { useMint, useTheme, util } from '@sentre/senhub'

import { Card, Space, Typography } from 'antd'

import { AppState } from 'model'
import { calcNormalizedWeight } from 'helper/oracles'

export type PercentGroupMintsProps = { poolAddress: string }

const PercentGroupMints = ({ poolAddress }: PercentGroupMintsProps) => {
  const poolData = useSelector((state: AppState) => state.pools[poolAddress])
  const [poolSymbol, setPoolSymbol] = useState<string[]>([])
  const { tokenProvider } = useMint()
  const theme = useTheme()

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

          return `${util.numeric(normalizedWeight).format('0,0.[00]%')} ${
            tokenInfo?.symbol || mint.toBase58().substring(0, 4)
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

      {poolSymbol.map((value, idx) => (
        <Card
          bodyStyle={{ padding: '2px 8px' }}
          style={{
            background: theme === 'dark' ? '#394360' : '#ffffff',
            marginRight: '-8px',
            boxShadow: 'none',
          }}
          key={value + idx}
        >
          <Typography.Text>{value}</Typography.Text>
        </Card>
      ))}
    </Space>
  )
}

export default PercentGroupMints
