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
    return client.put(`/api/removeTasks/${model._id}`).then(res => res.data)
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

export function loadTasks() {
  return dispatch => {
    return client
      .get('/api/tasks', {
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

export function readFlgTask(model) {
  return dispatch => {
    return client.post(`/api/readFlgTask/${model._id}`, model).then(res => res.data)
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
