import { Fragment } from 'react'
import { useSelector } from 'react-redux'

import { Row, Typography } from 'antd'
import { MintSymbol } from 'shared/antd/mint'
import { AppState } from 'app/model'
import { calcNormalizedWeight } from 'app/helper/oracles'

const PercentGroupMints = ({ poolAddress }: { poolAddress: string }) => {
  const {
    pools: { [poolAddress]: poolData },
  } = useSelector((state: AppState) => state)
  return (
    <Row wrap={false}>
      <Typography.Text style={{ whiteSpace: 'nowrap' }}>
        Balansol LP
      </Typography.Text>

      <Typography.Paragraph
        type="secondary"
        ellipsis={{ rows: 1, suffix: ' )' }}
        style={{ width: '100%' }}
      >
        &nbsp;{'( '}
        {poolData.mints.map((mint, index) => {
          let mintAddress: string = mint.toBase58()
          const normalizedWeight = calcNormalizedWeight(
            poolData.weights,
            poolData.weights[index],
          )
          return (
            <Fragment>
              {normalizedWeight * 100 + '% '}
              <MintSymbol mintAddress={mintAddress || ''} />
              {index < poolData.mints.length - 1 ? '- ' : null}
            </Fragment>
          )
        })}
      </Typography.Paragraph>
    </Row>
  )
}

export default PercentGroupMints
