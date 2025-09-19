export interface DatabaseConfig {
  url: string;
}
export interface ServerConfig {
  port: number;
}

export interface AppConfig {
  database: DatabaseConfig;
  server: ServerConfig;
}

export const configuration = (): AppConfig => ({
  database: {
    url:
      process.env.DATABASE_URL || 'mongodb://mongo:27017/landing-constructor',
  },
  server: {
    port: parseInt(process.env.PORT || '3000', 10),
  },
});

export const getDatabaseConfig = (): DatabaseConfig => configuration().database;
export const getServerConfig = (): ServerConfig => configuration().server;
