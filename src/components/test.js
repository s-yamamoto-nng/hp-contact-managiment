import React, { useState, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Button from '@mui/material/Button'

import { getMe, logoutUser, refetchUser } from 'modules/authSlice'
import { createChat, loadChats } from 'modules/chatSlice'

const Welcome = () => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.auth.user)
  const list = useSelector(state => state.chat.list)

  useEffect(() => {
    dispatch(loadChats())
  }, [])

  const fetchUserDetails = useCallback(() => {
    dispatch(getMe())
  }, [user])

  useEffect(() => {
    if (!user) {
      fetchUserDetails()
    }
  }, [user, fetchUserDetails])

  const handleLogout = () => {
    dispatch(logoutUser())
  }

  const handleRefetch = () => {
    dispatch(refetchUser())
  }

  const handleChat = () => {
    dispatch(createChat({ text: list.length + 1 }))
  }

  return (
    <div style={{ padding: 12 }}>
      <div>{user?.username}</div>
      {list.map((x, index) => (
        <div key={index}>{x.text}</div>
      ))}
      <Button onClick={handleLogout}>ログアウト</Button>
      <Button onClick={handleRefetch}>リフェッチ</Button>
      <Button onClick={handleChat}>GO</Button>
    </div>
  )
}

export default Welcome
