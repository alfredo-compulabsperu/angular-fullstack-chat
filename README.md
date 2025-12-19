# CollabSpace - Real-Time Collaborative Task Management & Chat Platform

[![CI/CD Pipeline](https://github.com/alfredo-compulabsperu/angular-fullstack-chat/workflows/CI%2FCD%20Pipeline/badge.svg)](https://github.com/alfredo-compulabsperu/angular-fullstack-chat/actions)

A production-ready, enterprise-grade Angular application with NestJS backend for real-time collaboration, task management, and team communication.

## 🚀 Features

- **Real-Time Chat**: WebSocket-powered messaging with typing indicators, online status, and read receipts
- **Task Management**: Kanban-style task board with drag-and-drop functionality
- **Workspace Management**: Multi-workspace support with roles and permissions
- **Authentication**: JWT-based authentication with refresh tokens
- **Responsive Design**: Mobile-first design with optimized layouts for all screen sizes
- **State Management**: Reactive state management with RxJS
- **Performance Optimized**: Lazy loading, virtual scrolling, and OnPush change detection

## 📋 Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher
- Docker & Docker Compose (for containerized deployment)
- PostgreSQL 14+ (if running locally without Docker)
- Redis 7+ (if running locally without Docker)

## 🛠️ Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/alfredo-compulabsperu/angular-fullstack-chat.git
cd angular-fullstack-chat

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### Running with Docker (Recommended)

```bash
# From the root directory
docker-compose up -d

# Access the application
# Frontend: http://localhost:4200
# Backend API: http://localhost:3000
# Backend API Docs: http://localhost:3000/api
```

### Running Locally

#### Frontend Development Server

```bash
cd frontend
npm start
# Navigate to http://localhost:4200
```

#### Backend Development Server

```bash
cd backend
npm run start:dev
# API available at http://localhost:3000
```

## 🏗️ Project Structure

```
angular-fullstack-chat/
├── frontend/                    # Angular 14+ application
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/           # Singleton services, guards, interceptors
│   │   │   ├── shared/         # Reusable components, directives, pipes
│   │   │   ├── features/       # Lazy-loaded feature modules
│   │   │   └── state/          # State management
│   │   ├── assets/             # Static assets
│   │   ├── environments/       # Environment configurations
│   │   └── styles/             # Global styles (SCSS)
│   ├── Dockerfile
│   └── nginx.conf
│
├── backend/                     # NestJS application
│   ├── src/
│   │   ├── modules/            # Feature modules
│   │   │   ├── auth/           # Authentication module
│   │   │   ├── users/          # User management
│   │   │   ├── chat/           # Chat functionality
│   │   │   ├── tasks/          # Task management
│   │   │   └── workspaces/     # Workspace management
│   │   ├── common/             # Shared utilities
│   │   │   ├── guards/         # Auth & role guards
│   │   │   ├── decorators/     # Custom decorators
│   │   │   ├── filters/        # Exception filters
│   │   │   └── interceptors/   # HTTP interceptors
│   │   ├── config/             # Configuration
│   │   └── database/           # Database migrations & seeds
│   ├── Dockerfile
│   └── test/                   # E2E tests
│
├── docker-compose.yml          # Docker Compose configuration
├── .github/workflows/          # CI/CD pipelines
└── README.md
```

## 🧪 Testing

### Frontend Tests

```bash
cd frontend

# Run unit tests
npm test

# Run tests with coverage
npm run test:coverage

# Run e2e tests
npm run e2e
```

### Backend Tests

```bash
cd backend

# Run unit tests
npm test

# Run tests with coverage
npm run test:cov

# Run e2e tests
npm run test:e2e
```

## 📦 Building for Production

### Frontend

```bash
cd frontend
npm run build
# Build artifacts will be stored in the `dist/` directory
```

### Backend

```bash
cd backend
npm run build
# Build artifacts will be stored in the `dist/` directory
```

## 🔧 Environment Variables

### Frontend (`frontend/src/environments/environment.prod.ts`)

```typescript
export const environment = {
  production: true,
  apiUrl: 'http://localhost:3000/api',
  wsUrl: 'ws://localhost:3000',
};
```

### Backend (`.env` file in backend directory)

```env
NODE_ENV=production
PORT=3000

# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=collabspace
DATABASE_USER=admin
DATABASE_PASSWORD=your-secure-password

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRATION=3600
JWT_REFRESH_SECRET=your-refresh-token-secret
JWT_REFRESH_EXPIRATION=604800

# CORS
CORS_ORIGIN=http://localhost:4200
```

## 🏛️ Architecture

### Frontend Architecture

- **Core Module**: Contains singleton services (auth, WebSocket, API), guards, and interceptors
- **Shared Module**: Reusable components, directives, and pipes
- **Feature Modules**: Lazy-loaded modules for auth, chat, tasks, workspace, and dashboard
- **State Management**: Reactive state management using RxJS patterns
- **Routing**: Lazy loading with route guards for authentication and authorization

### Backend Architecture

- **Modular Design**: Organized by feature modules (auth, users, chat, tasks, workspaces)
- **Layered Architecture**: Controllers, services, and repositories
- **WebSocket Gateway**: Real-time communication using Socket.io
- **REST + GraphQL**: Hybrid API approach for different use cases
- **Database**: PostgreSQL with TypeORM for data persistence
- **Caching**: Redis for session management and caching

## 🔐 Security

- JWT-based authentication with refresh tokens
- Password hashing using bcrypt
- HTTP-only cookies for refresh tokens
- CORS configuration
- Rate limiting
- Input validation using class-validator
- XSS protection
- CSRF token implementation

## 📊 Performance

- **Frontend**:
  - Lazy loading of feature modules
  - OnPush change detection strategy
  - Virtual scrolling for large lists
  - Image lazy loading
  - Service worker for PWA capabilities

- **Backend**:
  - Database query optimization
  - Redis caching layer
  - Connection pooling
  - Compression middleware
  - Rate limiting

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- **Alfredo** - [alfredo-compulabsperu](https://github.com/alfredo-compulabsperu)

## 🙏 Acknowledgments

- Angular Team for the amazing framework
- NestJS Team for the powerful backend framework
- All contributors and supporters of this project