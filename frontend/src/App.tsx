import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

import { Button, Container, createTheme, CssBaseline, Stack, ThemeProvider, Typography } from "@mui/material";
import PageLayout from './components/PageLayout'
import UserList from './components/UserList'
import Login from './components/Login'
import Register from './components/Register';
import UserSearch from './components/UserSearch'
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
  const [token, setToken] = useState<string | null>(null);

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
             <Container maxWidth="sm" sx={{ py: 4 }}>
                <PageLayout title='MyMys'>
                  <Stack spacing={3}>
                    <Typography variant='h4' component="div" sx={{ flexGrow: 1, alignContent: "center" }}> MyMyssages App</Typography>
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
                    
                    {token ? (
                      <>
                        <UserSearch
                          token={token}
                          onSelect={(user) => {
                            console.log("Selected user:", user);
                            // Open their profile or conversation here.
                          }}
                        />
                        <Button onClick={() => setToken(null)}>
                          Cerrar sesión
                        </Button>

                        <UserList token={token} />
                      </>
                    ) : (
                      <Stack direction={{xs:'column', sm:'row' }} spacing={4} sx={{ alignItems: 'flex-start' }}>
                         <Stack spacing={2} sx={{ flex: 1, minWidth: 0, width: '100%' }}>
                      <Register onLogin={setToken} />
                         </Stack>
                      <Stack spacing={2} sx={{ flex: 1, minWidth: 0, width: '100%' }}>
                      <Login onLogin={setToken} />
                         </Stack>
                      </Stack>
                    )}
                    </Stack>
                </PageLayout>
            </Container>
    </ThemeProvider>
  )
}

export default App
