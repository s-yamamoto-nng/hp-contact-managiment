import { createSlice } from '@reduxjs/toolkit'
import { client } from 'utils'

export const staffSlice = createSlice({
  name: 'record',
  initialState: {
    error: {},
  },
  reducers: {
    error: (state, action) => {
      state.error = action.payload
    },
  },
})

export function findOneRecord(model) {
  return dispatch => {
    return client
      .get(`/api/records?staff=${model.staff}&memory=${model.memory}`)
      .then(res => res.data)
  }
}

export function createRecord(model) {
  return dispatch => {
    return client.post('/api/records', model).then(res => res.data)
  }
}

export const setError = message => {
  return dispatch => {
    dispatch(error(message))
  }
}

export const { error } = staffSlice.actions
export default staffSlice.reducer
