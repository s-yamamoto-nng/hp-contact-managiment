// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
// import { client } from 'utils'
// const CancelToken = client.CancelToken
// let cancel

// export const fetchAsyncCreate = createAsyncThunk('createProject/post', async auth => {
//   const res = await client.post('/api/projects', auth)
//   return res.data
// })

// export const fetchAsyncDelete = createAsyncThunk('deleteProject/delete', async auth => {
//   const res = await client.delete(`/api/projects/${auth._id}`)
//   return res.data
// })

// export const fetchAsyncEdit = createAsyncThunk('editProject/update', async auth => {
//   const res = await client.put(`/api/projects/${auth._id}`, auth)
//   return res.data
// })

// // export const fetchAsyncLoadProject = createAsyncThunk('loadProject/get', async => {
// //   return client.get('/api/projects', {
// //     cancelToken: new CancelToken(c => {
// //       cancel = c
// //     }),
// //   })
// // })

// export const projectSlice = createSlice({
//   name: 'project',
//   initialState: {
//     list: [],
//     error: {},
//   },
//   reducers: {
//     swap: (state, action) => {
//       state.list = action.payload
//       state.error = undefined
//     },
//   },
//   extraReducers: builder => {
//     builder.addCase(fetchAsyncCreate.fulfilled, (state, action) => {
//       state.list = action.payload
//       state.error = {}
//     })
//     builder.addCase(fetchAsyncCreate.rejected, (state, action) => {
//       state.list = []
//       state.error = 'プロジェクトを作成することができませんでした'
//     })
//     builder.addCase(fetchAsyncEdit.fulfilled, (state, action) => {
//       state.list = action.payload.list
//       state.error = {}
//     })
//     builder.addCase(fetchAsyncEdit.rejected, (state, action) => {
//       state.error = 'プロジェクト名を変更することができませんでした'
//     })
//     builder.addCase(fetchAsyncDelete.rejected, (state, action) => {
//       state.error = 'プロジェクトの削除に失敗しました'
//     })
//     builder.addCase(fetchAsyncDelete.fulfilled, (state, action) => {
//       delete state.list
//       state.error = {}
//     })
//     // builder.addCase(fetchAsyncLoadProject.fulfilled, (state, action) => {
//     //   state.list = action.payload
//     //   state.error = action.payload
//     // })
//     // builder.addCase(fetchAsyncLoadProject.rejected, (state, action) => {
//     //   state.error = action.payload
//     // })
//   },
// })

// export function loadProjects() {
//   return dispatch => {
//     return client
//       .get('/api/projects', {
//         cancelToken: new CancelToken(c => {
//           cancel = c
//         }),
//       })
//       .then(res => {
//         dispatch(swap(res.data))
//       })
//       .catch(error => {
//         if (client.isCancel(error)) {
//           dispatch(setError('読み込みをキャンセルしました'))
//         }
//       })
//   }
// }

// export function swapProject(target, method) {
//   return (dispatch, getState) => {
//     const list = getState().project.list
//     switch (method) {
//       case 'update': {
//         dispatch(swap([...list.filter(e => e._id !== target._id), target]))
//         return
//       }
//       case 'remove': {
//         dispatch(swap(list.filter(e => e._id !== target._id || e.type !== target.type)))
//         return
//       }
//       default:
//         return
//     }
//   }
// }
// export const { swap } = projectSlice.actions
// export default projectSlice.reducer

import { createSlice } from '@reduxjs/toolkit'
import { client } from 'utils'

const CancelToken = client.CancelToken
let cancel

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
    },
    error: (state, action) => {
      state.error = action.payload
    },
  },
})

export function removeProject(model) {
  return dispatch => {
    return client.delete(`/api/projects/${model._id}`).then(res => res.data)
  }
}

export function updateProject(model) {
  return dispatch => {
    return client.put(`/api/projects/${model._id}`, model).then(res => res.data)
  }
}

export function createProject(model) {
  return dispatch => {
    return client.post('/api/projects', model).then(res => res.data)
  }
}

export function loadProjects() {
  return dispatch => {
    return client
      .get('/api/projects', {
        cancelToken: new CancelToken(c => {
          cancel = c
        }),
      })
      .then(res => {
        dispatch(swap(res.data))
      })
      .catch(error => {
        if (client.isCancel(error)) {
          dispatch(setError('読み込みをキャンセルしました'))
        }
      })
  }
}

export const setError = message => {
  return dispatch => {
    dispatch(error(message))
  }
}

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

export const { swap, error } = projectSlice.actions
export default projectSlice.reducer
