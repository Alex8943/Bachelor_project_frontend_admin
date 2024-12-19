import dotenv from 'dotenv';
dotenv.config();

interface Config {
    apiEnvEndpoint: string;
}

const config: Record<string, Config> = {
    development: {
        apiEnvEndpoint: process.env.VITE_BACKEND_URL || 'http://localhost:3000',
    },
};

export const currentConfig: Config = config[import.meta.env.MODE || 'development'];
