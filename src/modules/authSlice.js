import { createSlice } from '@reduxjs/toolkit'
import socketIOClient from 'socket.io-client'
import { client } from 'utils'
import { swapStaff } from './staffSlice'
import { swapChair } from './chairSlice'

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: {},
    token: null,
    error: {},
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.error = undefined
    },
    logout: state => {
      state.user = {}
      state.token = undefined
      state.error = undefined
    },
    refetch: state => {
      state.user = undefined
    },
    user: (state, action) => {
      state.user = action.payload
    },
    error: (state, action) => {
      state.error = action.payload
    },
  },
})

export const getMe = () => {
  return dispatch => {
    return client
      .get('/api/users/me')
      .then(res => {
        dispatch(user(res.data))
      })
      .catch(() => {
        dispatch(logout())
      })
  }
}

export const setError = message => {
  return dispatch => {
    dispatch(error(message))
  }
}

export const refetchUser = () => {
  return dispatch => {
    dispatch(refetch())
  }
}

export const setWebsocket = (token, accountName) => {
  return dispatch => {
    const socket = socketIOClient({
      transports: ['websocket'],
      query: { token, accountName, client: 'web' },
    })
    socket.on('staff:update', e => dispatch(swapStaff(e, 'update')))
    socket.on('staff:remove', e => dispatch(swapStaff(e, 'remove')))
    socket.on('chair:update', e => dispatch(swapChair(e, 'update')))
    socket.on('chair:remove', e => dispatch(swapChair(e, 'remove')))
  }
}

export const loginUser = model => {
  return dispatch => {
    return client
      .post('/api/login', model)
      .then(res => {
        dispatch(setWebsocket(res.data.token, res.data.user.account.name))
        dispatch(login(res.data))
      })
      .catch(() => {
        dispatch(setError('ユーザー名、パスワードを確認してください'))
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
        dispatch(setError(err.message))
      })
  }
}

export const logoutUser = () => {
  return dispatch => {
    return client.get('/api/users/logout').then(res => {
      dispatch(logout())
      window.localStorage.setItem('logout', Date.now())
    })
  }
}

export const refreshToken = () => {
  return dispatch => {
    return client
      .post('/api/refreshToken')
      .then(res => {
        dispatch(setWebsocket(res.data.token, res.data.user.account.name))
        dispatch(login(res.data))
      })
      .catch(() => {
        dispatch(logout())
      })
  }
}

export const { user, login, logout, refetch, error } = authSlice.actions
export default authSlice.reducer
