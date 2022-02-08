import React, { useEffect, useCallback, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'

import { refreshToken } from 'modules/authSlice'
import AuthPage from './AuthPage'
import Layout from './Layout'
// import HomePage from './HomePage'
import Project from './Project'
import Inquiry from './Inquiry'
import Task from './Task'

const App = () => {
  const token = useSelector(state => state.auth.token)
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  const verifyUser = useCallback(() => {
    dispatch(refreshToken()).finally(() => setLoading(false))
    setTimeout(verifyUser, 5 * 60 * 1000)
  }, [])

  useEffect(() => {
    verifyUser()
  }, [verifyUser])

  const syncLogout = useCallback(event => {
    if (event.key === 'logout') {
      window.location.reload()
    }
  }, [])

  useEffect(() => {
    window.addEventListener('storage', syncLogout)
    return () => {
      window.removeEventListener('storage', syncLogout)
    }
  }, [syncLogout])

  return !loading && !token ? (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route
          path="*"
          element={
            <main style={{ padding: '1rem' }}>
              <p>Not Found</p>
            </main>
          }
        />
      </Routes>
    </BrowserRouter>
  ) : token ? (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* <Route path="home" element={<HomePage />} /> */}
          <Route path="project" element={<Project />} />
          <Route path="inquiry" element={<Inquiry />} />
          <Route path="task" element={<Task />} />
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
    </BrowserRouter>
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

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Outlet />
    </div>
  )
}

export default App
