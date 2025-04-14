import db from './db';
import bcrypt from 'bcryptjs';

interface User {
  id: number;
  username: string;
  password: string;
}

export function registerUser(username: string, password: string) {
  const hash = bcrypt.hashSync(password, 10);
  const stmt = db.prepare(
    'INSERT INTO users (username, password) VALUES (?, ?)'
  );
  stmt.run(username, hash);
}

export function loginUser(username: string, password: string) {
  const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
  const user = stmt.get(username) as User | undefined; // Explicitly type the result

  if (!user) return null;
  const isValid = bcrypt.compareSync(password, user.password);
  return isValid ? user : null;
}
