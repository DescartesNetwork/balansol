import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Button, Col, Input, Row, Select } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

import { FilterPools } from 'constant'
import { AppDispatch, AppState } from 'model'
import { setSearchInput, setFilterPool } from 'model/searchPools.controller'

const Search = () => {
  const { searchInput, filterPool } = useSelector(
    (state: AppState) => state.searchPools,
  )

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
          style={{ width: '100%', height: '32px' }}
          className="category"
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
                  marginLeft: -7,
                }}
                onClick={() => onSearch('')}
                icon={<IonIcon name="close-outline" />}
              />
            ) : (
              <IonIcon
                style={{ fontSize: '24px', marginLeft: -5 }}
                name="search-outline"
              />
            )
          }
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            onSearch(e.target.value)
          }}
          style={{ borderRadius: '24px', height: '32px' }}
        />
      </Col>
    </Row>
  )
}

export default Search
