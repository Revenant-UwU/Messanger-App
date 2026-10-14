import { useState } from 'react';
import {
  Alert,
  Button,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';

// Debe coincidir con los campos que devuelve GET /users.
interface User {
  id: string;
  username: string;
  email: string;
}
interface UsersListProps {
  token: string;
}

export default function UserList({token}:UsersListProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState('');

  async function loadUsers() {
    setLoading(true);
    setError('');

    try {

      const response = await fetch('/users', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      });

      if (!response.ok) {
        throw new Error(`No se pudieron cargar los usuarios (${response.status})`);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error('El backend no devolvió una lista.');
      }

      setUsers(data);
      setLoaded(true);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Error de conexión',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Stack spacing={2}>
      <Button
        variant="contained"
        onClick={loadUsers}
        disabled={loading}
      >
        {loading ? 'Cargando…' : 'Mostrar usuarios'}
      </Button>

      {error && <Alert severity="error">{error}</Alert>}

      {loaded && users.length === 0 && (
        <Typography>No hay usuarios todavía.</Typography>
      )}

      <List>
        {users.map((user) => (
          <ListItem key={user.id}>
            <ListItemText
              primary={user.username}
              secondary={user.email}
            />
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}