import { ReactNode, CSSProperties } from 'react'
import { PoolData } from '@senswap/sen-js'
import { useSelector } from 'react-redux'
import { util } from '@sentre/senhub'

import { Col, Row, Skeleton, Typography } from 'antd'
import RouteAvatar from './routeAvatar'
import SpotPrice from './spotPrice'

import { AppState } from 'model'
import { priceImpactColor } from 'helper'
import { useSwap } from 'hooks/useSwap'

export type LiteMintInfo = {
  address: string
  decimals: number
}

export type HopData = {
  poolData: PoolData & { address: string }
  srcMintAddress: string
  dstMintAddress: string
}

type ExtraTypographyProps = {
  label?: string
  content?: string | ReactNode
  loading?: boolean
}

const ExtraTypography = ({
  label = '',
  content = '',
  loading = false,
}: ExtraTypographyProps) => {
  return (
    <Row align="middle" style={{ width: '100%' }}>
      <Col flex="auto" style={{ justifyContent: 'left' }}>
        <Typography.Text type="secondary">{label}</Typography.Text>
      </Col>
      <Col>
        {loading ? (
          <Skeleton.Input style={{ width: 150 }} active size="small" />
        ) : (
          <span>{content}</span>
        )}
      </Col>
    </Row>
  )
}

const SwapInfo = ({ extraStyle }: { extraStyle?: CSSProperties }) => {
  const slippageTolerance = useSelector(
    (state: AppState) => state.swap.slippageTolerance,
  )
  const { priceImpact } = useSwap()

  const priceImpactDisplay = util.numeric(priceImpact).format('0.[0000]')

  return (
    <Row gutter={[12, 12]} style={{ ...extraStyle }}>
      <Col span={24}>
        <ExtraTypography
          label="Price impact"
          content={
            <Typography.Text style={{ color: priceImpactColor(priceImpact) }}>
              {Number(priceImpactDisplay) > 0
                ? util.numeric(priceImpactDisplay).format('0.[0000]%')
                : '~ 0%'}
            </Typography.Text>
          }
          loading={false}
        />
      </Col>
      <Col span={24}>
        <ExtraTypography
          label="Price"
          content={<SpotPrice />}
          loading={false}
        />
      </Col>
      <Col span={24}>
        <ExtraTypography
          label="Slippage Tolerance"
          content={`${slippageTolerance}%`}
          loading={false}
        />
      </Col>
      <Col span={24} style={{ minHeight: 24 }}>
        <ExtraTypography
          label="Route"
          content={<RouteAvatar />}
          loading={false}
        />
      </Col>
    </Row>
  )
}

export default SwapInfo
