// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
// import { client } from 'utils'
// import io from 'socket.io-client'
// import { swapProject } from './projectSlice'

// export const fetchAsyncLogin = createAsyncThunk('login/post', async auth => {
//   const res = await client.post('/api/login', auth)
//   return res.data
// })

// export const fetchAsyncRegister = createAsyncThunk('signup/post', async auth => {
//   const res = await client.post('/api/signup', auth)
//   return res.data
// })

// export const fetchAsyncReset = createAsyncThunk('resetPassword/post', async auth => {
//   const res = await client.post('/api/resetPassword', auth)
//   return res.data
// })

// export const fetchAsyncLogout = createAsyncThunk('logout', async (_, thunkAPI) => {
//   thunkAPI.dispatch(logout())
//   window.localStorage.setItem('logout', Date.now())
// })

// export const authSlice = createSlice({
//   name: 'auth',
//   initialState: {
//     user: undefined,
//     error: null,
//   },
//   reducers: {
//     logout(state, action) {
//       delete localStorage.token
//       state.user = undefined
//     },
//   },

//   extraReducers: builder => {
//     builder.addCase(fetchAsyncReset.rejected, (state, action) => {
//       state.error = 'パスワードを変更できませんでした'
//     })
//     builder.addCase(fetchAsyncLogin.fulfilled, (state, action) => {
//       const socket = io({
//         transports: ['websocket'],
//         query: {
//           id: action.payload.user._id,
//           token: action.payload.token,
//           accountName: action.payload.user.account,
//           client: 'web',
//         },
//       })
//       socket.on('project:update', e => dispatch(swapProject(e, 'update')))
//       socket.on('project:remove', e => dispatch(swapProject(e, 'remove')))
//       localStorage.token = action.payload.user.token
//       state.user = action.payload.user
//       state.error = action.payload.error
//     })
//     builder.addCase(fetchAsyncLogin.rejected, (state, action) => {
//       state.user = undefined
//       state.token = undefined
//       state.error = 'ログインできませんでした'
//     })
//     builder.addCase(fetchAsyncRegister.fulfilled, (state, action) => {
//       localStorage.token = action.payload.user.token
//       state.user = action.payload.user
//       state.error = action.payload.error
//     })
//     builder.addCase(fetchAsyncRegister.rejected, (state, action) => {
//       state.error = '新規登録に失敗しました。もう一度入力し直してください。'
//     })
//   },
// })

// export const { logout } = authSlice.actions
// export default authSlice.reducer

import { createSlice } from '@reduxjs/toolkit'
import io from 'socket.io-client'
import { client } from 'utils'
import { swapProject } from './projectSlice'

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
    return client
      .post('/api/resetPassword', model)
      .then(res => res.data)
      .catch(() => {
        dispatch(error('パスワードを変更出来ませんでした'))
      })
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
