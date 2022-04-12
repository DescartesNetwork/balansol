import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { FilterPools } from 'app/constant'

/**
 * Interface & Utility
 */

export type SearchState = {
  searchInput: string
  filterPool: FilterPools
}

/**
 * Store constructor
 */

const NAME = 'searchPools'
const initialState: SearchState = {
  searchInput: '',
  filterPool: FilterPools.AllPools,
}

/**
 * Actions
 */

export const setFilterPool = createAsyncThunk(
  `${NAME}/setSearchSelection`,
  async ({ filterPool }: { filterPool: FilterPools }) => {
    return {
      filterPool: filterPool,
    }
  },
)

export const setSearchInput = createAsyncThunk(
  `${NAME}/setSearchInput`,
  async ({ searchText }: { searchText: string }) => {
    return {
      searchInput: searchText,
    }
  },
)

/**
 * Usual procedure
 */

const slice = createSlice({
  name: NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    void builder
      .addCase(
        setFilterPool.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        setSearchInput.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      ),
})

export default slice.reducer
