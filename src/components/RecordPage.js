import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Container, Button, TextField, Paper, Snackbar } from '@mui/material'
import Select from 'react-select'
import { useForm, Controller } from 'react-hook-form'
import SaveIcon from '@mui/icons-material/Save'
import SendIcon from '@mui/icons-material/Send'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { loadStaffs } from 'modules/staffSlice'
import { loadChairs } from 'modules/chairSlice'
import { createRecord, findOneRecord } from 'modules/recordSlice'

const schema = yup.object().shape({
  name: yup.string().required('識別名は必須です。'),
})

export default function RecordPage() {
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)
  const [staff, setStaff] = useState(null)
  const [memory, setMemory] = useState(null)
  const staffs = useSelector(state => state.staff.list)
  const chairs = useSelector(state => state.chair.list)

  useEffect(() => {
    dispatch(loadStaffs())
    dispatch(loadChairs())
  }, [])

  const { handleSubmit, control, reset, watch } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  })

  const onSubmit = data => {
    if (data.staff && data.memory && data.chair) {
      const model = {
        name: data.name,
        staff: data.staff.value,
        memory: data.memory.value,
        chair: data.chair.value,
      }
      dispatch(createRecord(model)).then(() => setOpen(true))
    }
  }

  const handleChangeStaff = data => {
    setStaff(data)
  }

  const handleChangeMemory = e => {
    setMemory(e)
    if (staff) {
      const model = {
        staff: staff.value,
        memory: e.value,
      }
      dispatch(findOneRecord(model)).then(data => {
        if (data) {
          reset({
            name: data.name,
            memory: e,
            staff: staff,
          })
        } else {
          reset({
            name: '',
            memory: e,
            staff: staff,
          })
        }
      })
    }
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpen(false)
  }

  return (
    <Container maxWidth="lg">
      <form style={{ overflowY: 'visible' }} onSubmit={handleSubmit(onSubmit)}>
        <div style={{ display: 'flex' }}>
          <div style={{ width: 210 }}>
            <Controller
              name="staff"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  onChange={e => handleChangeStaff(e)}
                  options={staffs.map(temp => {
                    return { value: temp._id, label: temp.name }
                  })}
                />
              )}
            />
          </div>

          <div style={{ width: 210, marginLeft: 12 }}>
            <Controller
              name="memory"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  onChange={e => handleChangeMemory(e)}
                  options={[
                    { value: 'memory1', label: 'メモリー１' },
                    { value: 'memory2', label: 'メモリー２' },
                    { value: 'memory3', label: 'メモリー３' },
                    { value: 'memory4', label: 'メモリー４' },
                    { value: 'memory5', label: 'メモリー５' },
                  ]}
                />
              )}
            />
          </div>
        </div>

        <Paper style={{ marginTop: 12, marginBottom: 12, padding: 12 }}>
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
                label="データ１"
              />
            )}
          />
        </Paper>
        <div style={{ display: 'flex' }}>
          <div style={{ width: 210 }}>
            <Controller
              name="chair"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={chairs.map(temp => {
                    return { value: temp._id, label: temp.name }
                  })}
                />
              )}
            />
          </div>

          <div style={{ width: 210, marginLeft: 12 }}>
            <Button type="submit" variant="contained" startIcon={<SendIcon />}>
              保存して送信
            </Button>
          </div>
        </div>
      </form>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        message="登録して送信しました"
      />
    </Container>
  )
}
