# Landing Constructor

Cloaking system and landing page constructor with traffic filtering by operating system and other parameters.

## Project Description

The application implements a cloaking pattern to display different sites depending on traffic:

- **White Page** - shown when filters don't match
- **Black Page** - shown when all filters are passed (with PWA support)

### Architecture

- **Backend**: NestJS + MongoDB
- **Frontend**: Static HTML pages
- **Filtering**: User-Agent, OS, Browser, Device, Referrer
- **PWA**: Manifest.json and Service Worker for Black Page

## Quick Start

### Requirements

- Node.js 20+
- Docker & Docker Compose
- MongoDB (via Docker)

## Configuration

### Environment Variables (.env)

```env
# Database
# If you have your own database, specify in the variable:
DATABASE_URL=your_connection_string
# If you want to work in Docker (use MongoDB from docker-compose), leave the variable empty:
DATABASE_URL=
# In this case, connection will be automatically established to the database container via this URL.
DATABASE_URL_LOCAL=mongodb://localhost:27017/landing-constructor

# Server
PORT=3000
BACKEND_URL=http://localhost
```

### Local Setup

```bash
# Clone repository
git clone https://github.com/vzad90/LandingConstructor.git
cd LandingConstructor

# Environment variables setup
cp .env.example .env
# Edit .env file (prev step)

# Install dependencies
npm install

# Start application
npm run dev
```

### Docker Setup

```bash
# Clone repository
git clone https://github.com/vzad90/LandingConstructor.git
cd LandingConstructor

# Environment variables setup
cp .env.example .env
# Edit .env file (prev step)

# Start all services
docker-compose up -d

# Check status
docker-compose ps

# Start application
npm run dev
```

### Filter Configuration

Settings are located in `src/config/configuration.ts`:

```typescript
filters: {                       // For getting access to black page
    os: ['Windows', 'Android'],                                   // Allowed os
    browsers: [                                                   // Allowed browsers
      'Mobile Chrome',
      'Chrome',
      'Firefox',
      'Safari',
      'Mobile Safari',
      'Edge',
    ],
    devices: ['desktop', 'mobile'],                               // Allowed devices
    blockedReferrers: ['bot.com', 'crawler.net'],                 // Blocked referrers
    blockedUserAgents: ['bot', 'crawler', 'spider', 'scraper'],   // Blocked userAgents
}
```

## Commands

### Development

```bash
npm run dev          # Start in development mode
npm run start        # Start production version
npm run start:debug  # Start with debug
```

### Build and Tests

```bash
npm run build        # Build project (with lint and type-check)
npm run type-check   # TypeScript type checking
npm run lint         # ESLint check
npm run format       # Prettier formatting
```

### Testing

```bash
npm run test         # Unit tests
npm run test:watch   # Tests in watch mode
npm run test:cov     # Tests with coverage
npm run test:e2e     # E2E tests
```

### Docker

```bash
docker-compose up [-d]     # Start all services
docker-compose down      # Stop services
docker-compose logs      # View logs
```

## API Endpoints

### Main Route

- **GET** `/` - Request processing with traffic filtering

### Statistics

- **GET** `/stats` - Visit statistics (Sample JSON output)

### PWA (only for Black Page)

- **GET** `/manifest.json` - PWA manifest
- **GET** `/sw.js` - Service Worker

### Documentation

- **GET** `/api/docs` - Swagger UI documentation

## Frontend

### White Page

- Static HTML landing
- Located in `public/white/`
- Shown when filters don't match

### Black Page

- Static HTML landing with PWA support
- Located in `public/black/`
- Shown when filters are passed
- Includes manifest.json and Service Worker

## Technologies

- **Backend**: NestJS, TypeScript, MongoDB, Mongoose
- **Frontend**: Static Landings (HTML, CSS, JS)
- **DevOps**: Docker, Docker Compose
- **Tools**: ESLint, Prettier, Husky
- **Documentation**: Swagger/OpenAPI

## Monitoring

The system collects statistics:

- Total number of visits
- Distribution by operating systems
- Number of White/Black page views
- Last 10 visits

## Security

- User-Agent filtering
- Bot and crawler blocking
- Referrer validation

---

**Note**: All settings can be changed through the configuration file without recompilation.
