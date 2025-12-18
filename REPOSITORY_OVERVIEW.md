# Clinqo - Healthcare Queue Management System
## Repository Overview for Resume

---

## 🎯 Project Summary

**Clinqo** is a comprehensive healthcare queue management system designed to streamline patient flow and enhance clinical efficiency in hospitals and clinics. This full-stack monorepo application leverages modern web technologies to provide real-time appointment management, queue tracking, and multi-role dashboards for healthcare facilities.

---

## 🏗️ Architecture Overview

### Monorepo Structure (Yarn Workspaces)
The project follows a **monorepo architecture** using Yarn Workspaces, organizing code into modular apps and shared packages:

```
Clinqo/
├── apps/
│   ├── hospital-client/    # Next.js frontend application
│   ├── shefu/               # Queue management engine (backend service)
│   └── ws/                  # WebSocket real-time communication server
├── packages/
│   ├── db/                  # Shared Prisma database client
│   ├── ui/                  # Shared UI component library
│   ├── eslint-config/       # Shared ESLint configuration
│   └── typescript-config/   # Shared TypeScript configuration
```

---

## 💼 Projects & Their Roles

### 1. **Hospital Client** (`apps/hospital-client`)
**Technology**: Next.js 14 with App Router, React 19, TypeScript

**Description**: Full-featured web application serving as the primary user interface for all stakeholders.

**Key Features**:
- **Multi-role Authentication System**: Role-based access control for Admin, Clinic Head, Doctor, Front Desk Manager, and Patient roles
- **Dynamic Routing with Parallel Routes**: Utilizes Next.js App Router's `@` slots for role-specific dashboards
- **Appointment Management**: Complete CRUD operations for patient appointments
- **Real-time Queue Monitoring**: Live updates of patient queues via WebSocket integration
- **QR Code Generation**: For patient check-in and appointment tracking
- **PDF Generation**: Patient prescriptions and medical reports using `@react-pdf/renderer`
- **Medical Records Management**: Upload and manage patient records (X-rays, reports)
- **Analytics Dashboard**: Visual charts and metrics using Recharts
- **Form Validation**: Comprehensive forms with React Hook Form and Zod schema validation

**Tech Stack**:
- **Frontend Framework**: Next.js 14 (App Router)
- **UI Library**: React 19 RC
- **Authentication**: NextAuth v5 (Auth.js)
- **Styling**: TailwindCSS with Radix UI components
- **Forms**: React Hook Form + Zod validation
- **State Management**: Recoil (for client-side state)
- **API Layer**: Next.js API Routes
- **File Upload**: Cloudinary integration
- **Real-time**: WebSocket client integration

### 2. **Shefu Engine** (`apps/shefu`)
**Technology**: Node.js, TypeScript, Redis

**Description**: Backend queue management engine that processes appointment operations and manages queue state.

**Key Responsibilities**:
- **Queue Processing**: Processes messages from Redis queue for appointment state changes
- **Business Logic**: Handles appointment creation, completion, cancellation
- **State Management**: Manages active sessions and appointment queues in Redis
- **Event-driven Architecture**: Consumes messages from Redis pub/sub

**Features**:
- Singleton pattern for centralized queue management
- Redis integration for distributed state management
- Type-safe event handling with TypeScript
- Asynchronous message processing

**Tech Stack**:
- **Runtime**: Node.js
- **Language**: TypeScript
- **Cache/Queue**: Redis
- **Database Access**: Prisma Client (via shared package)

### 3. **WebSocket Server** (`apps/ws`)
**Technology**: Node.js, WebSocket (ws library), Redis, TypeScript

**Description**: Real-time communication server providing live updates to connected clients.

**Key Features**:
- **Real-time Updates**: Pushes queue status changes to connected clients
- **User Management**: Tracks active WebSocket connections
- **Subscription Management**: Role-based message routing
- **Redis Pub/Sub Integration**: Receives events from Shefu engine and broadcasts to clients

**Architecture**:
- User session management with unique identifiers
- Subscription-based message filtering
- Automatic connection cleanup on disconnect

**Tech Stack**:
- **WebSocket Library**: ws (WebSocket protocol implementation)
- **Pub/Sub**: Redis for event distribution
- **Language**: TypeScript

### 4. **Database Package** (`packages/db`)
**Technology**: Prisma ORM, PostgreSQL

**Description**: Centralized database schema and client for all applications.

**Key Models**:
- User (with role-based polymorphic relationships)
- Doctor, Patient, Employee, Admin, ClinicHead
- Clinic, Department
- Appointment, Session
- Payment, MedicalRecords
- Availability schedules

**Features**:
- Type-safe database queries
- Database migrations and seeding
- Shared across all services
- Enum-based type safety for roles, statuses, etc.

---

## 🚀 Tech Stack Summary

### **Frontend Technologies**
- **Framework**: Next.js 14 (App Router, Server Components, API Routes)
- **UI Library**: React 19 (Release Candidate)
- **Language**: TypeScript 5
- **Styling**: TailwindCSS + Radix UI primitives
- **State Management**: Recoil
- **Form Management**: React Hook Form + Zod validation
- **Authentication**: NextAuth v5 (Auth.js)
- **PDF Generation**: @react-pdf/renderer
- **Charts**: Recharts
- **Image Management**: Cloudinary (Next-Cloudinary)
- **Icons**: Lucide React, Radix Icons
- **Animation**: Framer Motion
- **QR Code**: qrcode.react

### **Backend Technologies**
- **Runtime**: Node.js
- **Language**: TypeScript
- **WebSocket**: ws library
- **Queue/Cache**: Redis
- **Database**: PostgreSQL 
- **ORM**: Prisma 6.15.0
- **Process Management**: PM2 (ecosystem.config.js)

### **Infrastructure & DevOps**
- **Containerization**: Docker (docker-compose.yml)
  - PostgreSQL container
  - Redis container
- **Monorepo**: Yarn Workspaces
- **Code Quality**: ESLint, Prettier
- **Deployment**: PM2 process manager

---

## 📊 State Management Architecture

### **Client-Side State Management: Recoil**

**Why Recoil?**
Recoil was chosen for its:
- Minimal boilerplate compared to Redux
- React-like API (hooks-based)
- Efficient re-rendering with atom-based state
- TypeScript support

**Implementation**:
```typescript
// Store structure: apps/hospital-client/store/atoms/
- sessionAtom.ts: Manages active session state
```

**Usage Pattern**:
- **Atoms**: Define pieces of state (e.g., `sessionAtom` for session management)
- **RecoilRoot**: Wraps the application to provide state context
- **useRecoilState**: Hook for reading and updating state in components

**Example**:
```typescript
// sessionAtom.ts
export const sessionAtom = atom<string | null>({
    key: "sessionAtom",
    default: null,
});

// Usage in components
const [session, setSession] = useRecoilState(sessionAtom);
```

### **Server-Side State Management: Redis**

**Redis as Distributed State Store**:
- **Queue Management**: Stores active appointment queues
- **Session State**: Manages ongoing medical sessions
- **Pub/Sub**: Event distribution between Shefu and WebSocket server
- **Message Queue**: `messages` queue for appointment operations

**Benefits**:
- Persistent queue state across service restarts
- Fast in-memory operations
- Distributed architecture support
- Pub/Sub for real-time updates

### **Database State: Prisma + PostgreSQL**

**Persistent Application State**:
- User profiles and authentication
- Appointment history
- Medical records
- Clinic and doctor information
- Payment records

---

## 🔑 Key Features Implemented

### **1. Role-Based Access Control (RBAC)**
- **5 Distinct Roles**: Admin, Clinic Head, Doctor, Front Desk Manager, Patient
- **Parallel Routes**: Next.js `@` slots for role-specific UI (`@admin`, `@doctor`, `@clinicHead`, `@deskManager`)
- **Protected Routes**: Middleware-based authentication and authorization
- **Custom Dashboards**: Each role has tailored views and permissions

### **2. Real-Time Queue Management**
- **Live Updates**: WebSocket integration for instant queue status changes
- **Redis-Powered**: Fast, reliable queue operations
- **Event-Driven**: Shefu engine processes queue events asynchronously
- **Multi-Session Support**: Handles multiple doctors and sessions simultaneously

### **3. Appointment Lifecycle Management**
- **Booking**: Patients can book appointments with doctors
- **Check-in**: QR code-based patient check-in system
- **Queue Tracking**: Real-time position in queue
- **Session Management**: Doctors can start/end sessions
- **Completion**: Prescription generation and payment processing
- **Follow-ups**: Schedule and manage follow-up appointments

### **4. Authentication & Security**
- **NextAuth v5**: Modern authentication with JWT and database sessions
- **Prisma Adapter**: Seamless database integration
- **Password Hashing**: bcryptjs for secure password storage
- **Session Management**: Secure session tokens
- **Protected API Routes**: Server-side authorization

### **5. Data Visualization**
- **Analytics Dashboard**: Charts showing appointment trends, patient flow
- **Recharts Integration**: Interactive, responsive charts
- **Real-time Metrics**: Live statistics on active queues and appointments

### **6. PDF & Document Generation**
- **Prescriptions**: Generate professional prescription PDFs
- **QR Codes**: Patient identification and appointment tracking
- **Medical Reports**: Export patient records as PDFs

### **7. Cloud Integration**
- **Cloudinary**: Image and document upload/storage
- **Optimized Delivery**: CDN-backed media delivery

---

## 🎓 Professional Skills Demonstrated

### **Full-Stack Development**
- Built end-to-end healthcare application from database to UI
- Implemented complex business logic across multiple services
- Integrated third-party APIs and services

### **System Architecture**
- Designed microservices architecture with clear separation of concerns
- Implemented event-driven communication between services
- Utilized Redis for distributed state and real-time features

### **Frontend Excellence**
- Mastered Next.js 14 App Router with advanced features (parallel routes, server components)
- Built reusable component library with Radix UI
- Implemented complex forms with validation
- Created responsive, accessible user interfaces

### **Backend Development**
- Developed WebSocket server for real-time communication
- Built queue management engine with Redis
- Designed RESTful API routes
- Implemented secure authentication flows

### **Database Management**
- Designed normalized database schema with Prisma
- Implemented complex relationships and queries
- Created database migrations and seeding scripts
- Ensured data integrity with constraints and enums

### **DevOps & Tooling**
- Set up Docker containerization for development
- Configured PM2 for process management
- Implemented CI/CD-ready monorepo structure
- Established code quality standards with ESLint and Prettier

### **State Management Expertise**
- Implemented Recoil for client-side state management
- Utilized Redis for distributed state and caching
- Managed complex state across multiple services
- Ensured state consistency in real-time scenarios

---

## 💡 How This Project Helped My Professional Growth

### **Technical Skills**
1. **Modern Web Development**: Gained expertise in Next.js 14, React 19, and TypeScript 5
2. **Real-time Systems**: Learned WebSocket programming and event-driven architectures
3. **Distributed Systems**: Implemented Redis for caching, queuing, and pub/sub messaging
4. **Database Design**: Designed complex relational schemas with Prisma ORM
5. **State Management**: Mastered Recoil for predictable client-side state management
6. **Authentication**: Implemented secure auth flows with NextAuth v5

### **Software Engineering Practices**
1. **Monorepo Management**: Organized large codebase with Yarn Workspaces
2. **Code Reusability**: Created shared packages for database, UI, and configuration
3. **Type Safety**: Leveraged TypeScript for robust, maintainable code
4. **Separation of Concerns**: Clear boundaries between frontend, backend, and data layers

### **Domain Knowledge**
1. **Healthcare Systems**: Understanding of clinical workflows and queue management
2. **User Experience**: Designed intuitive interfaces for diverse user roles
3. **Compliance**: Implemented privacy-focused features (PRIVACY_POLICY.md)

### **Problem-Solving**
1. **Scalability**: Designed system to handle multiple clinics and concurrent users
2. **Real-time Challenges**: Solved synchronization issues between services
3. **Performance**: Optimized with Redis caching and efficient database queries

### **Collaboration & Best Practices**
1. **Code Quality**: Established linting, formatting, and TypeScript standards
2. **Documentation**: Created comprehensive setup and deployment guides
3. **Version Control**: Managed complex feature development in monorepo

---

## 📈 Resume Description Template

**Clinqo - Healthcare Queue Management System**  
*Full-Stack Engineer | N6T Technologies*

Developed a comprehensive healthcare queue management system using a modern monorepo architecture with Next.js 14, Node.js, Redis, and PostgreSQL. Implemented real-time appointment tracking via WebSocket, role-based dashboards for 5 user types, and distributed state management using Recoil and Redis. Built microservices architecture with separate frontend (Next.js), queue engine (Node.js/Redis), and WebSocket server for live updates. Designed normalized database schema with Prisma ORM, featuring complex relationships for users, appointments, clinics, and medical records. Utilized Docker for containerization, PM2 for process management, and integrated Cloudinary for media storage. Demonstrated expertise in TypeScript, React 19, NextAuth v5, TailwindCSS, and event-driven architecture.

**Key Achievements**:
- Architected scalable microservices system with 3 independent services
- Implemented real-time queue updates using WebSocket and Redis pub/sub
- Built responsive UI with Next.js 14 App Router and Recoil state management
- Designed and deployed Docker-based development environment
- Created role-based access control system with NextAuth v5

**Tech Stack**: Next.js 14, React 19, TypeScript 5, Node.js, Redis, PostgreSQL, Prisma ORM, WebSocket, Recoil, NextAuth, TailwindCSS, Docker, PM2, Cloudinary

---

## 🔧 State Management Summary

### **Client-Side: Recoil**
- **Pattern**: Atomic state management
- **Implementation**: Atoms for session management
- **Benefits**: Minimal re-renders, React-friendly API, TypeScript support
- **Use Cases**: User session state, UI state management

### **Server-Side: Redis**
- **Pattern**: Distributed cache and message queue
- **Implementation**: Queue management, pub/sub events
- **Benefits**: High performance, persistence, distributed state
- **Use Cases**: Appointment queues, session management, real-time events

### **Persistent: Prisma + PostgreSQL**
- **Pattern**: Type-safe ORM with migrations
- **Implementation**: Normalized relational schema
- **Benefits**: Data integrity, type safety, migration management
- **Use Cases**: User data, appointments, medical records, clinic information

---

## 📚 Additional Resources

- **README.md**: Setup and installation guide
- **PRIVACY_POLICY.md**: Data handling and privacy compliance
- **docker-compose.yml**: Development environment configuration
- **ecosystem.config.js**: PM2 process management configuration

---

*This document provides a comprehensive overview of the Clinqo repository suitable for resume descriptions, technical interviews, and portfolio presentations.*
