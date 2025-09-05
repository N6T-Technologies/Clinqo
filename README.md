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
yarn install
yarn add prisma@6.15.0 @prisma/client@6.15.0 -W
```

#### 3. Configure Environment Variables
```bash
# Configure hospital client environment  
cp apps/hospital-client/env.example apps/hospital-client/.env  
# Configure database environment  
cp packages/db/env.example apps/packages/db/.env  
```

#### 4. Start Docker Services
```bash
# Start Redis and PostgreSQL containers
docker compose up -d

# To pause development environment
docker compose pause

# To resume development environment
docker compose unpause

# Note: Avoid using 'docker compose down' as it will delete existing database data
```

#### 5. Set up the Database
```bash
cd packages/db/prisma
yarn prisma generate
yarn prisma db seed
yarn prisma generate
yarn prisma migrate dev
```

#### 6. Generate Hashcode for Password
1. Use a password hashing service like bcrypt.online to generate a secure hash of your password.
2. Replace the password in the user table with the generated hash using Prisma Studio:
```bash
yarn prisma studio  
```

#### 7. Start the Services
```bash
# Start shefu and ws services
chmod +x service.sh  # if running for the first time
./service.sh

# Start the hospital client
cd apps/hospital-client
yarn run build
yarn run start
```



## 📝 Additional Information
- **Containerization**: Uses Docker for PostgreSQL and Redis
- **Real-time Queue Management**: Powered by Redis
- **Database**: Persistent data storage handled by PostgreSQL
- **Real-time Updates**: Enabled by WebSocket server
- **Process Management**: PM2 handles service orchestration and monitoring
