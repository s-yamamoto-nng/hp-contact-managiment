import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import dayjs from 'dayjs'
import Select from 'react-select'
import {
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
  Divider,
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import DeleteIcon from '@mui/icons-material/Delete'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import EditIcon from '@mui/icons-material/Edit'
import { loadProjects } from 'modules/projectSlice'
import { loadTasks, removeTask, updateTask, readFlgTask } from 'modules/taskSlice'
import MarkChatReadIcon from '@mui/icons-material/MarkChatRead'
// import { yupResolver } from '@hookform/resolvers/yup'
// import * as yup from 'yup'

// const schema = yup.object().shape({
//   name: yup.string().required('プロジェクト名は必須です。'),
// })

export default function ProjectPage() {
  const dispatch = useDispatch()
  const projects = useSelector(state => state.project.list)
  const tasks = useSelector(state => state.task.list)
  const users = useSelector(state => state.auth.user)
  const [open, setOpen] = useState(false)
  const [confirmDeletion, setConfirmDeletion] = useState(null)
  const [selected, setSelected] = useState(null)
  const { control, handleSubmit, reset } = useForm({
    mode: 'onChange',
    // resolver: yupResolver(schema),
  })
  const [selectProject, setSelectProject] = useState(null)
  const taskProjectNumber = tasks.filter(task => task.projectName === selectProject)
  useEffect(() => {
    dispatch(loadProjects())
    dispatch(loadTasks())
  }, [])

  const onSubmit = data => {
    dispatch(updateTask({ ...selected, title: data.title, description: data.description })).then(() => setOpen(false))
  }
  const handleEdit = e => {
    reset({ title: e.title, description: e.description })
    setSelected(e)
    setOpen(true)
  }
  const handleConfirmClose = () => {
    setConfirmDeletion(null)
  }
  const handleClose = () => {
    setOpen(false)
  }
  const handleDelete = () => {
    dispatch(removeTask(confirmDeletion)).then(() => setConfirmDeletion(null))
  }
  const handleChangeProject = data => {
    setSelectProject(data.label)
  }

  const handleReadFlg = data => {
    dispatch(readFlgTask(data)).then(() => dispatch(loadTasks()))
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
                options={projects.map(project => {
                  return { value: project._id, label: project.name }
                })}
                onChange={e => handleChangeProject(e)}
              />
            )}
          />
        </div>
      </Paper>
      {tasks.length === 0 ? (
        <Paper sx={{ padding: 5, marginTop: 10 }}>
          <ListItem>
            <ListItemText primary={'登録されておりません'} />
          </ListItem>
        </Paper>
      ) : taskProjectNumber.length !== 0 && selectProject !== null ? (
        <div>
          {tasks.map(task => {
            return (
              <div key={`task_${task._id}`}>
                {task.projectName === selectProject && task.deleteFlg !== true && (
                  <Paper style={{ marginTop: 30, padding: 20 }}>
                    <div style={{ display: 'flex', marginTop: 30 }}>
                      <Accordion style={{ width: '100%' }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography style={{ width: '29%' }}>{task.title}</Typography>
                          <Typography style={{ width: '25%', whiteSpace: 'nowrap' }}>
                            登録日：{dayjs(task.createdAt).format('YYYY年MM月DD日')}
                          </Typography>
                          <Typography style={{ width: '25%', whiteSpace: 'nowrap' }}>
                            更新日：{dayjs(task.updatedAt).format('YYYY年MM月DD日')}
                          </Typography>
                          <Typography style={{ width: '21%', whiteSpace: 'nowrap' }}>登録者：{task.account}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography>{task.description}</Typography>
                        </AccordionDetails>
                        <Divider />
                        <Button
                          variant="contained"
                          endIcon={<MarkChatReadIcon />}
                          onClick={() => handleReadFlg(task)}
                          style={{
                            display: 'flex',
                            margin: '0 auto',
                            marginTop: 20,
                            marginBottom: 20,
                            background: '#3ea8ff',
                            fontWeight: 'bold',
                          }}
                        >
                          {task.readFlg ? '既読' : '未読'}
                        </Button>
                      </Accordion>
                      {task.account === users.account && (
                        <>
                          <Button>
                            <EditIcon onClick={() => handleEdit(task)} />
                          </Button>
                          <Button onClick={() => setConfirmDeletion(task)}>
                            <DeleteIcon />
                          </Button>
                        </>
                      )}
                    </div>
                  </Paper>
                )}
              </div>
            )
          })}
        </div>
      ) : tasks.length !== 0 && selectProject === null ? (
        <Paper sx={{ padding: 5, marginTop: 3.9 }}>
          <ListItem>
            <ListItemText primary={'プロジェクトを選択してください'} />
          </ListItem>
        </Paper>
      ) : (
        <Paper sx={{ padding: 5, marginTop: 3.9 }}>
          <ListItem>
            <ListItemText primary={'登録されておりません'} />
          </ListItem>
        </Paper>
      )}
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
        <DialogTitle>タスク編集</DialogTitle>
        <form style={{ width: '100%' }} onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Controller
              name="title"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField {...field} required margin="dense" style={{ width: '100%' }} label="タイトル" />
              )}
            />
            <Controller
              name="description"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  margin="dense"
                  style={{ width: '100%' }}
                  label="タスク内容"
                  multiline
                  rows={10}
                />
              )}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>キャンセル</Button>
            <Button type="submit">更新</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  )
}
