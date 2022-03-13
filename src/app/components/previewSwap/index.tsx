import { ReactNode, CSSProperties } from 'react'
import { useSelector } from 'react-redux'
import { PoolData } from '@senswap/sen-js'

import { Col, Row, Skeleton, Typography } from 'antd'
import RouteAvatar from './routeAvatar'

import { AppState } from 'app/model'
import { numeric } from 'shared/util'
import Price from './price'
// import { priceImpactColor } from 'app/helper/utils'

export type LiteMintInfo = {
  address: string
  decimals: number
}

export type HopData = {
  poolData: PoolData & { address: string }
  srcMintAddress: string
  dstMintAddress: string
}

const ExtraTypography = ({
  label = '',
  content = '',
  loading = false,
}: {
  label?: string
  content?: string | ReactNode
  loading?: boolean
}) => {
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

const PreviewSwap = ({ extraStyle }: { extraStyle?: CSSProperties }) => {
  return (
    <Row gutter={[12, 12]} style={{ ...extraStyle }}>
      <Col span={24}>
        <ExtraTypography
          label="Price impact"
          content={
            <Typography.Text style={{ color: 'red' }}>
              {numeric(Number('1111')).format('0.[0000]%')}
            </Typography.Text>
          }
          loading={false}
        />
      </Col>
      <Col span={24}>
        <ExtraTypography label="Price" content={<Price />} loading={false} />
      </Col>
      <Col span={24}>
        <ExtraTypography
          label="Slippage Tolerance"
          content={numeric('11').format('0.[00]%')}
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

export default PreviewSwap
