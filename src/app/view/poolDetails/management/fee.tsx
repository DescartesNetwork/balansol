import { useState } from 'react'
import { useSelector } from 'react-redux'
import { BN } from '@project-serum/anchor'

import { Col, Row, Typography, Button } from 'antd'
import NumericInput from 'shared/antd/numericInput'

import { PRECISION } from 'app/constant'
import { notifyError, notifySuccess } from 'app/helper'
import { AppState } from 'app/model'

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
        onValue={onChangeValue}
      />
    </Col>
  </Row>
)

const Fee = ({ poolAddress }: { poolAddress: string }) => {
  const { pools } = useSelector((state: AppState) => state)
  const poolData = pools[poolAddress]

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
          onChangeValue={setFee}
        />
      </Col>
      <Col span={24}>
        <Content
          title="tax"
          percent={taxFee}
          currentPercent={currentTaxFee}
          onChangeValue={setTaxFee}
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
