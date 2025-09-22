export interface IconConfig {
  src: string;
  sizes: string;
  type: string;
}

export interface DatabaseConfig {
  url: string;
}
export interface ServerConfig {
  url: string;
  port: number;
}

export interface FiltersConfig {
  os: string[];
  browsers: string[];
  devices: string[];
  blockedReferrers: string[];
  blockedUserAgents: string[];
}

export interface PagesConfig {
  white: string;
  black: string;
}

export interface PWAConfig {
  name: string;
  short_name: string;
  description: string;
  start_url: string;
  display: string;
  background_color: string;
  theme_color: string;
  icons: IconConfig[];
}

export interface AppConfig {
  database: DatabaseConfig;
  server: ServerConfig;
  filters: FiltersConfig;
  pageUrls: PagesConfig;
  pwa: PWAConfig;
}

export const configuration = (): AppConfig => ({
  database: {
    url: process.env.DATABASE_URL || process.env.DATABASE_URL_LOCAL!,
  },
  server: {
    url: process.env.BACKEND_URL || 'http://localhost',
    port: parseInt(process.env.PORT || '3000', 10),
  },
  filters: {
    os: ['Windows', 'Android'],
    browsers: [
      'Mobile Chrome',
      'Chrome',
      'Firefox',
      'Safari',
      'Mobile Safari',
      'Edge',
    ],
    devices: ['desktop', 'mobile'],
    blockedReferrers: ['bot.com', 'crawler.net'],
    blockedUserAgents: ['bot', 'crawler', 'spider', 'scraper'],
  },
  pageUrls: {
    white: './public/white/main.html',
    black: './public/black/main.html',
  },
  pwa: {
    name: 'MyLanding',
    short_name: 'Landing',
    description: 'A landing page constructor application',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/bImages/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/bImages/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  },
});

export const getDatabaseConfig = (): DatabaseConfig => configuration().database;
export const getServerConfig = (): ServerConfig => configuration().server;
export const getPWAConfig = (): PWAConfig => configuration().pwa;
export const getFiltersConfig = (): FiltersConfig => configuration().filters;
export const getPagesConfig = (): PagesConfig => configuration().pageUrls;
