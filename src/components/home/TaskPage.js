import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Select from 'react-select'
import { Fab, Container, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import AddIcon from '@mui/icons-material/Add'
import { createTask, updateTask, loadTasks } from 'modules/taskSlice'
import { loadProjects } from 'modules/projectSlice'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

// const schema = yup.object().shape({
//   projectName: yup.string().required('タスク名、タスク内容は必須です。'),
//   title: yup.string().required('タスク名、タスク内容は必須です。'),
//   description: yup.string().required('タスク名、タスク内容は必須です。'),
// })

export default function ProjectPage() {
  const dispatch = useDispatch()
  const projects = useSelector(state => state.project.list)
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const { control, handleSubmit, reset } = useForm({
    mode: 'onChange',
    // resolver: yupResolver(schema),
  })

  useEffect(() => {
    dispatch(loadTasks())
    dispatch(loadProjects())
  }, [])

  const onSubmit = data => {
    dispatch(
      createTask({ projectName: data.projectName.label, title: data.title, description: data.description })
    ).then(() => setOpen(false))
  }
  const handleNew = e => {
    reset({ projectName: '', title: '', description: '' })
    setSelected(null)
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }
  return (
    <Container maxWidth="lg">
      <Dialog fullWidth open={open} onClose={handleClose}>
        <DialogTitle>{selected ? 'タスク更新' : 'タスク登録'}</DialogTitle>
        <form style={{ width: '100%' }} onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Controller
              name="projectName"
              control={control}
              render={({ field }) => (
                //selectの指定に問題あり
                <Select
                  {...field}
                  defaultValue={{ label: 'プロジェクトの選択' }}
                  options={projects.map(project => {
                    return { value: project._id, label: project.name }
                  })}
                />
              )}
            />
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
