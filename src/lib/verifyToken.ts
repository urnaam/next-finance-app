import jwt from 'jsonwebtoken';

export function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string); // Use your secret key here
    return decoded;
  } catch {
    return null; // Return null if the token is invalid or expired
  }
}
