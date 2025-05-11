import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  try {
    // Get token from the header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    // Check if token exists
    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }
    
    // Verify token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add user from payload
    req.user = {
      id: verified.id,
      role: verified.role
    };
    
    // Continue to the route
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export default auth; 