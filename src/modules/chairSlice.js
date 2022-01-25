import { createSlice } from '@reduxjs/toolkit'
import { client } from 'utils'

const CancelToken = client.CancelToken
let cancel

export const chairSlice = createSlice({
  name: 'chair',
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

export function removeChair(model) {
  return dispatch => {
    return client.delete(`/api/chairs/${model._id}`).then(res => res.data)
  }
}

export function updateChair(model) {
  return dispatch => {
    return client.put(`/api/chairs/${model._id}`, model).then(res => res.data)
  }
}

export function createChair(model) {
  return dispatch => {
    return client.post('/api/chairs', model).then(res => res.data)
  }
}

export function loadChairs() {
  return dispatch => {
    return client
      .get('/api/chairs', {
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

export function swapChair(target, method) {
  return (dispatch, getState) => {
    const list = getState().chair.list
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

export const { swap, error } = chairSlice.actions
export default chairSlice.reducer
