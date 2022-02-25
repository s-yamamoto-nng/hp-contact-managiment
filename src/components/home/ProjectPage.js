import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Select from 'react-select'
import {
  Fab,
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
import AddIcon from '@mui/icons-material/Add'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { fetchAsyncCreate, fetchAsyncDelete, fetchAsyncEdit } from '../../modules/projectSlice'

export default function ProjectPage() {
  const dispatch = useDispatch()
  const projects = useSelector(state => state.project.list)
  const [open, setOpen] = useState(false)
  const [confirmDeletion, setConfirmDeletion] = useState(null)
  const [selected, setSelected] = useState(null)
  const { control, handleSubmit } = useForm({
    mode: 'onChange',
  })
  const onSubmit = data => {
    if (selected) {
      dispatch(fetchAsyncEdit({ ...selected, name: data.name })).then(() => setOpen(false))
    } else {
      dispatch(fetchAsyncCreate({ name: data.name })).then(() => setOpen(false))
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
    dispatch(fetchAsyncDelete(confirmDeletion)).then(() => setConfirmDeletion(null))
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Paper style={{ padding: 50 }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Controller
            name="project"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                defaultValue={{ label: 'プロジェクトの選択' }}
                options={[
                  { value: 'nngHp', label: 'NNG HP' },
                  { value: 'hospimaHp', label: 'HOSPIMA HP' },
                  { value: 'adjHp', label: 'ADJ HP' },
                  { value: 'adjSalon', label: 'ADJ SALON' },
                  { value: 'kdchp', label: 'KDC HP' },
                ]}
              />
            )}
          />
          <Button type="submit" variant="contained" style={{ marginLeft: 10 }}>
            表示
          </Button>
        </div>
      </Paper>
      {projects.length === 0 && (
        <Paper sx={{ padding: 5, marginTop: 10 }}>
          <ListItem>
            <ListItemText primary={'登録されていません'} />
          </ListItem>
        </Paper>
      )}
      {/* <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>タスクタイトル</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>タスクの内容</Typography>
        </AccordionDetails>
      </Accordion> */}
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
                <TextField {...field} required margin="dense" style={{ width: '100%' }} label="氏名" />
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
    </form>
  )
}
