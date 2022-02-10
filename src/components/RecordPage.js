import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Container, Button, Typography, Paper, Snackbar } from '@mui/material'
import Select from 'react-select'
import { useForm, Controller } from 'react-hook-form'
import SaveIcon from '@mui/icons-material/Save'
import SendIcon from '@mui/icons-material/Send'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { loadStaffs } from 'modules/staffSlice'
import { loadChairs } from 'modules/chairSlice'
import { createRecord, findOneRecord } from 'modules/recordSlice'

import InputField from './lib/InputField'
import SelectField from './lib/SelectField'

const schema = yup.object().shape({
  // name_d1: yup.string().required('歯科医師名1'),
})

const options1 = [
  { name: 'on', value: 'on' },
  { name: 'off', value: 'off' },
]

const options2 = [
  { name: 'on', value: 'on' },
  { name: 'off', value: 'off' },
  { name: 'foot', value: 'foot' },
]

const options3 = [
  { name: 'on', value: 'on' },
  { name: 'off', value: 'off' },
  { name: 'foot', value: 'foot' },
  { name: 'blow', value: 'blow' },
]

const options4 = [
  { name: 'high', value: 'high' },
  { name: 'low', value: 'low' },
]

export default function RecordPage() {
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)
  const [staff, setStaff] = useState(null)
  const [memory, setMemory] = useState(null)
  const [show, setShow] = useState(false)
  const staffs = useSelector(state => state.staff.list)
  const chairs = useSelector(state => state.chair.list)

  useEffect(() => {
    dispatch(loadStaffs())
    dispatch(loadChairs())
  }, [])

  const { register, handleSubmit, control, reset, watch } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  })

  const onSubmit = data => {
    if (data.staff && data.memory && data.chair) {
      const model = {
        staff: data.staff.value,
        memory: data.memory.value,
        chair: data.chair.value,
        name_d1: data.name_d1,
        name_d2: data.name_d2,
        name_h1: data.name_h1,
        name_h2: data.name_h2,
        name_a1: data.name_a1,
        name_a2: data.name_a2,
        chair_height_a1: data.chair_height_a1,
        chair_angle_a1: data.chair_angle_a1,
        chair_tilt_a1: data.chair_tilt_a1,
        chair_height_m1: data.chair_height_m1,
        chair_angle_m1: data.chair_angle_m1,
        chair_tilt_m1: data.chair_tilt_m1,
        chair_height_m2: data.chair_height_m2,
        chair_angle_m2: data.chair_angle_m2,
        chair_tilt_m2: data.chair_tilt_m2,
        turbine_X_light: data.turbine_X_light,
        turbine_X_spray: data.turbine_X_spray,
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
      setShow(true)
      const model = {
        staff: staff.value,
        memory: e.value,
      }
      dispatch(findOneRecord(model)).then(data => {
        if (data) {
          reset({
            memory: e,
            staff: staff,
            name_d1: data.name_d1,
            name_d2: data.name_d2,
            name_h1: data.name_h1,
            name_h2: data.name_h2,
            name_a1: data.name_a1,
            name_a2: data.name_a2,
            chair_height_a1: data.chair_height_a1,
            chair_angle_a1: data.chair_angle_a1,
            chair_tilt_a1: data.chair_tilt_a1,
            chair_height_m1: data.chair_height_m1,
            chair_angle_m1: data.chair_angle_m1,
            chair_tilt_m1: data.chair_tilt_m1,
            chair_height_m2: data.chair_height_m2,
            chair_angle_m2: data.chair_angle_m2,
            chair_tilt_m2: data.chair_tilt_m2,
            turbine_X_light: data.turbine_X_light,
            turbine_X_spray: data.turbine_X_spray,
          })
        } else {
          reset({
            memory: e,
            staff: staff,
            name_d1: '',
            name_d2: '',
            name_h1: '',
            name_h2: '',
            name_a1: '',
            name_a2: '',
            chair_height_a1: '',
            chair_angle_a1: '',
            chair_tilt_a1: '',
            chair_height_m1: '',
            chair_angle_m1: '',
            chair_tilt_m1: '',
            chair_height_m2: '',
            chair_angle_m2: '',
            chair_tilt_m2: '',
            turbine_X_light: '',
            turbine_X_spray: '',
          })
        }
      })
    } else {
      setShow(false)
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

        {show && (
          <Paper style={{ marginTop: 12, marginBottom: 12, padding: 12 }}>
            <Typography color="primary" style={{ marginTop: 12 }}>
              【基本情報】
            </Typography>
            <div style={{ display: 'flex' }}>
              <InputField title={'歯科医師名1'} register={register('name_d1')} />
              <InputField title={'歯科医師名2'} register={register('name_d2')} />
              <InputField title={'歯科衛生士名1'} register={register('name_h1')} />
              <InputField title={'歯科衛生士名2'} register={register('name_h2')} />
            </div>
            <div style={{ display: 'flex', marginTop: 4 }}>
              <InputField title={'歯科助手名1'} register={register('name_a1')} />
              <InputField title={'歯科助手名2'} register={register('name_a2')} />
            </div>

            <Typography color="primary" style={{ marginTop: 12 }}>
              【イス】
            </Typography>

            <div style={{ display: 'flex' }}>
              <InputField title={'A1での椅子の高さ'} register={register('chair_height_a1')} />
              <InputField title={'A1での椅子の角度'} register={register('chair_angle_a1')} />
              <InputField title={'A1での椅子のチルト'} register={register('chair_tilt_a1')} />
              <InputField title={'M1での椅子の高さ'} register={register('chair_height_m1')} />
            </div>

            <div style={{ display: 'flex', marginTop: 4 }}>
              <InputField title={'M1での椅子の角度'} register={register('chair_angle_m1')} />
              <InputField title={'M1での椅子のチルト'} register={register('chair_tilt_m1')} />
              <InputField title={'M2での椅子の高さ'} register={register('chair_height_m2')} />
              <InputField title={'M2での椅子の角度'} register={register('chair_angle_m2')} />
            </div>

            <div style={{ display: 'flex', marginTop: 4 }}>
              <InputField title={'M2での椅子のチルト'} register={register('chair_tilt_m2')} />
            </div>

            <Typography color="primary" style={{ marginTop: 12 }}>
              【タービン】
            </Typography>

            <div style={{ display: 'flex' }}>
              <SelectField title={'ライトの設定'} options={options1} register={register('turbine_X_light')} />
              <SelectField title={'スプレーの設定'} options={options2} register={register('turbine_X_spray')} />
            </div>

            <Typography color="primary" style={{ marginTop: 12 }}>
              【モーター】
            </Typography>

            <div style={{ display: 'flex' }}>
              <SelectField title={'ライトの設定'} options={options1} register={register('motor_X_light')} />
              <SelectField title={'スプレーの設定'} options={options3} register={register('motor_X_spray')} />
              <SelectField title={'動作モードの設定'} options={options1} register={register('motor_X_motion')} />
              <SelectField title={'動作モードがFREE時の回転域'} options={options1} register={register('motor_X_free_mode')} />
            </div>
            <div style={{ display: 'flex', marginTop: 4 }}>
              <SelectField title={'動作モードがM1時の回転域'} options={options1} register={register('motor_X_mode_m1')} />
              <SelectField title={'動作モードがM1時の回転数'} options={options1} register={register('motor_X_speed_m1')} />
              <SelectField title={'動作モードがM2時の回転域'} options={options1} register={register('motor_X_mode_m2')} />
              <SelectField title={'動作モードがM2時の回転数'} options={options1} register={register('motor_X_speed_m2')} />
            </div>
            <div style={{ display: 'flex', marginTop: 4 }}>
              <SelectField title={'動作モードがM3時の回転域'} options={options1} register={register('motor_X_mode_m3')} />
              <SelectField title={'動作モードがM3時の回転数'} options={options1} register={register('motor_X_speed_m3')} />
              <SelectField title={'ME トルク設定（Low時）'} options={options1} register={register('motor_X_torque_low')} />
            </div>

            <Typography color="primary" style={{ marginTop: 12 }}>
              【エナック】
            </Typography>

            <div style={{ display: 'flex' }}>
              <SelectField title={'ライトの設定'} options={options1} register={register('enac_X_light')} />
              <SelectField title={'スプレーの設定'} options={options3} register={register('enac_X_spray')} />
              <SelectField title={'動作モードの設定'} options={options1} register={register('enac_X_motion')} />
              <SelectField title={'動作モードがFREE時のパワー'} options={options1} register={register('enac_X_free')} />
              <SelectField title={'動作モードがM1時のパワー'} options={options1} register={register('enac_X_m1')} />
              <SelectField title={'動作モードがM2時のパワー'} options={options1} register={register('enac_X_m2')} />
              <SelectField title={'動作モードがM3時のパワー'} options={options1} register={register('enac_X_m3')} />
            </div>

            <Typography color="primary" style={{ marginTop: 12 }}>
              【ヘッドレスト】
            </Typography>

            <div style={{ display: 'flex' }}>
              <SelectField title={'ヘッドレストの角度'} options={options1} register={register('headrest_angle')} />
            </div>

            <Typography color="primary" style={{ marginTop: 12 }}>
              【ユニット】
            </Typography>

            <div style={{ display: 'flex' }}>
              <SelectField title={'M&Aを押したときの初期動作'} options={options1} register={register('chair_action_Initial')} />
            </div>

            <Typography color="primary" style={{ marginTop: 12 }}>
              【タービン】
            </Typography>

            <div style={{ display: 'flex' }}>
              <SelectField title={'M&エアーフラッシングの時間'} options={options1} register={register('turbine_afcs')} />
              <SelectField title={'M&タービンを戻した際のスプレー設定'} options={options1} register={register('turbine_return_spray')} />
              <SelectField title={'M&タービンを戻した際のビューライト設定'} options={options1} register={register('turbine_return_light')} />
            </div>

            <Typography color="primary" style={{ marginTop: 12 }}>
              【モーター】
            </Typography>

            <div style={{ display: 'flex' }}>
              <SelectField title={'モーターを戻した際の動作設定をどうするか'} options={options1} register={register('motor_return_memory')} />
              <SelectField title={'モーターを戻した際のスプレー設定'} options={options1} register={register('motor_return_spray')} />
              <SelectField title={'モーターを戻した際のビューライト設定'} options={options1} register={register('motor_return_light')} />
              <SelectField title={'マイクロモーター回転特性'} options={options1} register={register('motor_rotate_characteristic')} />
            </div>

            <Typography color="primary" style={{ marginTop: 12 }}>
              【エナック】
            </Typography>

            <div style={{ display: 'flex' }}>
              <SelectField title={'エナックを戻した際のスプレー設定'} options={options1} register={register('enac_return_spray')} />
              <SelectField title={'エナックを戻した際のビューライト設定'} options={options1} register={register('enac_return_light')} />
            </div>

            <Typography color="primary" style={{ marginTop: 12 }}>
              【口腔外バキューム】
            </Typography>

            <div style={{ display: 'flex' }}>
              <SelectField title={'インスツルメントと口腔外バキュームの連動　ON/OFF'} options={options1} register={register('extraoralvacuum_Interlock')} />
            </div>

            <Typography color="primary" style={{ marginTop: 12 }}>
              【ユニット】
            </Typography>

            <div style={{ display: 'flex' }}>
              <SelectField title={'オートオフ時間(min)'} options={options1} register={register('unit_auto_off')} />
              <SelectField title={'鉢洗い吐水時間(コップ給水時）'} options={options1} register={register('unit_pot_wash_time')} />
              <SelectField title={'噴水吐水時間(椅子洗口位置移動時）'} options={options1} register={register('unit_fountain_time')} />
              <SelectField title={'鉢洗いSW連動(SWオン後30秒後に鉢洗い水停止）'} options={options1} register={register('unit_pot_wash_Initial')} />
              <SelectField title={'自動排水時間'} options={options1} register={register('unit_drainage_time')} />
            </div>

            <Typography color="primary" style={{ marginTop: 12 }}>
              【無影灯設定】
            </Typography>

            <div style={{ display: 'flex' }}>
              <SelectField title={'自動点灯/消灯(椅子オート動作時)'} options={options1} register={register('surgicallight_auto')} />
              <SelectField title={'アーム下降時間'} options={options1} register={register('surgicallight_descent _time')} />
              <SelectField title={'アーム自動跳上げ'} options={options1} register={register('surgicallight_automatic_rise')} />
            </div>
          </Paper>
        )}

        <br />

        <div style={{ display: 'flex' }}>
          <div style={{ width: 210 }}>
            <Controller
              name="chair"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  TextFieldProps={{
                    label: '対象のチェアー',
                  }}
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
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose} message="登録して送信しました" />
    </Container>
  )
}
