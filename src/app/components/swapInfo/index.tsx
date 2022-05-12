import { ReactNode, CSSProperties } from 'react'
import { PoolData } from '@senswap/sen-js'
import { useSelector } from 'react-redux'

import { Col, Row, Skeleton, Typography } from 'antd'
import RouteAvatar from './routeAvatar'
import SpotPrice from './spotPrice'

import { numeric } from 'shared/util'
import { AppState } from 'app/model'
import { priceImpactColor } from 'app/helper'
import { useSwap } from 'app/hooks/useSwap'

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
  const {
    swap: { slippageTolerance },
  } = useSelector((state: AppState) => state)
  const { priceImpact } = useSwap()

  return (
    <Row gutter={[12, 12]} style={{ ...extraStyle }}>
      <Col span={24}>
        <ExtraTypography
          label="Price impact"
          content={
            <Typography.Text style={{ color: priceImpactColor(priceImpact) }}>
              {numeric(priceImpact / 100).format('0.[0000]%')}
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
