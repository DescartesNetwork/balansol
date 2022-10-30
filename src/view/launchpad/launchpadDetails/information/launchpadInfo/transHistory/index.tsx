import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import { Button, Col, Row, Table, Typography } from 'antd'

import { TRANS_HISTORY_COLUMN } from './column'
import { useCheques } from 'hooks/launchpad/useCheques'
import { AppState } from 'model'

const ROW_PER_PAGE = 4

type TransHistoryProps = {
  launchpadAddress: string
}

const TransHistory = ({ launchpadAddress }: TransHistoryProps) => {
  const [pageSize, setPageSize] = useState(ROW_PER_PAGE)
  const cheques = useSelector((state: AppState) => state.cheques)
  const ownCheques = useCheques(launchpadAddress)

  const historyData = useMemo(
    () => ownCheques.map((address) => cheques[address]),
    [cheques, ownCheques],
  )
  return (
    <Row gutter={[0, 16]}>
      <Col span={24}>
        <Typography.Title level={5}>Recent transactions</Typography.Title>
      </Col>
      <Col span={24}>
        <Table
          columns={TRANS_HISTORY_COLUMN}
          dataSource={historyData.slice(0, pageSize)}
          rowKey={(record) => record.createAt.toString()}
          pagination={false}
          rowClassName={(_, index) => (index % 2 ? 'odd-row' : 'even-row')}
        />
      </Col>
      <Col span={24} style={{ textAlign: 'center' }}>
        <Button
          disabled={pageSize >= historyData.length}
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
