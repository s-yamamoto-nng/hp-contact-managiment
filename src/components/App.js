import React, { useEffect, useCallback, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import { Routes, Route, Outlet, Navigate } from 'react-router-dom'

import { loginUser, logoutUser } from 'modules/authSlice'
import Login from './auth/Login'
import Register from './auth/Register'
import ResetPassword from './auth/ResetPassword'
import HomeLayout from './home/Layout'
import HomePage from './home/HomePage'
import RecordPage from './home/RecordPage'
import StaffPage from './home/StaffPage'
import ChairPage from './home/ChairPage'

const App = () => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.auth.user)
  const [loading, setLoading] = useState(true)

  const verifyUser = useCallback(() => {
    const token = localStorage.token
    if (token) {
      dispatch(loginUser({ token })).finally(() => {
        setLoading(false)
      })
    } else {
      dispatch(logoutUser())
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    verifyUser()
  }, [verifyUser])

  const PrivateRoute = () => {
    return user ? <Outlet /> : <Navigate to="/login" />
  }

  return !loading ? (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="resetPassword" element={<ResetPassword />} />
      <Route exact path="/" element={<PrivateRoute />}>
        <Route path="/" element={<HomeLayout />}>
          <Route path="home" element={<HomePage />} />
          <Route path="record" element={<RecordPage />} />
          <Route path="staff" element={<StaffPage />} />
          <Route path="chair" element={<ChairPage />} />
        </Route>
      </Route>
      <Route
        path="*"
        element={
          <main style={{ padding: '1rem' }}>
            <p>Not Found</p>
          </main>
        }
      />
    </Routes>
  ) : (
    <Box
      style={{
        display: 'flex',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
      }}
    >
      <CircularProgress size={24} />
    </Box>
  )
}

export default App
