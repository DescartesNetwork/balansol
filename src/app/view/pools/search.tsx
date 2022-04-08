import React from 'react'

import { Col, Input, Row, Select } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

import { SearchSelection } from 'app/constant'

import './search.less'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from 'app/model'

import {
  setSearchInput,
  setSearchSelection,
} from 'app/model/searchPools.controller'

const Search = () => {
  const {
    searchPools: { searchInput, selectionSearch },
  } = useSelector((state: AppState) => state)

  const dispatch = useDispatch<AppDispatch>()

  return (
    <Row className="search-pools" gutter={[12, 12]}>
      <Col md={8} xs={10}>
        <Select
          value={selectionSearch}
          onChange={(value: SearchSelection) => {
            dispatch(setSearchSelection({ selectSearch: value }))
          }}
          style={{ width: '100%' }}
        >
          <Select.Option value={SearchSelection.AllPools}>
            All pools
          </Select.Option>
          <Select.Option value={SearchSelection.DepositedPools}>
            Deposited pools
          </Select.Option>
          <Select.Option value={SearchSelection.YourPools}>
            Your pools
          </Select.Option>
        </Select>
      </Col>
      <Col flex={'1 0'}>
        <Input
          placeholder="Search"
          value={searchInput}
          prefix={<SearchOutlined style={{ fontSize: '24px' }} />}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            dispatch(setSearchInput({ searchText: e.target.value }))
          }}
          style={{ borderRadius: '24px' }}
        />
      </Col>
    </Row>
  )
}

export default Search
