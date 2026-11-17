export default () => ({
  port: parseInt(process.env.PORT || '5000', 10),
  env: process.env.NODE_ENV || 'development',
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/rentable',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'super-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  cloudinary: (() => {
    let cloudName = process.env.CLOUDINARY_CLOUD_NAME || '';
    let apiKey = process.env.CLOUDINARY_API_KEY || '';
    let apiSecret = process.env.CLOUDINARY_API_SECRET || '';
    const cloudinaryUrl = process.env.CLOUDINARY_URL || '';
    if (cloudinaryUrl && (!cloudName || !apiKey || !apiSecret)) {
      const match = cloudinaryUrl.match(/cloudinary:\/\/([^:]+):([^@]+)@(.+)/);
      if (match) {
        apiKey = apiKey || match[1];
        apiSecret = apiSecret || match[2];
        cloudName = cloudName || match[3];
      }
    }
    return { cloudName, apiKey, apiSecret };
  })(),
  throttler: {
    ttl: parseInt(process.env.THROTTLER_TTL || '60', 10),
    limit: parseInt(process.env.THROTTLER_LIMIT || '100', 10),
  },
});
