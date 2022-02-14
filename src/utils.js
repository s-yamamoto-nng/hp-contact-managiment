import client from 'axios'
import { store } from './modules/store'

client.defaults.withCredentials = true
client.defaults.headers.common['Content-Type'] = 'application/json'

client.interceptors.request.use(
  req => {
    const user = store.getState().auth.user
    if (user) {
      req.headers['Authorization'] = `Bearer ${user.token}`
    } else {
      delete req.headers.Authorization
    }
    return req
  },
  err => Promise.reject(err)
)

client.interceptors.response.use(
  res => res,
  err => {
    if (client.isCancel(err)) {
      return Promise.reject({ status: 999, statusText: 'Canceled' })
    }
    const response = err.response || {}
    const responseData = response.data || {}
    const status = response.status || 400
    const message = responseData.message || response.statusText || 'Error'
    const errors = responseData.errors || {}

    return Promise.reject({ status, message, errors })
  }
)

export { client }
