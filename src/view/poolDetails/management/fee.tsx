import { useState } from 'react'
import { useSelector } from 'react-redux'
import { BN } from '@coral-xyz/anchor'
import IonIcon from '@sentre/antd-ionicon'

import { Col, Row, Typography, Button, Tooltip, Space } from 'antd'
import NumericInput, { InputStyle } from 'components/numericInput'

import { PRECISION } from 'constant'
import { notifyError, notifySuccess } from 'helper'
import { AppState } from 'model'
import config from 'configs'

const {
  sol: { taxmanAddress },
} = config

const Content = ({
  title,
  percent,
  currentPercent,
  onChangeValue = () => {},
  tooltipContent,
  disabled,
}: {
  title: string
  percent: number | string
  currentPercent: number
  onChangeValue?: (percent: string) => void
  tooltipContent: string
  disabled?: boolean
}) => (
  <Row gutter={[8, 8]}>
    <Col span={24}>
      <Row>
        <Col flex="auto">
          <Space size={8}>
            <Typography.Text style={{ textTransform: 'capitalize' }}>
              {title} (%)
            </Typography.Text>
            <Tooltip title={tooltipContent}>
              <IonIcon name="information-circle-outline" />
            </Tooltip>
          </Space>
        </Col>
        <Col>
          <Typography.Text type="secondary">Current {title}:</Typography.Text>{' '}
          <Typography.Text>{currentPercent}%</Typography.Text>
        </Col>
      </Row>
    </Col>
    <Col span={24} className="fee">
      <NumericInput
        bordered={false}
        inputStyle={InputStyle.InputLeft}
        placeholder="0"
        controls={false}
        value={percent}
        styles={{ fontSize: 14 }}
        onValue={onChangeValue}
        disabled={disabled}
      />
    </Col>
  </Row>
)

const Fee = ({ poolAddress }: { poolAddress: string }) => {
  const poolData = useSelector((state: AppState) => state.pools[poolAddress])

  const currentFee = (poolData.fee.toNumber() * 100) / PRECISION
  const currentTaxFee = (poolData.taxFee.toNumber() * 100) / PRECISION

  const [fee, setFee] = useState<string>(currentFee.toString())
  const [taxFee, setTaxFee] = useState<string>(currentTaxFee.toString())

  const [loading, setLoading] = useState(false)

  const updateFee = async () => {
    setLoading(true)
    try {
      const { updateFee } = window.balansol
      const { txId } = await updateFee(
        poolAddress,
        new BN((Number(fee) * PRECISION) / 100),
        new BN((Number(taxFee) * PRECISION) / 100),
      )
      return notifySuccess('Update Fee', txId)
    } catch (err) {
      notifyError(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Content
          title="LP Reward Rate"
          percent={fee}
          currentPercent={currentFee}
          onChangeValue={setFee}
          tooltipContent={
            'The portion of trading fee a liquidity provider earns upon depositing into the pool'
          }
        />
      </Col>
      <Col span={24}>
        <Content
          title="Platform Fee"
          percent={taxFee}
          currentPercent={currentTaxFee}
          onChangeValue={setTaxFee}
          tooltipContent={
            'The portion of fee your pool will pay to Balansol for maintaining the system'
          }
          disabled={poolData.authority.toBase58() !== taxmanAddress}
        />
      </Col>
      <Col span={24}>
        <Button ghost block size="large" loading={loading} onClick={updateFee}>
          Update
        </Button>
      </Col>
    </Row>
  )
}
export default Fee
