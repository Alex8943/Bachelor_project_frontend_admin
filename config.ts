interface Config {
    apiEnvEndpoint: string;
}

const config: Record<string, Config> = {
    development: {
        apiEnvEndpoint: "http://localhost:3000/" ,
    },
};

export const currentConfig: Config = config[import.meta.env.MODE || 'development'];
