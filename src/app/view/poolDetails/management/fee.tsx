import { Col, Row, Typography, Button, Input } from 'antd'

const Content = ({ title, amount }: { title: string; amount: number }) => (
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
          <Typography.Text>{amount}%</Typography.Text>
        </Col>
      </Row>
    </Col>
    <Col span={24} className="fee">
      <Input placeholder={`Input ${title}`} className="fee-input" />
    </Col>
  </Row>
)

const Fee = () => {
  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Content title="fee" amount={0} />
      </Col>
      <Col span={24}>
        <Content title="tax" amount={0} />
      </Col>
      <Col span={24}>
        <Button ghost block size="large">
          Update
        </Button>
      </Col>
    </Row>
  )
}
export default Fee
