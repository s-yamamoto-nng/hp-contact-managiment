import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  Container,
  Fab,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Button,
  IconButton,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  ListItemButton,
  DialogContentText,
  Typography,
} from '@mui/material'
import Select from 'react-select'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import PersonIcon from '@mui/icons-material/Person'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { createChair, updateChair, removeChair, loadChairs } from 'modules/chairSlice'

const schema = yup.object().shape({
  name: yup.string().required('識別名は必須です。'),
  id: yup.string().required('管理IDは必須です。'),
})

export default function ChairPage() {
  const dispatch = useDispatch()
  const chairs = useSelector(state => state.chair.list)
  const [open, setOpen] = useState(false)
  const [confirmDeletion, setConfirmDeletion] = useState(null)
  const [selected, setSelected] = useState(null)

  const { handleSubmit, control, reset } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  })

  useEffect(() => {
    dispatch(loadChairs())
  }, [])

  const onSubmit = data => {
    if (selected) {
      dispatch(updateChair({ ...selected, name: data.name, id: data.id })).then(() =>
        setOpen(false)
      )
    } else {
      dispatch(createChair({ name: data.name, id: data.id })).then(() => setOpen(false))
    }
  }

  const handleEdit = e => {
    reset({ name: e.name, id: e.id })
    setSelected(e)
    setOpen(true)
  }

  const handleNew = () => {
    reset({ name: '', id: '' })
    setSelected(null)
    setOpen(true)
  }

  const handleConfirmClose = () => {
    setConfirmDeletion(null)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleDelete = () => {
    dispatch(removeChair(confirmDeletion)).then(() => setConfirmDeletion(null))
  }

  return (
    <Container maxWidth="lg">
      <Paper>
        <List>
          {chairs.length === 0 && (
            <ListItem>
              <ListItemText primary={'登録されていません'} />
            </ListItem>
          )}
          {chairs.map(chair => {
            return (
              <ListItem
                key={`chair_${chair._id}`}
                secondaryAction={
                  <IconButton edge="end" onClick={() => setConfirmDeletion(chair)}>
                    <DeleteIcon />
                  </IconButton>
                }
                disablePadding
              >
                <ListItemButton role={undefined} onClick={() => handleEdit(chair)} dense>
                  <ListItemAvatar>
                    <Avatar style={{ background: '#ddd' }}>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={chair.name} secondary={chair.id} />
                </ListItemButton>
              </ListItem>
            )
          })}
        </List>
      </Paper>
      <Dialog open={Boolean(confirmDeletion)} onClose={handleConfirmClose}>
        <DialogTitle>本当に削除しますか？</DialogTitle>
        <DialogActions>
          <Button onClick={() => handleConfirmClose()}>キャンセル</Button>
          <Button onClick={() => handleDelete()} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog fullWidth open={open} onClose={handleClose} style={{ overflowY: 'visible' }}>
        <DialogTitle>{selected ? 'チェアー更新' : 'チェアー登録'}</DialogTitle>
        <form style={{ width: '100%', overflowY: 'visible' }} onSubmit={handleSubmit(onSubmit)}>
          <DialogContent style={{ overflowY: 'visible' }}>
            <Controller
              name="id"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  margin="dense"
                  style={{ width: '100%' }}
                  label="管理ID"
                />
              )}
            />
            <Controller
              name="name"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  margin="dense"
                  style={{ width: '100%' }}
                  label="識別名"
                />
              )}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>キャンセル</Button>
            <Button type="submit">{selected ? '更新' : '登録'}</Button>
          </DialogActions>
        </form>
      </Dialog>
      <Fab
        color="primary"
        style={{ position: 'fixed', right: 32, bottom: 32 }}
        onClick={() => handleNew()}
      >
        <AddIcon />
      </Fab>
    </Container>
  )
}
