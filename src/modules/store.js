import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import chatReducer from './chatSlice'
import staffReducer from './staffSlice'
import chairReducer from './chairSlice'
import recordReducer from './recordSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    staff: staffReducer,
    chair: chairReducer,
    recode: recordReducer,
  },
})
