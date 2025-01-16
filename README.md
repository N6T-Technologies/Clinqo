![Logo](https://cdn.pixabay.com/photo/2013/07/18/10/59/heartbeat-163709_1280.jpg)

# Clinqo Queue Management System 🏥

Welcome to Clinqo - An intelligent healthcare queue management solution that streamlines patient flow and enhances clinical efficiency.

## ✨ Authors
- [@meru45](https://www.github.com/meru45)

## 🚀 Getting Started

### Prerequisites
Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- Yarn package manager
- Docker
- PM2 (Process Manager)

### Installation Steps

#### 1. Install Docker
Download Docker and install it based on your operating system.

#### 2. Clone the repository
```bash
git clone https://github.com/N6T-Technologies/Clinqo.git  
cd Clinqo  
```

#### 3. Configure Environment Variables
```bash
# Configure hospital client environment  
cp apps/hospital-client/env.example apps/hospital-client/.env  
# Configure database environment  
cp apps/packages/db/env.example apps/packages/db/.env  
```

#### 4. Set up the Database
```bash
cd packages/db/prisma  
yarn prisma generate  
yarn prisma migrate  
```

#### 5. Add Seed Data (Optional)
If you need to pre-populate your database with seed data:
```bash
# Update seed data file  
nano packages/db/prisma/seedsData.ts  
# Apply seeds  
yarn prisma generate  
yarn prisma migrate  
```

#### 6. Generate Hashcode for Password
1. Use a password hashing service like bcrypt.online to generate a secure hash of your password.
2. Replace the password in the user table with the generated hash using Prisma Studio:
```bash
yarn prisma studio  
```

#### 7. Start the Application
```bash
# From the root directory  
pm2 start ecosystem.config.js  
```

This will automatically start all necessary services:
- PostgreSQL and Redis containers
- WebSocket server
- Shefu service
- Hospital client
- Database services

#### 8. Monitor the Services
```bash
pm2 status  
```

To view logs:
```bash
pm2 logs  
```

## 📝 Additional Information
- **Containerization**: Uses Docker for PostgreSQL and Redis
- **Real-time Queue Management**: Powered by Redis
- **Database**: Persistent data storage handled by PostgreSQL
- **Real-time Updates**: Enabled by WebSocket server
- **Process Management**: PM2 handles service orchestration and monitoring
