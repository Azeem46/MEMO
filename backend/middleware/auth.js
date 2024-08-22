import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'test'; // Use environment variable for secret

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header is missing' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Token is missing' });
    }

    const isCustomAuth = token.length < 500; // Assuming custom tokens are shorter

    let decodedData;

    if (isCustomAuth) {
      // Verify the token
      decodedData = jwt.verify(token, secret);
      req.userId = decodedData?.id; // For custom tokens
    } else {
      // Decode the token (usually for OAuth or similar tokens)
      decodedData = jwt.decode(token);
      req.userId = decodedData?.sub; // For non-custom tokens
    }

    if (!req.userId) {
      return res.status(401).json({ message: 'Invalid token payload' });
    }

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired' });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    // Generic server error
    res.status(500).json({ message: 'An error occurred while processing the token' });
  }
};

export default auth;
