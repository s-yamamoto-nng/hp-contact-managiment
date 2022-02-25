import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { client } from 'utils'

export const fetchAsyncCreate = createAsyncThunk('createProject/post', async auth => {
  const res = await client.post('/api/createProject', auth)
  return res.data
})

export const fetchAsyncDelete = createAsyncThunk('deleteProject/post', async auth => {
  const res = await client.delete('/api/deleteProject', auth)
  return res.data
})

export const fetchAsyncEdit = createAsyncThunk('editProject/post', async auth => {
  const res = await client.update('/api/editProject', auth)
  return res.data
})

export const projectSlice = createSlice({
  name: 'project',
  initialState: {
    list: [],
    error: {},
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchAsyncCreate.fulfilled, (state, action) => {
      state.list = action.payload.list
      state.error = {}
    })
    builder.addCase(fetchAsyncCreate.rejected, (state, action) => {
      state.list = []
      state.error = 'プロジェクトを作成することができませんでした'
    })
    builder.addCase(fetchAsyncEdit.fulfilled, (state, action) => {
      state.list = action.payload.list
      state.error = {}
    })
    builder.addCase(fetchAsyncEdit.rejected, (state, action) => {
      state.error = 'プロジェクト名を変更することができませんでした'
    })
    builder.addCase(fetchAsyncDelete.rejected, (state, action) => {
      state.error = 'プロジェクトの削除に失敗しました'
    })
    builder.addCase(fetchAsyncDelete.fulfilled, (state, action) => {
      delete state.list
      state.error = {}
    })
  },
})

export default projectSlice.reducer