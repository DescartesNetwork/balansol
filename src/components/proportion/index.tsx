import { MintAvatar } from '@sen-use/components'
import { util } from '@sentre/senhub'

import { TokenInfo } from 'view/swapAndPools/pools/newPool'

export default function Proportion({ tokenList }: { tokenList: TokenInfo[] }) {
  const weightTotal = tokenList.reduce(
    (previousSum, currentValue) => previousSum + Number(currentValue.weight),
    0,
  )

  const remainingPortion = 100 - weightTotal

  return (
    <div style={{ display: 'flex', marginTop: 8 }}>
      {tokenList.map((value, index) => {
        if (Number(value.weight) === 0) return null
        return (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              width:
                index !== 1
                  ? `calc(${value.weight}% + 8px)`
                  : `${value.weight}%`,
              background: `${util.randomColor(value.addressToken || '_', 1)}`,
              height: '8px',
              borderRadius: '20px',
              zIndex: `${index}`,
              marginRight: '-8px',
              alignItems: 'center',
            }}
            key={`${value.addressToken}${index}`}
          >
            <MintAvatar mintAddress={value.addressToken} />
          </div>
        )
      })}
      <div
        style={{
          width: `${remainingPortion}%`,
          background: '#142042',
          borderRadius: '20px',
        }}
      ></div>
    </div>
  )
}
