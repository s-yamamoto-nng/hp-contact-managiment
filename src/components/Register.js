import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Alert from '@mui/material/Alert'

import { createUser, setError } from 'modules/authSlice'

const schema = yup.object({
  email: yup.string().required('必須です').email('正しいメールアドレス入力してください'),
  password: yup
    .string()
    .required('必須です')
    .min(6, '6文字以上必要です')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&].*$/,
      'パスワードが単純です。数値と記号を組み合わせてください'
    ),
})

export default function Register() {
  const dispatch = useDispatch()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const error = useSelector(state => state.auth.error)

  useEffect(() => {
    dispatch(setError())
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })
  const onSubmit = data => {
    setIsSubmitting(true)
    const model = {
      username: data.email,
      password: data.password,
      accountName: data.accountName,
    }
    dispatch(setError(undefined))
    dispatch(createUser(model)).finally(() => {
      setIsSubmitting(false)
    })
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <TextField
          margin="normal"
          required
          fullWidth
          id="accountName"
          label="アカウント名"
          name="accountName"
          autoComplete="account"
          autoFocus
          {...register('accountName')}
          error={'accountName' in errors}
          helperText={errors.accountName?.message}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Eメールアドレス"
          name="email"
          autoComplete="email"
          autoFocus
          {...register('email')}
          error={'email' in errors}
          helperText={errors.email?.message}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          type="password"
          id="password"
          label="パスワード"
          name="password"
          autoComplete="password"
          {...register('password')}
          error={'password' in errors}
          helperText={errors.password?.message}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={isSubmitting}
          size="large"
          sx={{ mt: 3, mb: 2 }}
          onClick={handleSubmit(onSubmit)}
        >
          新規登録
        </Button>
        {error && <Alert severity="error">{error}</Alert>}
      </Box>
    </Container>
  )
}
