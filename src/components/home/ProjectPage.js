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
  ListItem,
  ListItemText,
  Accordion,
  Typography,
  Checkbox,
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import EditIcon from '@mui/icons-material/Edit'
// import { fetchAsyncCreate, fetchAsyncDelete, fetchAsyncEdit, fetchAsyncLoadProject } from '../../modules/projectSlice'
import {
  createProject,
  updateProject,
  removeProject,
  loadProjects,
  // fetchAsyncCreate,
  // fetchAsyncLoadProject,
} from 'modules/projectSlice'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import task from '../../../www/models/task'

const schema = yup.object().shape({
  name: yup.string().required('プロジェクト名は必須です。'),
})

export default function ProjectPage() {
  const dispatch = useDispatch()
  const projects = useSelector(state => state.project.list)
  const tasks = useSelector(state => state.task.list)
  const user = useSelector(state => state.auth.user)
  // const task = useSelector(state => state.tasks.list)
  const [open, setOpen] = useState(false)
  const [confirmDeletion, setConfirmDeletion] = useState(null)
  // const [project, setProject] = useState(null)
  const [selected, setSelected] = useState(null)
  const { control, handleSubmit, reset } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  })

  useEffect(() => {
    // dispatch(fetchAsyncLoadProject())
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

  // const handleChangeProject = data => {
  //   setProject(data)
  // }

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
      <Paper style={{ padding: 50 }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Controller
            name="project"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                defaultValue={{ label: 'プロジェクトの選択' }}
                // onChange={e => }
                options={projects.map(project => {
                  return { value: project._id, label: project.name }
                })}
              />
            )}
          />
        </div>
      </Paper>
      {projects.length === 0 && (
        <Paper sx={{ padding: 5, marginTop: 10 }}>
          <ListItem>
            <ListItemText primary={'登録されていません'} />
          </ListItem>
        </Paper>
      )}
      <Paper style={{ marginTop: 30, padding: 20 }}>
        {tasks.map(task => {
          return (
            <>
              <div key={`project_${task._id}`} style={{ display: 'flex', marginTop: 30 }}>
                {/* <Checkbox /> */}
                <Accordion style={{ width: '100%' }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography style={{ width: '29%' }}>{project.name}</Typography>
                    <Typography style={{ width: '25%', whiteSpace: 'nowrap' }}>
                      登録日：{dayjs(project.createdAt).format('YYYY年MM月DD日')}
                    </Typography>
                    <Typography style={{ width: '25%', whiteSpace: 'nowrap' }}>
                      更新日：{dayjs(project.updatedAt).format('YYYY年MM月DD日')}
                    </Typography>
                    <Typography style={{ width: '21%', whiteSpace: 'nowrap' }}>登録者：{user.account}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>タスクの内容</Typography>
                  </AccordionDetails>
                </Accordion>
                <Button>
                  <EditIcon onClick={() => handleEdit(project)} />
                </Button>
                <Button onClick={() => setConfirmDeletion(project)}>
                  <DeleteIcon />
                </Button>
              </div>
            </>
          )
        })}
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
