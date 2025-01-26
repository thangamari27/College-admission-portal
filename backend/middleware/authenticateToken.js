const jwt = require('jsonwebtoken');

exports.authenticateToken = (req, res, next) => {
  const token = req.cookies.token; // Assuming you're using cookies for storing JWT
  console.log(token);
  if (!token) {
    console.log('Missing token. Redirecting to login.');
    return res.redirect('/login');
}
try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    console.log(verified);
    req.user = verified;
    next();
} catch (error) {
    console.log('Invalid token:', error.message);
    return res.redirect('/login');
}

};
