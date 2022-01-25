import { createSlice } from '@reduxjs/toolkit'
import { client } from 'utils'

const CancelToken = client.CancelToken
let cancel

export const staffSlice = createSlice({
  name: 'staff',
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

export function deleteStaff() {
  return dispatch => {
    return
  }
}

export function removeStaff(model) {
  return dispatch => {
    return client.delete(`/api/staffs/${model._id}`).then(res => res.data)
  }
}

export function updateStaff(model) {
  return dispatch => {
    return client.put(`/api/staffs/${model._id}`, model).then(res => res.data)
  }
}

export function createStaff(model) {
  return dispatch => {
    return client.post('/api/staffs', model).then(res => res.data)
  }
}

export function loadStaffs() {
  return dispatch => {
    return client
      .get('/api/staffs', {
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

export function swapStaff(target, method) {
  return (dispatch, getState) => {
    const list = getState().staff.list
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

export const { swap, error } = staffSlice.actions
export default staffSlice.reducer
