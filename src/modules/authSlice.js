import { createSlice } from '@reduxjs/toolkit'
import io from 'socket.io-client'
import { client } from 'utils'
import { swapStaff } from './staffSlice'
import { swapChair } from './chairSlice'

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: undefined,
    error: null,
  },
  reducers: {
    login: (state, action) => {
      localStorage.token = action.payload.user.token
      state.user = action.payload.user
      state.error = action.payload.error
    },
    logout: state => {
      delete localStorage.token
      state.user = undefined
    },
    error: (state, action) => {
      state.error = action.payload
    },
  },
})

export const resetPassword = model => {
  return dispatch => {
    return client.post('/api/resetPassword', model).then(res => res.data)
  }
}

export const loginUser = model => {
  return dispatch => {
    return client
      .post('/api/login', model)
      .then(res => {
        const socket = io({
          transports: ['websocket'],
          query: {
            id: res.data.user._id,
            token: res.data.token,
            accountName: res.data.user.account,
            client: 'web',
          },
        })
        socket.on('staff:update', e => dispatch(swapStaff(e, 'update')))
        socket.on('staff:remove', e => dispatch(swapStaff(e, 'remove')))
        socket.on('chair:update', e => dispatch(swapChair(e, 'update')))
        socket.on('chair:remove', e => dispatch(swapChair(e, 'remove')))

        dispatch(login({ user: res.data.user, error: null }))
      })
      .catch(() => {
        dispatch(logout())
        dispatch(error('ログインできませんでした'))
      })
  }
}

export const createUser = model => {
  return dispatch => {
    return client
      .post('/api/signup', model)
      .then(res => {
        dispatch(login(res.data))
      })
      .catch(err => {
        dispatch(error(err.message))
      })
  }
}

export const logoutUser = () => {
  return dispatch => {
    dispatch(logout())
    window.localStorage.setItem('logout', Date.now())
  }
}

export const { login, logout, error } = authSlice.actions
export default authSlice.reducer
