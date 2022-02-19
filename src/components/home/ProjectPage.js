// import React, { useState } from 'react'
// import { useDispatch } from 'react-redux'
// import { useForm, Controller } from 'react-hook-form'
// import Select from 'react-select'
// import Button from '@mui/material/Button'
// //project用にSlice関数ファイルの作成
// // import { readProject } from 'modules/projectSlice'

// export default function ProjectPage() {
//   const dispatch = useDispatch()
//   const [projectName, setProjectName] = useState(null)
//   // const [open, setOpen] = useState(false)
//   const { control, handleSubmit } = useForm({
//     mode: 'onChange',
//   })

//   //決定押下後、画面切り替え
//   const onSubmit = data => {
//     if (data.project) {
//       const model = {
//         project: data.project.value,
//       }
//       // dispatch(readProject(model)).then(() => setOpen(true))
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit(onSubmit)}>
//       <div style={{ width: 250, marginLeft: 450 }}>
//         <Controller
//           name="project"
//           control={control}
//           render={({ field }) => (
//             <Select
//               {...field}
//               // onChange={e => projectNameChange(e)}
//               defaultValue={{ label: 'プロジェクトの選択' }}
//               options={[
//                 { value: 'nngHp', label: 'NNG HP' },
//                 { value: 'hospimaHp', label: 'HOSPIMA HP' },
//                 { value: 'adjHp', label: 'ADJ HP' },
//                 { value: 'adjSalon', label: 'ADJ SALON' },
//                 { value: 'kdchp', label: 'KDC HP' },
//               ]}
//             />
//           )}
//         />
//       </div>
//       <div style={{ textAlign: 'center', marginTop: 10 }}>
//         <Button type="submit" variant="contained">
//           決定
//         </Button>
//       </div>
//     </form>
//   )
// }
