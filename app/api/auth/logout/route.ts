import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Clear the auth token cookie
    res.setHeader(
      'Set-Cookie',
      'auth_token=; Max-Age=0; path=/; SameSite=Strict'
    );
    return res.status(200).json({ message: 'Logged out successfully' });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
