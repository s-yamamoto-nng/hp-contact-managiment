import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { store } from 'modules/store'
import App from 'components/App'

const theme = createTheme({
  typography: {
    useNextVariants: true,
    button: {
      textTransform: 'none',
    },
  },
  props: {
    MuiList: {
      dense: true,
    },
    MuiTable: {
      size: 'small',
    },
    MuiTextField: {
      variant: 'outlined',
    },
  },
  palette: {
    primary: {
      main: '#263238',
    },
    secondary: {
      main: '#263238',
    },
  },
  overrides: {
    MuiTableCell: {
      root: {
        paddingTop: 4,
        paddingBottom: 4,
        '&:last-child': {
          paddingRight: 5,
        },
      },
    },
  },
})

ReactDOM.render(
    <ThemeProvider theme={theme}>
      <Provider store={store}>
      <App />
      </Provider>
    </ThemeProvider>,
  document.getElementById('root')
)
