import { useState } from 'react';
import type { FormEvent } from 'react';
import { Alert, Button, Stack, TextField } from '@mui/material';

interface LoginProps {
  onLogin: (token: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); // Evita que el formulario recargue la página.
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error(
          response.status === 401
            ? 'Email o contraseña incorrectos.'
            : `No se pudo iniciar sesión (${response.status}).`,
        );
      }

      const data = await response.json();

      if (typeof data.token !== 'string' || !data.token) {
        throw new Error('El backend no devolvió un token válido.');
      }

      onLogin(data.token); // Entrega el token a App.
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Error de conexión.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Stack component="form" onSubmit={handleSubmit} spacing={2}>
      <TextField
        label="Email"
        type="email"
        autoComplete="username"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />

      <TextField
        label="Contraseña"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
      />

      {error && <Alert severity="error">{error}</Alert>}

      <Button type="submit" variant="contained" disabled={loading}>
        {loading ? 'Conectando…' : 'Iniciar sesión'}
      </Button>
    </Stack>
  );
}