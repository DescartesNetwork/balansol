import { useCallback } from 'react'

export const useGetWeight = () => {
  const getWeight = useCallback(() => {
    const toke_a = 0.3
    const balance_a = 1_000_000
    const toke_b = 1
    const balance_b = 1_000_000

    const total = toke_a * balance_a + toke_b * balance_b

    const weight_a = (toke_a * balance_a) / total
    const weight_b = (toke_b * balance_b) / total

    return { weight_a, weight_b }
  }, [])

  return getWeight
}
