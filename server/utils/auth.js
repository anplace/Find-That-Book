const jwt = require('jsonwebtoken');

// Set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  // Middleware for authenticated routes
  authMiddleware: function (resolve, parent, args, context, info) {
    let token = context.authorization || '';

    if (token.startsWith('Bearer ')) {
      token = token.slice(7);
    }

    if (!token) {
      throw new Error('You have no token!');
    }

    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      context.user = data;
    } catch (error) {
      console.log('Invalid token:', error.message);
      throw new Error('Invalid token!');
    }

    return resolve();
  },

  // Function to sign a token
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
