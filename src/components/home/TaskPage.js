// import React, { useState } from 'react'
// import { Box, Toolbar, Divider, IconButton, Container, Paper } from '@mui/material'
// import DeleteIcon from '@mui/icons-material/Delete'
// import { useSelector, useDispatch } from 'react-redux'

// export default function TaskPage() {
//   const dispatch = useDispatch()
//   const hospimaState = [
//     {
//       title: 'hospima',
//       description: 'texttexttext',
//       isComplete: false,
//     },
//   ]

//   const adjState = [
//     {
//       title: 'adj',
//       description: 'texttexttext',
//       isComplete: false,
//     },
//   ]

//   const nngState = [
//     {
//       title: 'nng',
//       description: 'texttexttext',
//       isComplete: false,
//     },
//   ]

//   const kdcState = [
//     {
//       title: 'kdc',
//       description: 'texttexttext',
//       isComplete: false,
//     },
//   ]

//   const [hospimaTodos, setHospimaTodos] = useState(hospimaState)
//   const [adjTodos, setAdjTodos] = useState(adjState)
//   const [nngTodos, setNngTodos] = useState(nngState)
//   const [kdcTodos, setKdcTodos] = useState(kdcState)
//   const [hospimaTask, setHospimaTask] = useState('')
//   const [adjTask, setAdjTask] = useState('')
//   const [nngTask, setNngTask] = useState('')
//   const [kdcTask, setKdcTask] = useState('')

//   return (
//     <Box
//       component="main"
//       sx={{
//         backgroundColor: theme => (theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900]),
//         flexGrow: 1,
//         height: '100vh',
//         overflow: 'auto',
//       }}
//     >
//       <Toolbar />
//       <Container maxWidth="md" sx={{ mt: 6, mb: 4 }}>
//         <Paper
//           sx={{
//             p: 2,
//             height: 400,
//             margin: 5,
//             position: 'relative',
//             justifyContent: 'center',
//           }}
//         >
//           <div style={{ textAlign: 'center', fontSize: 24 }}>title</div>
//           <Divider />
//           <div style={{ textAlign: 'center', fontSize: 24 }}>description</div>
//           <div
//             style={{
//               position: 'absolute',
//               bottom: '0',
//               width: '96%',
//               textAlign: 'center',
//             }}
//           >
//             <IconButton>
//               <DeleteIcon />
//             </IconButton>
//           </div>
//         </Paper>
//       </Container>
//     </Box>
//   )
// }
