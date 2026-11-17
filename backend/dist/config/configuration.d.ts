declare const _default: () => {
    port: number;
    env: string;
    database: {
        uri: string;
    };
    jwt: {
        secret: string;
        expiresIn: string;
    };
    cloudinary: {
        cloudName: string;
        apiKey: string;
        apiSecret: string;
    };
    throttler: {
        ttl: number;
        limit: number;
    };
};
export default _default;
