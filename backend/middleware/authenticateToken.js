const jwt = require('jsonwebtoken');

exports.authenticateToken = (req, res, next) => {
  const token = req.cookies.jwt; // JWT stored as 'jwt'

  if (!token) {
    console.log('Missing token. Redirecting to signup.');
    return res.redirect('/signup');
  }

  try {
    // Verify token
    const verifiedUser = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token verified:', verifiedUser);

    // Attach user info to the request object
    req.user = verifiedUser;

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error('Invalid token:', error.message);
    return res.redirect('/login'); // Redirect if token is invalid
  }
};
