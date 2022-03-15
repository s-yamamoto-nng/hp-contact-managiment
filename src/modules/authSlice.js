import { createSlice } from '@reduxjs/toolkit'
import io from 'socket.io-client'
import { client } from 'utils'
import { swapProject } from './projectSlice'
import { swapTask } from './taskSlice'

const CancelToken = client.CancelToken
let cancel

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: undefined,
    error: null,
    users: [],
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
      state.error = undefined
    },
    error: (state, action) => {
      state.error = action.payload
    },
    swap: (state, action) => {
      state.users = action.payload
      state.error = undefined
    },
  },
})

export const resetPassword = model => {
  return dispatch => {
    return client
      .post('/api/resetPassword', model)
      .then(res => res.data)
      .catch(() => {
        dispatch(error('パスワードを変更出来ませんでした'))
      })
  }
}

export const userRequest = model => {
  return dispatch => {
    return client
      .post(`/api/userRequest/${model._id}`, model)
      .then(res => res.data)
      .catch(() => {
        dispatch(error('ユーザー申請許可に失敗しました'))
      })
  }
}

export const userApproval = model => {
  return dispatch => {
    return client
      .post('/api/userApproval', model)
      .then(res => res.data)
      .catch(() => {
        dispatch(error('ユーザー申請に失敗しました'))
      })
  }
}

export const removeUser = model => {
  return dispatch => {
    return client.put(`/api/removeUsers/${model._id}`).then(res => res.data)
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
        socket.on('project:update', e => dispatch(swapProject(e, 'update')))
        socket.on('project:remove', e => dispatch(swapProject(e, 'remove')))
        socket.on('task:update', e => dispatch(swapTask(e, 'update')))
        socket.on('task:remove', e => dispatch(swapTask(e, 'remove')))
        socket.on('user:update', e => dispatch(swapUser(e, 'update')))
        socket.on('user:remove', e => dispatch(swapUser(e, 'remove')))
        socket.on('account:update', e => dispatch(swapUser(e, 'update')))
        socket.on('account:remove', e => dispatch(swapUser(e, 'remove')))
        dispatch(login({ user: res.data.user, error: null }))
      })
      .catch(() => {
        dispatch(logout())
        dispatch(error('ログイン情報に誤りがあるか、ユーザー申請が通過しておりません。'))
      })
  }
}

export function loadUsers() {
  return dispatch => {
    return client
      .get('/api/users', {
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

export function swapUser(target, method) {
  return (dispatch, getState) => {
    const user = getState().auth.users
    switch (method) {
      case 'update': {
        dispatch(swap([...user.filter(e => e._id !== target._id), target]))
        return
      }
      case 'remove': {
        dispatch(swap(user.filter(e => e._id !== target._id || e.type !== target.type)))
        return
      }
      default:
        return
    }
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

export const { login, logout, error, swap } = authSlice.actions
export default authSlice.reducer
