import { useCallback } from 'react'
import { tokenProvider, util } from '@sentre/senhub'

export const useMintPrice = () => {
  const getTokenPrice = useCallback(async (addressToken: string) => {
    const token = await tokenProvider.findByAddress(addressToken)
    const ticket = token?.extensions?.coingeckoId
    if (!ticket) return 0

    const CGKTokenInfo = await util.fetchCGK(ticket)
    const price = CGKTokenInfo.price
    if (!price) return 0

    return price
  }, [])

  return { getTokenPrice }
}
