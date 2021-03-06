import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Route, Redirect, Switch, useHistory, Link } from 'react-router-dom'
import { styled } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import MuiDrawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import MuiAppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Container from '@mui/material/Container'
import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import List from '@mui/material/List'
import Button from '@mui/material/Button'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ProjectPage from './ProjectPage'
import TaskPage from './TaskPage'
import GroupIcon from '@mui/icons-material/Group'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { logout } from '../../modules/authSlice'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import AddTaskIcon from '@mui/icons-material/AddTask'
import TaskIcon from '@mui/icons-material/Task'
import ProjectListPage from './ProjectListPage'
import UserRequestListPage from './UserRequestListPage'

const drawerWidth = 240

const Drawer = styled(MuiDrawer, { shouldForwardProp: prop => prop !== 'open' })(({ theme, open }) => ({
  '& .MuiDrawer-paper': {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: 'border-box',
    ...(!open && {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9),
      },
    }),
  },
}))

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: prop => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}))

export default function Layout() {
  const users = useSelector(state => state.auth.user)
  const dispatch = useDispatch()
  const history = useHistory()

  const [open, setOpen] = React.useState(true)
  const toggleDrawer = () => {
    setOpen(!open)
  }

  const handleLogout = () => {
    dispatch(logout())
    history.push('/')
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="absolute" open={open}>
        <Toolbar
          sx={{
            pr: '24px',
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{
              marginRight: '36px',
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
            ???????????????????????????
          </Typography>
          <PersonOutlineIcon sx={{ marginRight: 0.8, marginTop: 0.5 }} />
          <Typography component="h1" variant="h6" color="inherit" sx={{ marginRight: 1 }}>
            {users.account}??????
          </Typography>
          {users && (
            <Button color="inherit" onClick={() => handleLogout()}>
              ???????????????
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            px: [1],
          }}
        >
          <IconButton onClick={toggleDrawer}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <Divider />
        <List>
          <ListItem button component={Link} to="/project">
            <ListItemIcon>
              <TaskIcon />
            </ListItemIcon>
            <ListItemText primary="???????????????" />
          </ListItem>
          <ListItem button component={Link} to="/task">
            <ListItemIcon>
              <AddTaskIcon />
            </ListItemIcon>
            <ListItemText primary="???????????????" />
          </ListItem>
          {users.account === 's.yamamoto' && (
            <div>
              <Divider />
              <ListItem button component={Link} to="/projectList">
                <ListItemIcon>
                  <GroupIcon />
                </ListItemIcon>
                <ListItemText primary="????????????????????????" />
              </ListItem>
              <ListItem button component={Link} to="/userRequestList">
                <ListItemIcon>
                  <PersonAddIcon />
                </ListItemIcon>
                <ListItemText primary="????????????????????????" />
              </ListItem>
            </div>
          )}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          backgroundColor: theme =>
            theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Switch>
            <Route path="/project" component={ProjectPage} />
            <Route path="/task" component={TaskPage} />
            <Route path="/projectList" component={ProjectListPage} />
            <Route path="/userRequestList" component={UserRequestListPage} />
          </Switch>
        </Container>
      </Box>
    </Box>
  )
}
