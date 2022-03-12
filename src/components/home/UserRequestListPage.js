import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import dayjs from 'dayjs'
import Select from 'react-select'
import {
  Fab,
  Container,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  AccordionDetails,
  AccordionSummary,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  Accordion,
  Typography,
  CircularProgress,
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import PersonIcon from '@mui/icons-material/Person'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import EditIcon from '@mui/icons-material/Edit'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { loadUsers, removeUser, userRequest } from 'modules/authSlice'

const schema = yup.object().shape({
  name: yup.string().required('プロジェクト名は必須です。'),
})

export default function UserRequestListPage() {
  const dispatch = useDispatch()
  // const users = useSelector(state => state.auth.user)
  const users = useSelector(state => state.auth.users)
  const [open, setOpen] = useState(false)
  const [confirmDeletion, setConfirmDeletion] = useState(null)
  const [confirmPermit, setConfirmPermit] = useState(null)
  const [selected, setSelected] = useState(null)
  const { control, handleSubmit, reset } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  })

  const handleEdit = e => {
    reset({ name: e.name })
    setSelected(e)
    setOpen(true)
  }

  const handleNew = e => {
    reset({ name: '' })
    setSelected(null)
    setOpen(true)
  }
  const handleConfirmClose = () => {
    setConfirmDeletion(null)
  }

  const handleConfirmPermitClose = () => {
    setConfirmPermit(null)
  }
  const handleClose = () => {
    setOpen(false)
  }

  const handleDelete = () => {
    dispatch(removeUser(confirmDeletion)).then(() => setConfirmDeletion(null))
  }

  const handlePermit = () => {
    dispatch(userRequest(confirmPermit)).then(() => setConfirmPermit(null))
  }

  useEffect(() => {
    //loadingを入れる
    dispatch(loadUsers())
  }, [])

  return (
    <Container maxWidth="lg">
      <div
        style={{
          display: 'flex',
          transform: 'scale(2)',
          justifyContent: 'center',
          alignContent: 'center',
        }}
      >
        <CircularProgress size={24} />
      </div>
      <Paper>
        <List>
          {users.length === 0 && (
            <ListItem>
              <ListItemText primary={'登録されていません'} />
            </ListItem>
          )}
          {users.map(user => {
            return (
              <ListItem key={`user_${user._id}`} style={{ margin: 15, paddingRight: 30 }} disablePadding>
                <ListItemAvatar>
                  <Avatar style={{ background: '#ddd' }}>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={user.account} secondary={user._id} />
                {user.userRequest === true ? (
                  <ListItem style={{ textAlign: 'right' }}>
                    <ListItemText primary={'申請完了済'} />
                  </ListItem>
                ) : user.userRequest === false ? (
                  <div>
                    <Button
                      variant="contained"
                      role={undefined}
                      onClick={() => setConfirmPermit(user)}
                      style={{ backgroundColor: 'limegreen', fontWeight: 'bold', marginRight: 10 }}
                    >
                      承認
                    </Button>
                    <Button
                      variant="contained"
                      role={undefined}
                      onClick={() => setConfirmDeletion(user)}
                      style={{ backgroundColor: 'red', fontWeight: 'bold' }}
                    >
                      拒否
                    </Button>
                  </div>
                ) : (
                  <ListItem style={{ textAlign: 'right' }}>
                    <ListItemText primary={'未申請'} />
                  </ListItem>
                )}
              </ListItem>
            )
          })}
        </List>
      </Paper>
      <Dialog open={Boolean(confirmPermit)} onClose={handleConfirmPermitClose}>
        <DialogTitle>ユーザー申請を許可しますか？</DialogTitle>
        <DialogActions>
          <Button onClick={() => handleConfirmPermitClose()}>キャンセル</Button>
          <Button onClick={() => handlePermit()} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={Boolean(confirmDeletion)} onClose={handleConfirmClose}>
        <DialogTitle>このアカウントを削除しますか？</DialogTitle>
        <DialogActions>
          <Button onClick={() => handleConfirmClose()}>キャンセル</Button>
          <Button onClick={() => handleDelete()} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
