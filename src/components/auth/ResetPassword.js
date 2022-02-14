import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import Grid from '@mui/material/Grid'
import PasswordIcon from '@mui/icons-material/Password'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { resetPassword } from 'modules/authSlice'

const schema = yup.object({
  email: yup
    .string()
    .required('必須です')
    .email('正しいメールアドレス入力してください'),
  password: yup.string().required('必須です'),
})

const ResetPassword = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const error = useSelector(state => state.auth.error)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [reset, setReset] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })
  const onSubmit = (data, e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setReset(false)
    const model = {
      email: data.email,
      password: data.password,
    }
    dispatch(resetPassword(model))
      .then(() => setReset(true))
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <PasswordIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          ユニット設定値管理システム
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
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
            helperText={errors.email && errors.email.message}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            type="password"
            id="password"
            label="新しいパスワード"
            name="password"
            autoComplete="password"
            {...register('password')}
            error={'password' in errors}
            helperText={errors.password && errors.password.message}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isSubmitting}
            sx={{ mt: 3, mb: 2 }}
          >
            パスワードを変更する
          </Button>
          {error && <Alert severity="error">{error}</Alert>}
          {reset && !error && <Alert severity="success">パスワードを更新しました</Alert>}
        </Box>
        <Box
          sx={{
            marginTop: 2,
            width: '100%',
          }}
        >
          <Grid container>
            <Grid item xs>
              <Link
                onClick={() => {
                  history.push('/login')
                }}
                variant="body2"
              >
                ログインはこちら
              </Link>
            </Grid>
            <Grid item>
              <Link
                onClick={() => {
                  history.push('/register')
                }}
                variant="body2"
              >
                アカウントを作成する
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  )
}

export default ResetPassword
