// import React, { useState, useEffect } from 'react'
// import { useSelector, useDispatch } from 'react-redux'
// import {
//   Container,
//   Fab,
//   Box,
//   List,
//   ListItem,
//   ListItemAvatar,
//   Avatar,
//   ListItemText,
//   Button,
//   IconButton,
//   TextField,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   Paper,
//   ListItemButton,
//   DialogContentText,
// } from '@mui/material'
// import DeleteIcon from '@mui/icons-material/Delete'
// import AddIcon from '@mui/icons-material/Add'
// import PersonIcon from '@mui/icons-material/Person'
// import { useForm, Controller } from 'react-hook-form'
// import { yupResolver } from '@hookform/resolvers/yup'
// import * as yup from 'yup'

// import { createStaff, updateStaff, removeStaff, loadStaffs } from 'modules/staffSlice'

// const schema = yup.object().shape({
//   name: yup.string().required('氏名は必須です。'),
// })

// export default function StaffPage() {
//   const dispatch = useDispatch()
//   const staffs = useSelector(state => state.staff.list)
//   const [open, setOpen] = useState(false)
//   const [confirmDeletion, setConfirmDeletion] = useState(null)
//   const [selected, setSelected] = useState(null)

//   const { handleSubmit, control, reset } = useForm({
//     mode: 'onChange',
//     resolver: yupResolver(schema),
//   })

//   useEffect(() => {
//     dispatch(loadStaffs())
//   }, [])

//   const onSubmit = data => {
//     if (selected) {
//       dispatch(updateStaff({ ...selected, name: data.name })).then(() => setOpen(false))
//     } else {
//       dispatch(createStaff({ name: data.name })).then(() => setOpen(false))
//     }
//   }

//   const handleEdit = e => {
//     reset({ name: e.name })
//     setSelected(e)
//     setOpen(true)
//   }

//   const handleNew = e => {
//     reset({ name: '' })
//     setSelected(null)
//     setOpen(true)
//   }

//   const handleConfirmClose = () => {
//     setConfirmDeletion(null)
//   }

//   const handleClose = () => {
//     setOpen(false)
//   }

//   const handleDelete = () => {
//     dispatch(removeStaff(confirmDeletion)).then(() => setConfirmDeletion(null))
//   }

//   return (
//     <Container maxWidth="lg">
//       <Paper>
//         <List>
//           {staffs.length === 0 && (
//             <ListItem>
//               <ListItemText primary={'登録されていません'} />
//             </ListItem>
//           )}
//           {staffs.map(staff => {
//             return (
//               <ListItem
//                 key={`user_${staff._id}`}
//                 secondaryAction={
//                   <IconButton edge="end" onClick={() => setConfirmDeletion(staff)}>
//                     <DeleteIcon />
//                   </IconButton>
//                 }
//                 disablePadding
//               >
//                 <ListItemButton role={undefined} onClick={() => handleEdit(staff)} dense>
//                   <ListItemAvatar>
//                     <Avatar style={{ background: '#ddd' }}>
//                       <PersonIcon />
//                     </Avatar>
//                   </ListItemAvatar>
//                   <ListItemText primary={staff.name} secondary={staff._id} />
//                 </ListItemButton>
//               </ListItem>
//             )
//           })}
//         </List>
//       </Paper>
//       <Dialog open={Boolean(confirmDeletion)} onClose={handleConfirmClose}>
//         <DialogTitle>本当に削除しますか？</DialogTitle>
//         <DialogActions>
//           <Button onClick={() => handleConfirmClose()}>キャンセル</Button>
//           <Button onClick={() => handleDelete()} color="primary">
//             OK
//           </Button>
//         </DialogActions>
//       </Dialog>
//       <Dialog fullWidth open={open} onClose={handleClose}>
//         <DialogTitle>{selected ? 'スタッフ更新' : 'スタッフ登録'}</DialogTitle>
//         <form style={{ width: '100%' }} onSubmit={handleSubmit(onSubmit)}>
//           <DialogContent>
//             <Controller
//               name="name"
//               control={control}
//               defaultValue=""
//               render={({ field }) => (
//                 <TextField
//                   {...field}
//                   required
//                   margin="dense"
//                   style={{ width: '100%' }}
//                   label="氏名"
//                 />
//               )}
//             />
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handleClose}>キャンセル</Button>
//             <Button type="submit">{selected ? '更新' : '登録'}</Button>
//           </DialogActions>
//         </form>
//       </Dialog>
//       <Fab
//         color="primary"
//         style={{ position: 'fixed', right: 32, bottom: 32 }}
//         onClick={() => handleNew()}
//       >
//         <AddIcon />
//       </Fab>
//     </Container>
//   )
// }
