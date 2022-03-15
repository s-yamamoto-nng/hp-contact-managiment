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
    return client.put(`/api/removeProjects/${model._id}`).then(res => res.data)
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
