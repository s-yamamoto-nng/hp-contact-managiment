import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { client } from 'utils'

export const fetchAsyncLogin = createAsyncThunk('login/post', async auth => {
  const res = await client.post('/api/login', auth)
  return res.data
})

export const fetchAsyncRegister = createAsyncThunk('signup/post', async auth => {
  const res = await client.post('/api/signup', auth)
  return res.data
})

export const fetchAsyncReset = createAsyncThunk('resetPassword/post', async auth => {
  const res = await client.post('/api/resetPassword', auth)
  return res.data
})

export const fetchAsyncLogout = createAsyncThunk('logout', async (_, thunkAPI) => {
  thunkAPI.dispatch(logout())
  window.localStorage.setItem('logout', Date.now())
})

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: undefined,
    error: null,
  },
  reducers: {
    logout(state, action) {
      delete localStorage.token
      state.user = undefined
    },
  },

  extraReducers: builder => {
    builder.addCase(fetchAsyncReset.rejected, (state, action) => {
      state.error = 'パスワードを変更できませんでした'
    })
    builder.addCase(fetchAsyncLogin.fulfilled, (state, action) => {
      localStorage.token = action.payload.user.token
      state.user = action.payload.user
      state.error = action.payload.error
    })
    builder.addCase(fetchAsyncLogin.rejected, (state, action) => {
      state.user = undefined
      state.token = undefined
      state.error = 'ログインできませんでした'
    })
    builder.addCase(fetchAsyncRegister.fulfilled, (state, action) => {
      localStorage.token = action.payload.user.token
      state.user = action.payload.user
      state.error = action.payload.error
    })
    builder.addCase(fetchAsyncRegister.rejected, (state, action) => {
      state.error = '新規登録に失敗しました。もう一度入力し直してください。'
    })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer
