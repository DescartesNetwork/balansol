import React, { useState } from 'react'

import { Button, Col, Input, Row, Select } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

import './search.less'

const Search = () => {
  const [search, setSearch] = useState('')
  return (
    <Row className="search-pools" gutter={[12, 12]}>
      <Col span={8}>
        <Select defaultValue={{ value: 'All pools' }} style={{ width: '100%' }}>
          <Select.Option value="All pools">All pools</Select.Option>
          <Select.Option value="Deposited pools">Deposited pools</Select.Option>
          <Select.Option value="Your pools">Your pools</Select.Option>
        </Select>
      </Col>
      <Col flex={'1 0'}>
        <Input
          placeholder="Search"
          value={search}
          prefix={
            <Button
              size="small"
              icon={<SearchOutlined style={{ fontSize: '24px' }} />}
            />
          }
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setSearch(e.target.value)
          }}
          style={{ borderRadius: '24px' }}
        />
      </Col>
    </Row>
  )
}

export default Search
