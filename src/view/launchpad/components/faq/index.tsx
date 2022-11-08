import { Col, Collapse, Row, Typography } from 'antd'

const { Panel } = Collapse

const CONTENT = [
  {
    question: 'What is special about Liquidity Bootstrapping Pool (LBP)?',
    answer:
      'LBP is one of the uses of Smart Pool in Balancer. It is well suited for projects that want to distribute their tokens to the community in a fair manner. At the same time, creating a high level of liquidity with a low initial cost.',
  },
  {
    question: 'Have any bots front-run?',
    answer:
      'Prevent bot front-run so participants have a higher chance of buying tokens than in other ways.',
  },
  {
    question: 'Do I have to pay any fees to purchase tokens?',
    answer:
      'Yes, it is a tax fee (0.05%). It is the cost to help the development team maintain and stabilize the system.',
  },
  {
    question:
      'What difference between the Token price and the Avg. purchased price?',
    answer:
      'The token price is the price at that time of the project. It will have a quick increase in a short time when buying demand appears and then continue to decrease or move sideways. While the Avg. purchased price is based on the average of all purchased users.',
  },
  {
    question: 'When can I claim the purchased token?',
    answer:
      'The tokens you bought will be locked while the launchpad is active, you can claim your tokens after it ends.',
  },
  {
    question:
      'After the launchpad is completed, what can I do with the purchased tokens?',
    answer:
      'After the launchpad is completed, the launchpad owner will create a pool based on the assets raised, you can deposit to this pool to get the corresponding reward.',
  },
]

const FAQ = () => {
  return (
    <Row justify="center" gutter={[0, 32]}>
      <Col>
        <Typography.Title>FAQ</Typography.Title>
      </Col>
      <Col span={24}>
        <Collapse
          defaultActiveKey={['0']}
          bordered={false}
          expandIconPosition="end"
          ghost
        >
          {CONTENT.map((val, idx) => (
            <Panel
              header={
                <Typography.Text>
                  {`${idx + 1}. ${val.question}`}
                </Typography.Text>
              }
              key={idx}
            >
              <Typography.Text type="secondary">{val.answer}</Typography.Text>
            </Panel>
          ))}
        </Collapse>
      </Col>
    </Row>
  )
}

export default FAQ
