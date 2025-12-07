# Architecture Documentation

This section provides comprehensive documentation of the system architecture, design decisions, and technical implementation.

## 📚 Documentation in This Section

- **[System Design](./system-design.md)** - High-level architecture overview
- **[Database Schema](./database-schema.md)** - Database design and relationships
- **[Security](./security.md)** - Security architecture and best practices
- **[Technology Stack](./technology-stack.md)** - Technologies and why we chose them

## 🏗️ System Overview

The Equestrian Management System is a modern, serverless web application built on Cloudflare's edge network with a PostgreSQL database hosted on Supabase.

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    User's Browser                           │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTPS
                         │
┌────────────────────────▼────────────────────────────────────┐
│              Cloudflare Global Network                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                                                        │  │
│  │  ┌─────────────────┐         ┌──────────────────┐   │  │
│  │  │   Frontend      │         │    Backend       │   │  │
│  │  │  (React/Vite)   │────────▶│  (Workers API)   │   │  │
│  │  │  Cloudflare     │  API    │   Serverless     │   │  │
│  │  │    Pages        │  Calls  │   Functions      │   │  │
│  │  └─────────────────┘         └──────────┬───────┘   │  │
│  │                                          │            │  │
│  └──────────────────────────────────────────┼───────────┘  │
└─────────────────────────────────────────────┼──────────────┘
                                              │
                                              │ PostgreSQL
                                              │ Protocol
                                              │
                                    ┌─────────▼──────────┐
                                    │    Supabase        │
                                    │   PostgreSQL       │
                                    │    Database        │
                                    └────────────────────┘
```

## 🎯 Design Principles

### 1. Serverless-First

- **No servers to manage** - Cloudflare Workers handle all backend logic
- **Auto-scaling** - Scales automatically with traffic
- **Global distribution** - Runs on Cloudflare's edge network
- **Cost-effective** - Pay only for what you use

### 2. Edge Computing

- **Low latency** - Code runs close to users
- **High availability** - Distributed across 200+ data centers
- **DDoS protection** - Built-in security
- **Global reach** - Same performance worldwide

### 3. Modern Frontend

- **React 18** - Latest React features
- **Vite** - Fast development and builds
- **Component-based** - Reusable UI components
- **Responsive** - Works on all devices

### 4. Managed Database

- **Supabase PostgreSQL** - Fully managed database
- **Real-time** - Built-in real-time capabilities
- **Secure** - Row-level security
- **Scalable** - Grows with your needs

## 🔧 Technology Stack

### Frontend Layer

- **Framework:** React 18
- **Build Tool:** Vite 5
- **Routing:** React Router 6
- **HTTP Client:** Axios
- **Date Handling:** date-fns
- **Hosting:** Cloudflare Pages

### Backend Layer

- **Runtime:** Cloudflare Workers
- **Language:** JavaScript (ES6+)
- **Database Client:** @supabase/supabase-js
- **API Style:** RESTful
- **Deployment:** Wrangler CLI

### Database Layer

- **Database:** PostgreSQL 15
- **Hosting:** Supabase
- **Features:**
  - Foreign keys
  - Triggers
  - Indexes
  - Row-level security

### Development Tools

- **Version Control:** Git
- **Package Manager:** npm
- **Code Editor:** VS Code (recommended)
- **API Testing:** Postman/curl

## 📊 Data Flow

### Read Operation (GET)

```
User → Frontend → API Request → Workers → Supabase → PostgreSQL
                                                    ↓
User ← Frontend ← JSON Response ← Workers ← Supabase ← Data
```

### Write Operation (POST/PUT)

```
User → Frontend → API Request → Workers → Validate → Supabase → PostgreSQL
                                    ↓                              ↓
                                  Error?                         Success
                                    ↓                              ↓
User ← Frontend ← Error Response ← Workers                    Confirmation
                                    ↑                              ↓
User ← Frontend ← Success Response ← Workers ← Supabase ← PostgreSQL
```

## 🔐 Security Architecture

### Authentication

- Supabase Auth (planned)
- JWT tokens
- Secure session management

### Authorization

- Row-level security in PostgreSQL
- API-level validation
- CORS configuration

### Data Protection

- HTTPS everywhere
- Environment variables for secrets
- Input validation and sanitization
- SQL injection prevention

See [Security Guide](./security.md) for details.

## 💾 Database Design

### Core Tables

1. **riders** - Horse riders/students
2. **horses** - Horses and ponies
3. **rider_horse_pairings** - Relationships

### Relationships

- One-to-many: Riders → Pairings
- One-to-many: Horses → Pairings
- Many-to-many: Riders ↔ Horses (through pairings)

### Features

- Automatic timestamps
- Cascade deletes
- Unique constraints
- Indexed columns

See [Database Schema](./database-schema.md) for complete details.

## 🚀 Deployment Architecture

### Environments

**Development:**

- Local development servers
- Development Supabase project
- Cloudflare Workers dev environment

**Production:**

- Cloudflare Pages (frontend)
- Cloudflare Workers (backend)
- Production Supabase project

### CI/CD Pipeline (Planned)

```
Git Push → GitHub Actions → Tests → Build → Deploy → Verify
```

## 📈 Scalability

### Horizontal Scaling

- **Frontend:** Cloudflare's global CDN
- **Backend:** Workers auto-scale
- **Database:** Supabase connection pooling

### Performance Optimization

- Edge caching
- Database indexes
- Efficient queries
- Lazy loading

### Monitoring

- Cloudflare Analytics
- Supabase Dashboard
- Error tracking (planned)
- Performance metrics (planned)

## 🔄 State Management

### Frontend State

- **Local State:** React useState
- **Form State:** Controlled components
- **API State:** Axios + useEffect
- **Future:** Consider Redux/Zustand for complex state

### Backend State

- **Stateless:** Workers are stateless
- **Database:** Single source of truth
- **Caching:** Edge caching (planned)

## 🧩 Component Architecture

### Frontend Components

```
App
├── Header (Navigation)
├── Main Content
│   ├── RidersList
│   │   ├── RiderForm
│   │   └── RiderCard
│   ├── HorsesList
│   │   ├── HorseForm
│   │   └── HorseCard
│   └── PairingsList
│       ├── PairingForm
│       └── PairingCard
└── Footer (planned)
```

### Backend Handlers

```
index.js (Router)
├── riders.js (Rider operations)
├── horses.js (Horse operations)
├── pairings.js (Pairing operations)
└── db.js (Database utilities)
```

## 📖 Design Decisions

### Why Cloudflare Workers?

- ✅ Serverless (no infrastructure management)
- ✅ Global edge network
- ✅ Excellent performance
- ✅ Free tier available
- ✅ Easy deployment

### Why Supabase?

- ✅ Managed PostgreSQL
- ✅ Built-in authentication
- ✅ Real-time capabilities
- ✅ Free tier available
- ✅ Great developer experience

### Why React + Vite?

- ✅ Modern, fast development
- ✅ Large ecosystem
- ✅ Component reusability
- ✅ Excellent tooling
- ✅ Fast builds

### Why PostgreSQL?

- ✅ Reliable and mature
- ✅ ACID compliance
- ✅ Rich feature set
- ✅ Great performance
- ✅ Strong community

## 🆘 Getting Help

- **System Design:** See [System Design](./system-design.md)
- **Database:** See [Database Schema](./database-schema.md)
- **Security:** See [Security Guide](./security.md)
- **Tech Stack:** See [Technology Stack](./technology-stack.md)

---

**Want to understand the system better?** Start with [System Design](./system-design.md)
