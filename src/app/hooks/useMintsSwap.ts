import { AppState } from 'app/model'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'

export const useMintsSwap = (): string[] => {
  const { pools } = useSelector((state: AppState) => state)

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
