import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { client } from 'utils'

export const fetchAsyncCreate = createAsyncThunk('createTask/post', async auth => {
  const res = await client.post('/api/createTask', auth)
  return res.data
})

export const fetchAsyncDelete = createAsyncThunk('deleteTask/post', async auth => {
  const res = await client.delete('/api/deleteTask', auth)
  return res.data
})

export const fetchAsyncEdit = createAsyncThunk('editTask/post', async auth => {
  const res = await client.update('/api/editTask', auth)
  return res.data
})

export const taskSlice = createSlice({
  name: 'task',
  initialState: {
    list: [],
    error: {},
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchAsyncCreate.fulfilled, (state, action) => {
      state.list = action.payload
      state.error = {}
    })
    builder.addCase(fetchAsyncCreate.rejected, (state, action) => {
      state.list = action.payload
      state.error = 'タスクの登録に失敗しました'
    })
    builder.addCase(fetchAsyncEdit.fulfilled, (state, action) => {
      state.list = action.payload
      state.error = {}
    })
    builder.addCase(fetchAsyncEdit.rejected, (state, action) => {
      state.error = 'タスクの編集に失敗しました'
    })
    builder.addCase(fetchAsyncDelete.rejected, (state, action) => {
      state.error = 'タスクの削除に失敗しました'
    })
    builder.addCase(fetchAsyncDelete.fulfilled, (state, action) => {
      state.list = action.payload
      state.error = {}
    })
  },
})

export default taskSlice.reducer
