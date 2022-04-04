import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { PoolData } from '@senswap/sen-js'
import { SearchSelection } from 'app/constant'

/**
 * Interface & Utility
 */

export type SearchState = {
  searchInput: string
  selectionSearch: SearchSelection
}

/**
 * Store constructor
 */

const NAME = 'searchPools'
const initialState: SearchState = {
  searchInput: '',
  selectionSearch: SearchSelection.AllPools,
}

/**
 * Actions
 */

export const setSearchSelection = createAsyncThunk(
  `${NAME}/setSearchSelection`,
  async ({ selectSearch }: { selectSearch: SearchSelection }) => {
    return {
      selectionSearch: selectSearch,
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
        setSearchSelection.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        setSearchInput.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      ),
})

export default slice.reducer
