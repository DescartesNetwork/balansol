import { useCallback, useEffect, useState } from 'react'
import { Address, BN } from '@project-serum/anchor'

import { useOracles } from 'app/hooks/useOracles'

const MintAmount = ({
  mintAddress,
  amount,
}: {
  mintAddress: Address
  amount: BN
}) => {
  const [amountUI, setAmountUI] = useState('0')
  const { undecimalizeMintAmount } = useOracles()

  const decimalizeAmount = useCallback(async () => {
    const newAmountUI = await undecimalizeMintAmount(amount, mintAddress)
    setAmountUI(newAmountUI)
  }, [amount, mintAddress, undecimalizeMintAmount])

  useEffect(() => {
    decimalizeAmount()
  }, [decimalizeAmount])

  return <span>{amountUI}</span>
}

export default MintAmount
