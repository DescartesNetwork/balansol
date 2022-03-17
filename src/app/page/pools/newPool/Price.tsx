import { useMint } from '@senhub/providers'
import { Typography } from 'antd'
import React, { useCallback, useEffect, useState } from 'react'
import { fetchCGK } from 'shared/util'

const Price = ({ tokenAddress }: { tokenAddress: string }) => {
  const [price, setPrice] = useState(0)
  const { tokenProvider } = useMint()
  const getPrice = useCallback(async () => {
    const token = await tokenProvider.findByAddress(tokenAddress)
    const ticket = token?.extensions?.coingeckoId
    const CGKTokenInfo = await fetchCGK(ticket)
    setPrice(CGKTokenInfo?.price)
  }, [tokenAddress, tokenProvider])
  useEffect(() => {
    getPrice()
  }, [getPrice])
  return <Typography.Text>({price})</Typography.Text>
}

export default Price
