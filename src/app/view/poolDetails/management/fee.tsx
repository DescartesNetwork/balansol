import { useState } from 'react'
import { useSelector } from 'react-redux'
import { BN } from '@project-serum/anchor'

import { Col, Row, Typography, Button } from 'antd'
import { PRECISION } from 'app/constant'
import { notifyError, notifySuccess } from 'app/helper'
import { AppState } from 'app/model'
import NumericInput from 'shared/antd/numericInput'

const Content = ({
  title,
  percent,
  currentPercent,
  onChangeValue = () => {},
}: {
  title: string
  percent: number | string
  currentPercent: number
  onChangeValue?: (percent: string) => void
}) => (
  <Row gutter={[8, 8]}>
    <Col span={24}>
      <Row>
        <Col flex="auto">
          <Typography.Text style={{ textTransform: 'capitalize' }}>
            {title} (%)
          </Typography.Text>
        </Col>
        <Col>
          <Typography.Text type="secondary">Current {title}:</Typography.Text>{' '}
          <Typography.Text>{currentPercent}%</Typography.Text>
        </Col>
      </Row>
    </Col>
    <Col span={24} className="fee">
      <NumericInput
        className="fee-input"
        placeholder="0"
        value={percent}
        onValue={(value) => onChangeValue(value)}
      />
    </Col>
  </Row>
)

const Fee = ({ poolAddress }: { poolAddress: string }) => {
  const { pools } = useSelector((state: AppState) => state)
  const poolData = pools[poolAddress]

  const currentFee = Number(poolData.fee) / PRECISION
  const currentTaxFee = Number(poolData.taxFee) / PRECISION
  const [fee, setFee] = useState(currentFee || '')
  const [taxFee, setTaxFee] = useState(currentTaxFee || '')

  const [loading, setLoading] = useState(false)

  const updateFee = async () => {
    setLoading(true)
    try {
      const { updateFee } = window.balansol
      const { txId } = await updateFee(
        poolAddress,
        new BN(Number(fee) * PRECISION),
        new BN(Number(taxFee) * PRECISION),
      )
      return notifySuccess('Fee', txId)
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
          title="fee"
          percent={fee}
          currentPercent={currentFee}
          onChangeValue={(value) => setFee(value)}
        />
      </Col>
      <Col span={24}>
        <Content
          title="tax"
          percent={taxFee}
          currentPercent={currentTaxFee}
          onChangeValue={(value) => setTaxFee(value)}
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
