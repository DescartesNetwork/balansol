import { Button, Card, Input } from 'antd'
import React, { useState } from 'react'
import IonIcon from 'shared/antd/ionicon'

export default function Search() {
  const [search, setSearch] = useState('')
  return (
    <Card bodyStyle={{ padding: 8 }} bordered={false} className="lp-card">
      <Input
        placeholder="Search"
        value={search}
        size="small"
        bordered={false}
        prefix={
          <Button
            type="text"
            style={{ marginLeft: -7 }}
            size="small"
            onClick={() => {}}
            icon={
              <IonIcon name={search ? 'close-outline' : 'search-outline'} />
            }
          />
        }
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setSearch(e.target.value)
        }}
      />
    </Card>
  )
}
