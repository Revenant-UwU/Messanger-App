import { useState } from 'react';
import type { FormEvent } from 'react';
import { Alert, Button, Stack, TextField } from '@mui/material';

interface RegisterProps {
  onLogin: (token: string) => void;
}

export default function Register({ onLogin }: RegisterProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim(),
          password,
        }),
      });

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error('Ya existe una cuenta con esos datos.');
        }

        if (response.status === 400) {
          throw new Error('Revisa los datos del formulario.');
        }

        throw new Error(
          `No se pudo crear la cuenta (${response.status}).`,
        );
      }

      const data = await response.json();

      if (typeof data.token !== 'string' || !data.token) {
        throw new Error('El backend no devolvió un token válido.');
      }

      onLogin(data.token);
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
        label="Nombre de usuario"
        autoComplete="username"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
        required
      />

      <TextField
        label="Email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />

      <TextField
        label="Contraseña"
        type="password"
        autoComplete="new-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
      />

      {error && <Alert severity="error">{error}</Alert>}

      <Button type="submit" variant="contained" disabled={loading}>
        {loading ? 'Creando cuenta…' : 'Registrarse'}
      </Button>
    </Stack>
  );
}