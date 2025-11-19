# Overview

This is a community organization website built with Next.js 15, featuring event management, user authentication, and administrative capabilities. The application serves as a platform for managing and displaying community events, with user registration, role-based access control, and integration with external services.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Framework**: Next.js 15.3.1 with App Router
- **Rationale**: Leverages React Server Components for improved performance and SEO
- **UI Components**: shadcn/ui components with Radix UI primitives for accessible, customizable interface elements
- **Styling**: Tailwind CSS v4 with custom configuration using PostCSS
- **State Management**: React hooks for local state, server actions for mutations
- **Pros**: Modern React patterns, excellent developer experience, built-in optimizations
- **Cons**: Requires understanding of server vs client components boundary

**Component Library Choices**:
- Radix UI for headless accessible components (Dialog, Slot)
- Lucide React for iconography
- yet-another-react-lightbox for image galleries
- class-variance-authority and clsx for dynamic styling

## Backend Architecture

**API Structure**: Next.js API Routes (App Router format)
- RESTful endpoints under `/api/*` directory
- Route handlers for events, authentication, user management, and integrations
- **Rationale**: Co-located with frontend code, serverless-ready, type-safe with TypeScript

**Authentication & Authorization**:
- Auth0 integration for user authentication
- Custom callback handling for user synchronization with local database
- Role-based access control (ADMIN, STAFF roles)
- Session management through Auth0's Next.js SDK
- **Rationale**: Offloads authentication complexity, provides enterprise-grade security
- **Pros**: Social login support, secure session handling, scalable
- **Cons**: External dependency, requires careful configuration

**Password Hashing**: bcrypt for local password storage (backup authentication)
- **Rationale**: Industry standard for secure password hashing
- **Alternative**: Auth0 handles primary authentication

**Rate Limiting**:
- Upstash Rate Limit for API protection
- express-rate-limit as middleware
- **Rationale**: Prevents abuse, protects against DDoS
- **Implementation**: Redis-backed rate limiting via Upstash

## Data Layer

**ORM**: Prisma 6.7.0
- Type-safe database client generation
- Schema-first development approach
- Migration management
- Seeding support via `prisma/seed.ts`
- **Rationale**: Excellent TypeScript support, intuitive API, great DX
- **Pros**: Type safety, auto-completion, easy migrations
- **Cons**: Can generate large client bundles

**Database Schema Design**:
- Users table with Auth0 integration
- Events with rich metadata (title, description, dates, location, images)
- Event registrations with user relationships
- Integration settings for external services
- Role-based permissions model

**Connection Management**:
- Singleton pattern for Prisma Client to prevent connection exhaustion
- Build-time client generation required for Vercel deployments
- **Challenge**: Vercel caching requires explicit `prisma generate` in build script

## External Dependencies

**Authentication Provider**:
- **Auth0**: User authentication and session management
- Integration via `@auth0/nextjs-auth0` SDK
- Custom sync logic to maintain local user records

**Rate Limiting Service**:
- **Upstash Redis**: Distributed rate limiting backend
- Serverless-compatible Redis for session and rate limit storage
- **Rationale**: Serverless-native, global replication, minimal configuration

**Deployment Platform**:
- **Vercel**: Primary deployment target based on build logs
- Optimized for Next.js with automatic deployments
- **Configuration**: Custom build command includes Prisma generation

**Third-party Integrations**:
- Instagram API integration (route: `/api/instagram`)
- Structured data for SEO (JSON-LD format)
- **Purpose**: Social media content display, search engine optimization

**Validation**:
- **Zod**: Runtime type validation and schema definition
- Used for API request/response validation
- **Rationale**: TypeScript-first, composable schemas, excellent error messages

**Development Tools**:
- TypeScript 5 for type safety across the entire stack
- ESLint with Next.js configuration for code quality
- ts-node for running TypeScript scripts (seeding)

## Architectural Decisions

**Server vs Client Components**:
- Default to Server Components for data fetching
- Client Components marked with 'use client' directive for interactivity
- **Challenge**: Proper boundary management between server and client
- **Solution**: Clear separation with authentication hooks on client side

**Image Handling**:
- Next.js Image component for optimization
- Lightbox component for gallery views
- **Consideration**: Images stored as URLs in database

**Error Handling**:
- Try-catch blocks in API routes
- Standardized error responses with appropriate HTTP status codes
- Client-side error boundaries for graceful degradation

**Build Process**:
- Prisma client generation before Next.js build
- Explicit dependency installation for Vercel
- Turbopack enabled for development (`--turbopack` flag)
- **Rationale**: Faster development builds, production-ready outputs