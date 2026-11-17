import { Connection } from 'mongoose';
export declare class HealthController {
    private readonly connection;
    constructor(connection: Connection);
    check(): Promise<{
        status: string;
        service: string;
        version: string;
        environment: string;
        timestamp: string;
        uptime: string;
        checks: {
            database: {
                status: string;
                healthy: boolean;
            };
            memory: {
                heapUsed: string;
                heapTotal: string;
                rss: string;
                external: string;
            };
        };
    }>;
}
