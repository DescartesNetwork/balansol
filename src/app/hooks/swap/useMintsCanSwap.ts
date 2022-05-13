import { useMemo } from 'react'
import { useBalansolPools } from '../useBalansolPools'

export const useMintsCanSwap = (): string[] => {
  const { activePools } = useBalansolPools()

  const mintsSwap = useMemo(() => {
    let mintsSwap: string[] = []
    for (const { mints } of Object.values(activePools))
      for (const mint of mints)
        if (!mintsSwap.includes(mint.toBase58()))
          mintsSwap.push(mint.toBase58())
    return mintsSwap
  }, [activePools])

  return mintsSwap
}
