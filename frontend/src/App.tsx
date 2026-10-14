import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

import { Button, createTheme, CssBaseline, ThemeProvider, Typography } from "@mui/material";
import PageLayout from './components/PageLayout'
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#DE00E5',
    },
    secondary: {
      main: '#5163CC',
    },
    background: {
      default: '#12121A',
      paper: '#1E1E2A',
    },
    text: {
      primary: '#F5F5FA',
      secondary: '#B0B0C0',
    },
  },

  typography: {
    fontFamily: 'Arial, sans-serif',
    h4: {
      fontWeight: 700,
    },
  },

  shape: {
    borderRadius: 12,
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});

function App() {
  const [count, setCount] = useState(0)
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  async function comprobarBackend() {
    setCargando(true);
    setMensaje('');

    try {
      const respuesta = await fetch('/api/health');

      if (!respuesta.ok) {
        throw new Error(`Error HTTP ${respuesta.status}`);
      }

      const datos: { message: string } = await respuesta.json();

      setMensaje(datos.message);
    } catch (error) {
      console.error(error);
      setMensaje('No se pudo conectar con el backend');
    } finally {
      setCargando(false);
    }
  }


  return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
            <div className='app'>
                <PageLayout title='MyMys'>
                    <Typography variant='h4' component="div" sx={{ flexGrow: 1, alignContent: "center" }}> MyMysages App</Typography>
                     <Button
                      variant="contained"
                      onClick={comprobarBackend}
                      disabled={cargando}
                    >
                      {cargando ? 'Conectando…' : 'Comprobar backend'}
                    </Button>

                    <Typography sx={{ marginTop: 2 }} role="status">
                      {mensaje}
                    </Typography>
                </PageLayout>
            </div>
    </ThemeProvider>
  )
}

export default App
