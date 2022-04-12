import React from 'react'

import { Button, Col, Input, Row, Select } from 'antd'
import { SearchOutlined, CloseOutlined } from '@ant-design/icons'

import { FilterPools } from 'app/constant'

import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from 'app/model'

import { setSearchInput, setFilterPool } from 'app/model/searchPools.controller'

const Search = () => {
  const {
    searchPools: { searchInput, filterPool },
  } = useSelector((state: AppState) => state)

  const dispatch = useDispatch<AppDispatch>()

  const onSearch = (value: string) => {
    dispatch(setSearchInput({ searchText: value }))
  }

  return (
    <Row className="search-pools" gutter={[12, 12]}>
      <Col md={8} xs={10}>
        <Select
          value={filterPool}
          onChange={(value: FilterPools) => {
            dispatch(setFilterPool({ filterPool: value }))
          }}
          style={{ width: '100%' }}
        >
          <Select.Option value={FilterPools.AllPools}>All pools</Select.Option>
          <Select.Option value={FilterPools.DepositedPools}>
            Deposited pools
          </Select.Option>
          <Select.Option value={FilterPools.YourPools}>
            Your pools
          </Select.Option>
        </Select>
      </Col>
      <Col flex={'1 0'}>
        <Input
          placeholder="Search"
          value={searchInput}
          prefix={
            searchInput ? (
              <Button
                type="text"
                style={{
                  width: 'auto',
                  height: 'auto',
                  background: 'transparent',
                }}
                onClick={() => onSearch('')}
                icon={<CloseOutlined />}
              />
            ) : (
              <SearchOutlined style={{ fontSize: '24px' }} />
            )
          }
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            onSearch(e.target.value)
          }}
          style={{ borderRadius: '24px' }}
        />
      </Col>
    </Row>
  )
}

export default Search
