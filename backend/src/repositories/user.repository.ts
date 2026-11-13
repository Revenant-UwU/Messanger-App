import { pool } from '../utils/db.js';
import { ERole, type User } from '../models/user.model.js';

const userColumns = `
  id,
  username,
  email,
  password_hash AS "password",
  role,
  created_at AS "createdAt",
  updated_at AS "updatedAt"
`;

export async function findAll(): Promise<User[]> {
  const result = await pool.query<User>(
    `SELECT ${userColumns} FROM users ORDER BY id`,
  );

  return result.rows;
}

export async function findById(id: number): Promise<User | undefined> {
  const result = await pool.query<User>(
    `SELECT ${userColumns} FROM users WHERE id = $1`,
    [id],
  );

  return result.rows[0];
}

export async function findByEmail(
  email: string,
): Promise<User | undefined> {
  const result = await pool.query<User>(
    `SELECT ${userColumns}
     FROM users
     WHERE lower(email) = lower($1)`,
    [email.trim()],
  );

  return result.rows[0];
}

export async function findByUsername(
  username: string,
): Promise<User | undefined> {
  const result = await pool.query<User>(
    `SELECT ${userColumns}
     FROM users
     WHERE lower(username) = lower($1)`,
    [username.trim()],
  );

  return result.rows[0];
}

export async function searchUsersByUsername(
  search: string,
): Promise<Pick<User, 'id' | 'username'>[]> {
  const result = await pool.query<Pick<User, 'id' | 'username'>>(
    `SELECT id, username
     FROM users
     WHERE strpos(lower(username), lower($1)) > 0
     ORDER BY username, id
     LIMIT 10`,
    [search],
  );

  return result.rows;
}

export async function insert(
  username: string,
  email: string,
  passwordHash: string,
): Promise<User> {
  const result = await pool.query<User>(
    `INSERT INTO users (username, email, password_hash, role)
     VALUES ($1, $2, $3, $4)
     RETURNING ${userColumns}`,
    [username.trim(), email.trim(), passwordHash, ERole.USER],
  );

  const user = result.rows[0];

  if (!user) {
    throw new Error('User creation returned no row');
  }

  return user;
}

export async function deleteById(id: number): Promise<boolean> {
  const result = await pool.query(
    'DELETE FROM users WHERE id = $1',
    [id],
  );

  return (result.rowCount ?? 0) > 0;
}