import { createSlice } from '@reduxjs/toolkit'
import { client } from 'utils'

const CancelToken = client.CancelToken
let cancel

export const chatSlice = createSlice({
  name: 'chat',
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

export function deleteChat() {
  return dispatch => {
    return
  }
}

export function createChat(model) {
  return dispatch => {
    return client.post('/api/chats', model).then(res => res.data)
  }
}

export function loadChats() {
  return dispatch => {
    return client
      .get('/api/chats', {
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

export function swapChat(target, method) {
  return (dispatch, getState) => {
    const list = getState().chat.list
    switch (method) {
      case 'update': {
        dispatch(swap([...list.filter(e => e._id !== target._id), target]))
        return
      }
      case 'delete': {
        dispatch(swap(list.filter(e => e._id !== target._id || e.type !== target.type)))
        return
      }
      default:
        return
    }
  }
}

export const { swap, error } = chatSlice.actions
export default chatSlice.reducer
