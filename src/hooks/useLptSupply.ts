import { useCallback, useEffect, useState } from 'react'
import { Address, BN, web3 } from '@project-serum/anchor'
import { useGetMintData } from '@sentre/senhub'

export const useLptSupply = (mintLpt: Address) => {
  const [supply, setSupply] = useState<BN>(new BN(0))

  const getMint = useGetMintData()

  const fetchLptSupply = useCallback(async () => {
    if (!mintLpt) return setSupply(new BN(0))
    let address = new web3.PublicKey(mintLpt).toString()
    try {
      const supply = await getMint({ mintAddress: address }).then((data) => {
        if (data) return data[address].supply.toString()
        return ''
      })
      return setSupply(new BN(supply))
    } catch (error) {}
  }, [getMint, mintLpt])

  useEffect(() => {
    fetchLptSupply()
  }, [fetchLptSupply])

  return { supply }
}
