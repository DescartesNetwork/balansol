import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useMint } from '@senhub/providers'
import { TokenInfo } from '@solana/spl-token-registry'

import { Space, Tooltip, Typography } from 'antd'
import { AppState } from 'app/model'
import { calcNormalizedWeight } from 'app/helper/oracles'
import { numeric } from 'shared/util'

export type PercentGroupMintsProps = { poolAddress: string }

const PercentGroupMints = ({ poolAddress }: PercentGroupMintsProps) => {
  const {
    pools: { [poolAddress]: poolData },
  } = useSelector((state: AppState) => state)
  const { tokenProvider } = useMint()
  const [poolSymbol, setPoolSymbol] = useState<string[]>([])

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
    <Space size={4} align="baseline">
      <Typography.Text style={{ whiteSpace: 'nowrap' }}>
        Balansol LP
      </Typography.Text>

      <Typography.Text
        type="secondary"
        className="ellipsis-text"
        style={{ cursor: 'pointer' }}
      >
        <Tooltip title={poolSymbol.join(' - ')}>
          {`( ${poolSymbol.join(' - ')}`}
        </Tooltip>
      </Typography.Text>
      <Typography.Text type="secondary">)</Typography.Text>
    </Space>
  )
}

export default PercentGroupMints
