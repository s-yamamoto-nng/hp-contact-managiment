import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Alert from '@mui/material/Alert'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { loginUser, setError } from 'modules/authSlice'

const schema = yup.object({
  email: yup.string().required('必須です').email('正しいメールアドレス入力してください'),
  password: yup.string().required('必須です'),
})

export default function Login() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const dispatch = useDispatch()
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
    }
    dispatch(setError(undefined))
    dispatch(loginUser(model)).finally(() => {
      setIsSubmitting(false)
    })
  }

  return (
    <main style={{ padding: '1rem 0' }}>
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
            size="large"
            disabled={isSubmitting}
            sx={{ mt: 3, mb: 2 }}
            onClick={handleSubmit(onSubmit)}
          >
            ログイン
          </Button>
          {error && <Alert severity="error">{error}</Alert>}
        </Box>
      </Container>
    </main>
  )
}
