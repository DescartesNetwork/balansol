import { Button, Col, Row, Table, Typography } from 'antd'
import { useState } from 'react'

import { DATA, TRANS_HISTORY_COLUMN } from './column'

const ROW_PER_PAGE = 4

const TransHistory = () => {
  const [pageSize, setPageSize] = useState(ROW_PER_PAGE)
  return (
    <Row gutter={[0, 16]}>
      <Col span={24}>
        <Typography.Title level={5}>Recent transactions</Typography.Title>
      </Col>
      <Col span={24}>
        <Table
          columns={TRANS_HISTORY_COLUMN}
          dataSource={DATA.slice(0, pageSize)}
          rowKey={(record) => record.index}
          pagination={false}
          rowClassName={(_, index) => (index % 2 ? 'odd-row' : 'even-row')}
        />
      </Col>
      <Col span={24} style={{ textAlign: 'center' }}>
        <Button
          disabled={pageSize >= DATA.length}
          onClick={() => setPageSize(pageSize + ROW_PER_PAGE)}
          ghost
        >
          View more
        </Button>
      </Col>
    </Row>
  )
}

export default TransHistory
