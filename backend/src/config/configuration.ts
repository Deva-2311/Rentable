export default () => ({
  port: parseInt(process.env.PORT || '5000', 10),
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/rentable',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'super-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
});
