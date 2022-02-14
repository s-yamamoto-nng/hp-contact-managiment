import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { BrowserRouter } from 'react-router-dom'

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
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
