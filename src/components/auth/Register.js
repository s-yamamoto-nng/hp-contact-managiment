import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import Link from '@mui/material/Link'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'

import { createUser } from 'modules/authSlice'

const schema = yup.object({
  email: yup
    .string()
    .required('必須です')
    .email('正しいメールアドレス入力してください'),
  password: yup
    .string()
    .required('必須です')
    .min(6, '6文字以上必要です')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&].*$/,
      'パスワードが単純です。数値と記号を組み合わせてください'
    ),
})

const Register = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const error = useSelector(state => state.auth.error)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [account, setAccount] = useState(false)

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
    setAccount(false)
    const model = {
      email: data.email,
      password: data.password,
      accountName: data.accountName,
    }
    dispatch(createUser(model))
      .then(() => setAccount(true))
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
          <AccountCircleIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          ユニット設定値管理システム
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
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
            helperText={errors.accountName && errors.accountName.message}
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
            helperText={errors.email && errors.email.message}
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
            helperText={errors.password && errors.password.message}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isSubmitting}
            size="large"
            sx={{ mt: 3, mb: 2 }}
          >
            新規登録
          </Button>
          {error && <Alert severity="error">{error}</Alert>}
          {account && !error && <Alert severity="success">アカウントを作成しました</Alert>}
        </Box>
        <Box
          sx={{
            marginTop: 2,
            width: '100%',
          }}
        >
          <Grid container>
            <Grid item xs></Grid>
            <Grid item>
              <Link
                onClick={() => {
                  history.push('/login')
                }}
                variant="body2"
              >
                ログインはこちら
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  )
}

export default Register
