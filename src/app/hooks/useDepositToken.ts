// import { useCallback, useEffect, useState } from 'react'
// import { useSelector } from 'react-redux'

// import {
//   calcOutGivenInSwap,
//   calcSpotPrice,
//   getMintInfo,
// } from 'app/helper/oracles'
// import { AppState } from 'app/model'
// import { useOracles } from './useOracles'
// import { BN } from '@project-serum/anchor'

// type DepositImpact = {
//   Lp: string
//   priceImpact: number
// }

// export const useDepositToken = () => {
//   const {
//     deposits: { poolAddress, depositInfo: depositState },
//     pools,
//   } = useSelector((state: AppState) => state)
//   const [depositInfo, setDepositInfo] = useState<DepositImpact>({
//     Lp: '',
//     priceImpact: 0,
//   })
//   const { decimalizeMintAmount, undecimalizeMintAmount } = useOracles()

//   const findRoute = useCallback(async () => {
//     let newDepositImpact = {
//       Lp: '',
//       priceImpact: 0,
//     }

//     if (!poolAddress || !depositInfo) return setDepositInfo(newDepositImpact)

//     const poolData = pools[poolAddress]

//     for (const pool in pools) {

//         const beforeSpotPrice = calcSpotPrice(
//           poolData.reserve,
//           bidMintInfo.normalizedWeight,
//           askMintInfo.reserve,
//           askMintInfo.normalizedWeight,
//         )
//         const afterSpotPrice = calcSpotPrice(
//           new BN(bidMintInfo.reserve.toNumber() + bidAmountBN.toNumber()),
//           bidMintInfo.normalizedWeight,
//           new BN(askMintInfo.reserve.toNumber() - tokenOutAmount.toNumber()),
//           askMintInfo.normalizedWeight,
//         )
//         const priceImpact = (afterSpotPrice - beforeSpotPrice) / beforeSpotPrice
//       }
//     }
//     setBestRoute(newRoute)
//   }, [
//     askMint,
//     bidAmount,
//     bidMint,
//     decimalizeMintAmount,
//     pools,
//     undecimalizeMintAmount,
//   ])

//   useEffect(() => {
//     findRoute()
//   }, [findRoute])

//   return { ...bestRoute }
// }
