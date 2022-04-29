import { useMemo } from 'react'
import { useActivePools } from '../pools/useActivePools'

export const useMintsCanSwap = (): string[] => {
  const pools = useActivePools()

  const mintsSwap = useMemo(() => {
    let mintsSwap: string[] = []
    for (const { mints } of Object.values(pools))
      for (const mint of mints)
        if (!mintsSwap.includes(mint.toBase58()))
          mintsSwap.push(mint.toBase58())
    return mintsSwap
  }, [pools])

  return mintsSwap
}
