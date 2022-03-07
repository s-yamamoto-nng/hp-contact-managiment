// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
// import { client } from 'utils'
// const CancelToken = client.CancelToken
// let cancel

// export const fetchAsyncCreate = createAsyncThunk('createTask/post', async auth => {
//   const res = await client.post('/api/createTask', auth)
//   return res.data
// })

// export const fetchAsyncDelete = createAsyncThunk('deleteTask/post', async auth => {
//   const res = await client.delete('/api/deleteTask', auth)
//   return res.data
// })

// export const fetchAsyncEdit = createAsyncThunk('editTask/post', async auth => {
//   const res = await client.update('/api/editTask', auth)
//   return res.data
// })

// export const fetchAsyncLoadTask = createAsyncThunk('loadTask/get', async => {
//   return client.get('/api/tasks', {
//     cancelToken: new CancelToken(c => {
//       cancel = c
//     }),
//   })
// })

// export const taskSlice = createSlice({
//   name: 'task',
//   initialState: {
//     list: [],
//     error: {},
//   },
//   reducers: {},
//   extraReducers: builder => {
//     builder.addCase(fetchAsyncCreate.fulfilled, (state, action) => {
//       state.list = action.payload
//       state.error = {}
//     })
//     builder.addCase(fetchAsyncCreate.rejected, (state, action) => {
//       state.list = action.payload
//       state.error = 'タスクの登録に失敗しました'
//     })
//     builder.addCase(fetchAsyncEdit.fulfilled, (state, action) => {
//       state.list = action.payload
//       state.error = {}
//     })
//     builder.addCase(fetchAsyncEdit.rejected, (state, action) => {
//       state.error = 'タスクの編集に失敗しました'
//     })
//     builder.addCase(fetchAsyncDelete.rejected, (state, action) => {
//       state.error = 'タスクの削除に失敗しました'
//     })
//     builder.addCase(fetchAsyncDelete.fulfilled, (state, action) => {
//       state.list = action.payload
//       state.error = {}
//     })
//     builder.addCase(fetchAsyncLoadTask.fulfilled, (state, action) => {
//       state.list = action.payload
//       state.error = action.payload
//     })
//     builder.addCase(fetchAsyncLoadTask.rejected, (state, action) => {
//       state.error = action.payload
//     })
//   },
// })

// export default taskSlice.reducer
import { createSlice } from '@reduxjs/toolkit'
import { client } from 'utils'

const CancelToken = client.CancelToken
let cancel

export const taskSlice = createSlice({
  name: 'task',
  initialState: {
    list: [],
    error: {},
  },
  reducers: {
    swap: (state, action) => {
      state.list = action.payload
      state.error = undefined
    },
    error: (state, action) => {
      state.error = action.payload
    },
  },
})

export function removeTask(model) {
  return dispatch => {
    return client.delete(`/api/tasks/${model._id}`).then(res => res.data)
  }
}

export function updateTask(model) {
  return dispatch => {
    return client.put(`/api/tasks/${model._id}`, model).then(res => res.data)
  }
}

export function createTask(model) {
  return dispatch => {
    return client.post('/api/tasks', model).then(res => res.data)
  }
}

export const setError = message => {
  return dispatch => {
    dispatch(error(message))
  }
}

export function swapTask(target, method) {
  return (dispatch, getState) => {
    const list = getState().task.list
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

export const { swap, error } = taskSlice.actions
export default taskSlice.reducer
