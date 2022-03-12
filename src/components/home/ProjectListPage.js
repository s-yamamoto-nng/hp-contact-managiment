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
import ArticleIcon from '@mui/icons-material/Article'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import EditIcon from '@mui/icons-material/Edit'
import { loadProjects, createProject, removeProject, updateProject } from 'modules/projectSlice'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

const schema = yup.object().shape({
  name: yup.string().required('プロジェクト名は必須です。'),
})

export default function ProjectListPage() {
  const dispatch = useDispatch()
  const projects = useSelector(state => state.project.list)
  const [open, setOpen] = useState(false)
  const [confirmDeletion, setConfirmDeletion] = useState(null)
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(null)
  const { control, handleSubmit, reset } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  })

  useEffect(() => {
    dispatch(loadProjects())
  }, [])

  const onSubmit = data => {
    if (selected) {
      dispatch(updateProject({ ...selected, name: data.name })).then(() => setOpen(false))
    } else {
      dispatch(createProject({ name: data.name })).then(() => setOpen(false))
    }
  }
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
  const handleClose = () => {
    setOpen(false)
  }
  const handleDelete = () => {
    dispatch(removeProject(confirmDeletion)).then(() => setConfirmDeletion(null))
  }

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
          {projects.length === 0 && (
            <ListItem>
              <ListItemText primary={'登録されていません'} />
            </ListItem>
          )}
          {projects.map(project => {
            return (
              <ListItem
                key={`project_${project._id}`}
                secondaryAction={
                  <IconButton edge="end" onClick={() => setConfirmDeletion(project)}>
                    <DeleteIcon />
                  </IconButton>
                }
                disablePadding
              >
                <ListItemButton role={undefined} onClick={() => handleEdit(project)} dense>
                  <ListItemAvatar>
                    <ArticleIcon style={{ transform: 'scale(1.5)', marginTop: 5 }}>
                      <PersonIcon />
                    </ArticleIcon>
                  </ListItemAvatar>
                  <ListItemText primary={project.name} />
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
      <Dialog fullWidth open={open} onClose={handleClose}>
        <DialogTitle>{selected ? 'プロジェクト更新' : 'プロジェクト登録'}</DialogTitle>
        <form style={{ width: '100%' }} onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Controller
              name="name"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField {...field} required margin="dense" style={{ width: '100%' }} label="プロジェクト名" />
              )}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>キャンセル</Button>
            <Button type="submit">{selected ? '更新' : '登録'}</Button>
          </DialogActions>
        </form>
      </Dialog>
      <Fab color="primary" style={{ position: 'fixed', right: 32, bottom: 32 }} onClick={() => handleNew()}>
        <AddIcon />
      </Fab>
    </Container>
  )
}
