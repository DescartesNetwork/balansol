import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useMint } from '@senhub/providers'
import { TokenInfo } from '@solana/spl-token-registry'

import { Row, Typography } from 'antd'
import { AppState } from 'app/model'
import { calcNormalizedWeight } from 'app/helper/oracles'
import { numeric } from 'shared/util'

const PercentGroupMints = ({ poolAddress }: { poolAddress: string }) => {
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
      setPoolSymbol(poolSymbols)
    })()
  }, [poolData.mints, poolData.weights, tokenProvider])

  return (
    <Row wrap={false}>
      <Typography.Text style={{ whiteSpace: 'nowrap' }}>
        Balansol LP
      </Typography.Text>

      <Typography.Paragraph
        type="secondary"
        ellipsis={{ rows: 1 }}
        style={{ width: '100%' }}
      >
        &nbsp;{`( ${poolSymbol.join(' - ')} )`}
      </Typography.Paragraph>
    </Row>
  )
}

export default PercentGroupMints
