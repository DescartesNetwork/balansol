import { useCallback } from 'react'

import { useMint } from '@senhub/providers'
import { fetchCGK } from 'shared/util'

export const useMintPrice = () => {
  const { tokenProvider } = useMint()

  const getTokenPrice = useCallback(
    async (addressToken: string) => {
      const token = await tokenProvider.findByAddress(addressToken)
      const ticket = token?.extensions?.coingeckoId
      if (!ticket) return 0

      const CGKTokenInfo = await fetchCGK(ticket)
      const price = CGKTokenInfo.price
      if (!price) return 0

      return price
    },
    [tokenProvider],
  )

  return { getTokenPrice }
}
