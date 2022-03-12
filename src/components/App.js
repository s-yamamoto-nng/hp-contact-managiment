import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { HashRouter as Router, Route, Redirect, Switch } from 'react-router-dom'

import { loginUser } from 'modules/authSlice'
import Login from './auth/Login'
import Register from './auth/Register'
import ResetPassword from './auth/ResetPassword'
import AppRoute from './home/Layout'
import UserRequest from './auth/userRequest'

const App = () => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.auth.user)
  const [login, setLogin] = useState(false)

  useEffect(() => {
    const token = localStorage.token
    if (token) {
      dispatch(loginUser({ token })).then(() => {
        setLogin(true)
      })
    } else {
      setLogin(true)
    }
  }, [])

  if (!login) {
    return null
  }

  const PrivateRoute = ({ component }) => {
    return user ? <Route component={component} /> : <Redirect to="/login" />
  }

  return (
    <Router>
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/resetPassword" component={ResetPassword} />
        <Route exact path="/userRequest" component={UserRequest} />
        <PrivateRoute path="/" component={AppRoute} />
      </Switch>
    </Router>
  )
}

export default App
