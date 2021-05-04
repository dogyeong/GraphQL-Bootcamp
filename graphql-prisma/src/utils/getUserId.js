import jwt from 'jsonwebtoken';

export const getUserId = (req, requireAuth = true) => {
  const header = req.request ? req.request.headers.authorization : req.connection.context.Authorization;

  if (header) {
    const token = header.replace('Bearer ', '');
    const decoded = jwt.verify(token, 'secret');

    return decoded.userId;
  }

  if (requireAuth) throw new Error('Authorization required');

  return null;
};
