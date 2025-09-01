# NestJS Vendor Matching API

A modern, scalable API for matching vendors with projects using NestJS, TypeORM, and MySQL with Docker-first development.

## 🚀 Features

- **TypeORM Integration**: Robust database operations with TypeORM
- **Consistent API Responses**: Standardized BaseResponse format for all endpoints
- **Role-based Authentication**: JWT-based auth with admin/client roles
- **Docker-first development**: Complete containerized setup with Docker Compose
- **Environment-based configuration**: Secure credential management
- **TypeScript**: Full type safety and modern JavaScript features
- **NestJS framework**: Enterprise-grade Node.js framework

## 🏗️ Architecture

- **API Layer**: NestJS REST API with standardized response format
- **Database Layer**: 
  - MySQL 8.0 (relational data with TypeORM)
  - Automatic database initialization with Docker init scripts
- **Authentication**: JWT-based with role management
- **Containerization**: Docker with health checks and volume management

## 📋 Prerequisites

- Docker & Docker Compose
- Node.js 20+ (for local development)
- Git

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd nestjs-vendor-matching-api
```

### 2. Environment Setup
Create a `.env` file in the project root:
```env
# Application Environment
NODE_ENV=development
PORT=3000

# MySQL Database
MYSQL_ROOT_PASSWORD=vendor_password
MYSQL_DATABASE=vendor_matching
MYSQL_USER=vendor_user
MYSQL_PASSWORD=vendor_password

# JWT Secret (for authentication)
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=24h
```

### 3. Start with Docker
```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f app

# Stop services
docker compose down
```

### 4. Access the API
- **API**: http://localhost:3000
- **Health Check**: http://localhost:3000/health
- **MySQL**: localhost:3306

## 🛠️ Development

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run start:dev

# Build for production
npm run build

# Run tests
npm run test
```

### Docker Development
```bash
# Rebuild and restart app only
docker compose build app
docker compose up -d app

# View specific service logs
docker compose logs -f mysql
```

## 📁 Project Structure

```
nestjs-vendor-matching-api/
├── src/                    # Source code
│   ├── auth/              # Authentication module (JWT + roles)
│   ├── user/              # User management
│   ├── role/              # Role management (admin, client)
│   ├── clients/           # Client management
│   ├── vendors/           # Vendor management
│   ├── projects/          # Project management
│   ├── matches/           # Vendor-project matching
│   ├── common/            # Shared utilities
│   │   ├── base-response.ts      # Standardized API response format
│   │   ├── interceptors/         # Response transformation
│   │   ├── filters/              # Exception handling
│   │   └── decorators/           # Custom decorators
│   └── main.ts            # Application entry point
├── docker/                 # Docker configuration
│   └── mysql/             # MySQL initialization scripts
│       ├── 01-init.sql    # Database schema and roles
│       └── 02-sample-data.sql # Sample data
├── docker-compose.yaml     # Service orchestration
└── Dockerfile             # Application container
```

## 🔧 Configuration

### Database Connections
- **MySQL**: Primary database for users, roles, clients, vendors, projects, and matches
- **TypeORM**: Object-relational mapping with automatic entity synchronization
- **Docker Init Scripts**: Automatic database population on container startup

### Environment Variables
All sensitive configuration is externalized through environment variables. See `.env.example` for reference.

## 🚀 API Response Format

All API endpoints return responses in a standardized format:

```typescript
{
  "success": true,
  "statusCode": 200,
  "message": "Operation completed successfully",
  "data": { /* your data here */ },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Error Responses
```typescript
{
  "success": false,
  "statusCode": 400,
  "message": "Error description",
  "data": { /* error details */ },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🔐 Authentication & Authorization

### Available Roles
- **admin**: Full access to all endpoints
- **client**: Limited access based on client ID

### Protected Endpoints
- `/auth/me` - Get current user info (requires JWT)
- `/clients` - Client management (admin only)
- `/vendors` - Vendor management (admin only)
- `/projects` - Project management (admin only)

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 🚀 Deployment

### Production Considerations
- Use strong, unique passwords in `.env`
- Enable SSL/TLS encryption
- Set up proper backup strategies
- Monitor container health and logs
- Use Docker secrets for sensitive data

### Docker Commands
```bash
# Production build
docker compose -f docker-compose.prod.yml up -d

# Health check
docker compose ps

# Scale services
docker compose up -d --scale app=3
```

## 📚 Documentation

- [Docker Setup Guide](DOCKER_SETUP.md) - Complete Docker configuration
- [NestJS Documentation](https://docs.nestjs.com) - Framework documentation
- [TypeORM Documentation](https://typeorm.io/) - Database ORM documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

- Check the [Docker Setup Guide](DOCKER_SETUP.md) for common issues
- Review Docker logs: `docker compose logs -f [service-name]`
- Ensure all environment variables are set correctly
- Verify Docker and Docker Compose are running
- Test database connection: `GET /health` endpoint

---

Built with ❤️ using [NestJS](https://nestjs.com/) and [TypeORM](https://typeorm.io/)
