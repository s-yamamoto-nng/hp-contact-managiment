import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { client } from 'utils'
const CancelToken = client.CancelToken
let cancel

export const fetchAsyncCreate = createAsyncThunk('createProject/post', async auth => {
  const res = await client.post('/api/projects', auth)
  return res.data
})

export const fetchAsyncDelete = createAsyncThunk('deleteProject/delete', async auth => {
  const res = await client.delete(`/api/projects/${auth._id}`)
  return res.data
})

export const fetchAsyncEdit = createAsyncThunk('editProject/update', async auth => {
  const res = await client.put(`/api/projects/${auth._id}`, auth)
  return res.data
})

export const fetchAsyncLoadProject = createAsyncThunk('loadProject/get', async => {
  return client.get('/api/projects', {
    cancelToken: new CancelToken(c => {
      cancel = c
    }),
  })
})

export const projectSlice = createSlice({
  name: 'project',
  initialState: {
    list: [],
    error: {},
  },
  reducers: {
    swap: (state, action) => {
      state.list = action.payload
      state.error = undefined
    }
  },
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
    builder.addCase(fetchAsyncLoadProject.fulfilled, (state, action) => {
      state.list = action.payload
      state.error = action.payload
    })
    builder.addCase(fetchAsyncLoadProject.rejected, (state, action) => {
      state.error = action.payload
    })
  },
})


export function swapProject(target, method) {
  return (dispatch, getState) => {
    const list = getState().project.list
    switch (method) {
      case 'update': {
        dispatch(swap([...list.filter(e => e._id !== target._id), target]))
        return
      }
      case 'remove': {
        dispatch(swap(list.filter(e => e._id !== target._id || e.type !== target.type)))
        return
      }
      default:
        return
    }
  }
}


export default projectSlice.reducer
