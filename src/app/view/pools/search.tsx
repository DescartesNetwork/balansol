import React, { useState } from 'react'

import { Button, Card, Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

import './search.less'

export default function Search() {
  const [search, setSearch] = useState('')
  return (
    <Card bodyStyle={{ padding: 4, borderRadius: 40 }} className="lp-card">
      <Input
        placeholder="Search"
        value={search}
        size="small"
        bordered={false}
        prefix={
          <Button
            type="text"
            size="small"
            onClick={() => {}}
            icon={<SearchOutlined style={{ fontSize: '24px' }} />}
          />
        }
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setSearch(e.target.value)
        }}
      />
    </Card>
  )
}
