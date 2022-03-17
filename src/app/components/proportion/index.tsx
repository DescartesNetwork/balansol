import { TokenInfo } from 'app/page/pools/newPool'
import { Fragment } from 'react'
import { MintAvatar } from 'shared/antd/mint'
import { randomColor } from 'shared/util'

import './index.less'

export default function Proportion({ tokenList }: { tokenList: TokenInfo[] }) {
  const weightTotal = tokenList.reduce(
    (previousSum, currentValue) => previousSum + Number(currentValue.weight),
    0,
  )
  const remainingPortion = 100 - weightTotal
  return (
    <div style={{ display: 'flex' }} className="progress">
      {tokenList.map((value, index) => {
        if (Number(value.weight) !== 0) {
          return (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                width:
                  index !== 1
                    ? `calc(${value.weight}% + 8px)`
                    : `${value.weight}%`,
                background: `${randomColor(value.addressToken, 1)}`,
                height: '8px',
                borderRadius: '20px',
                zIndex: `${index}`,
                marginRight: '-8px',
              }}
            >
              <MintAvatar mintAddress={value.addressToken} />
            </div>
          )
        }
        return <Fragment />
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
