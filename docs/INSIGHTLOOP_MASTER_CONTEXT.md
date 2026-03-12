# InsightLoop Master Context

**Document Version:** 1.0
**Last Updated:** 2026-03-10
**Purpose:** Canonical reference for the InsightLoop system architecture, product design, and technical implementation.

---

## 1. Product Overview

### What is InsightLoop?

InsightLoop is a lightweight analytics and feedback platform designed to help product teams connect user behavior with user feedback to surface actionable product insights.

### Core Problem It Solves

Modern product teams struggle to:
- Track meaningful user events across their applications
- Capture and organize user feedback efficiently
- Connect behavioral data with user sentiment
- Identify users across anonymous and authenticated states
- Get actionable insights without complex analytics infrastructure

InsightLoop solves these problems by providing a privacy-first, developer-friendly platform that combines event tracking with feedback collection in a unified system.

### Target Users

**Primary Users:**
- Product managers tracking feature adoption and user feedback
- Engineering teams instrumenting applications with analytics
- Startups needing lightweight analytics without enterprise complexity
- Teams prioritizing privacy-first analytics

**End Users (tracked by the system):**
- Application end users (anonymous and identified)
- Users providing feedback on products
- Users whose behavior is tracked through events

### Main Product Features

1. **Event Tracking** - Capture user behavior through named events with custom properties
2. **User Identification** - Link anonymous users to identified users seamlessly
3. **Feedback Collection** - Capture user feedback with ratings, text, and metadata
4. **Multi-Environment Support** - Separate data by development, staging, and production
5. **Project Management** - Organize analytics by project with isolated data
6. **Real-time Notifications** - Get notified about events, feedback, and security issues
7. **API Key Management** - Secure SDK integration with environment-specific keys
8. **Privacy-First Design** - Anonymous by default with explicit identification

---

## 2. Core Product Concepts

### Projects

A **Project** is the top-level organizational unit in InsightLoop. Each project represents a distinct product or application being tracked.

**Key Characteristics:**
- Owned by a single user
- Contains isolated event and feedback data
- Has separate API keys per environment
- Configurable notification preferences
- Settings for data retention and auto-archiving

**Relationships:**
- One user can own multiple projects
- Projects contain events, feedback, end users, and API keys

### Events

An **Event** represents a user action or occurrence tracked in the application.

**Key Characteristics:**
- Named action (e.g., "button_clicked", "page_viewed")
- Custom properties (developer-defined JSON data)
- System metadata (device, location, IP, user agent)
- Timestamp (client-provided or server-generated)
- Associated with an end user (anonymous or identified)
- Environment-scoped (development, staging, production)

**Use Cases:**
- Tracking feature usage
- Monitoring user journeys
- Analyzing behavioral patterns
- Debugging user issues

### End Users

An **EndUser** represents a person using the tracked application. End users can be anonymous or identified.

**Key Characteristics:**
- Unique per project
- Can be anonymous (no externalUserId) or identified (has externalUserId)
- Stores email and name when available
- Links to all events and feedback for that user

**Anonymous vs Identified:**
- **Anonymous**: Created automatically, externalUserId is null or anonymousId
- **Identified**: Linked to a userId from the application via identify() call

**Identity Resolution:**
- The `identify()` API merges anonymous user data into identified user records
- All events and feedback are transferred to the identified user
- Original anonymous EndUser records are soft-deleted

### Feedback

**Feedback** represents user-submitted input about the product.

**Key Characteristics:**
- Optional rating (1-5 stars)
- Optional title and message
- Additional info field for context
- Status tracking (NEW, IN_PROGRESS, RESOLVED, CLOSED)
- Custom properties (developer-defined)
- System metadata (device, location, context)
- Environment-scoped
- Associated with an end user

**Use Cases:**
- Bug reports
- Feature requests
- User satisfaction surveys
- Product feedback collection

### Users (Dashboard Users)

**Users** are the people who own and manage InsightLoop projects (distinct from EndUsers).

**Key Characteristics:**
- Authenticated via email/password
- Email verification required
- Can own multiple projects
- Role-based (USER or ADMIN)
- Customizable notification preferences

**Notification Preferences:**
- Global notifications on/off
- Notification channels (IN_APP, EMAIL, SMS, PUSH, WEBHOOK)
- Quiet hours configuration
- Digest frequency (REAL_TIME, DAILY, WEEKLY)

### API Keys

**API Keys** are credentials used by the SDK to send events and feedback to InsightLoop.

**Key Characteristics:**
- Two types: INGESTION (public, SDK) and MANAGEMENT (private, backend)
- Environment-specific (development, staging, production)
- Hashed for security (original key shown only once)
- Trackable (last used timestamp)
- Revocable

**Security Features:**
- Production key misuse detection (warns if prod key used on localhost)
- Rate limiting per key
- Audit logging for production key creation

### Environments

InsightLoop supports three environments to separate data by deployment stage:
- **DEVELOPMENT** - Local and development data
- **STAGING** - Pre-production testing data
- **PRODUCTION** - Live production data

Each API key is scoped to a specific environment, ensuring data isolation.

### Notifications

**Notifications** inform dashboard users about important events in their projects.

**Notification Types:**
- **EVENT** - New events tracked
- **FEEDBACK** - New feedback submitted
- **SECURITY** - API key creation/rotation
- **PROJECT** - Project updates
- **SYSTEM** - System-wide announcements

**Notification Settings:**
- Configured per project (enable/disable by type)
- Delivered via user-selected channels
- Respects user quiet hours
- Can be marked as read or deleted

### Sessions

**Sessions** represent authenticated user sessions for dashboard users.

**Key Characteristics:**
- Tied to a user account
- Contains CSRF token for security
- Expiration and max expiration timestamps
- Tracks user agent and IP
- Revocable (logout functionality)

### Insights & Dashboards

**Current Status:** Not yet implemented in the codebase.

**Intended Purpose:** Insights will be derived analytics that combine events and feedback to surface meaningful patterns, trends, and product opportunities.

**Planned Features:**
- Event analytics and trends
- Feedback sentiment analysis
- User journey visualization
- Anomaly detection

---

## 3. System Architecture

### Overview

InsightLoop is a full-stack Next.js application with an integrated API backend, using PostgreSQL for persistence.

```
┌─────────────────────────────────────────────────────────────┐
│                     InsightLoop SDK                         │
│            (JavaScript, browser or backend)                 │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP (API Key Auth)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  Next.js API Routes                         │
│   /api/events, /api/feedback, /api/identify (SDK)          │
│   /api/projects, /api/notifications (Dashboard)            │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│               Service Layer (Business Logic)                │
│  EventService, FeedbackService, EndUserService, etc.        │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  Prisma ORM Layer                           │
│         (Type-safe database access layer)                   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  PostgreSQL Database                        │
│    (Users, Projects, Events, Feedback, EndUsers, etc.)     │
└─────────────────────────────────────────────────────────────┘
```

### Backend Architecture

**Framework:** Next.js 16 App Router with API Routes

**Structure:**
```
src/
├── api/
│   ├── lib/           # Database client, utilities
│   ├── middleware/    # Auth, API key validation, rate limiting
│   ├── services/      # Business logic layer
│   └── types/         # TypeScript interfaces
├── app/
│   ├── api/           # API route handlers
│   │   ├── auth/      # Authentication endpoints
│   │   ├── events/    # Event ingestion
│   │   ├── feedback/  # Feedback submission
│   │   ├── identify/  # User identification
│   │   ├── projects/  # Project management
│   │   ├── notifications/  # Notification management
│   │   └── user/      # User account management
│   ├── dashboard/     # Dashboard pages
│   ├── settings/      # Settings pages
│   └── auth/          # Auth pages (login, register, etc.)
└── queries/           # React Query hooks for data fetching
```

**Key Architectural Patterns:**
- **Service Layer Pattern** - Business logic isolated in service classes
- **Middleware Chain** - Request validation, auth, rate limiting
- **Transaction Safety** - Critical operations wrapped in Prisma transactions
- **Audit Logging** - All sensitive operations logged to audit trail

### Frontend Architecture

**Framework:** React 19 with Next.js 16 App Router

**State Management:**
- TanStack Query (React Query) for server state
- React hooks for local state
- No global state management library (intentional simplicity)

**Component Structure:**
```
src/
├── app/                    # Next.js pages (route definitions)
├── components/             # Reusable UI components
│   ├── sidebar/           # Navigation sidebar
│   ├── auth/              # Authentication forms
│   ├── project/           # Project components
│   └── templates/email/   # Email templates
└── queries/               # Data fetching hooks
    ├── auth/              # Auth queries
    ├── projects/          # Project queries
    ├── events/            # Event queries
    ├── feedback/          # Feedback queries
    └── notifications/     # Notification queries
```

**UI Library:** Radix UI (headless component primitives)
**Styling:** Tailwind CSS 4

**Key Frontend Patterns:**
- **Server Components** - Default to server rendering for performance
- **Client Components** - Used for interactivity (forms, dropdowns, etc.)
- **Custom Hooks** - Logic separated from presentation (useLogic pattern)
- **React Query** - Caching, background refetching, optimistic updates

### SDK Role in the System

The InsightLoop SDK (currently being developed separately) is the client library that application developers integrate into their apps.

**SDK Responsibilities:**
- Track events via `track(eventName, properties)`
- Identify users via `identify(userId, traits)`
- Submit feedback via `feedback({ rating, message, ... })`
- Manage anonymous ID lifecycle (generate, persist, clear)
- Batch events for network efficiency
- Retry failed requests
- Provide promise-based and callback-based APIs

**SDK Design Principles:**
- Never crash the host application
- Degrade gracefully on network failures
- Minimal bundle size
- Browser and Node.js compatible
- TypeScript-first with full type safety

**Communication:**
- SDK sends HTTP requests to `/api/events`, `/api/feedback`, `/api/identify`
- Uses API key authentication (Bearer token)
- Sends events with custom properties and system metadata
- Respects environment configuration (dev, staging, prod keys)

### API Layer

The API layer follows RESTful conventions with two authentication patterns:

**1. API Key Authentication (SDK/Client Endpoints)**
- `/api/events` (POST, batch)
- `/api/feedback` (POST)
- `/api/identify` (POST)
- Authenticated via `Authorization: Bearer <api_key>` header
- Rate limited per key and per project
- Payload size limits enforced

**2. Session Authentication (Dashboard Endpoints)**
- `/api/projects/*`
- `/api/notifications/*`
- `/api/user/*`
- Authenticated via session cookie
- CSRF protection
- User must be verified and not banned/locked

**Middleware Stack:**
1. Rate limiting (per-IP, per-key, per-project)
2. Authentication (API key or session)
3. Authorization (ownership checks)
4. Validation (Zod schemas)
5. Request handling
6. Error handling & response formatting

### Data Flow

**Event Ingestion Flow:**
```
1. SDK calls POST /api/events with event data
2. requireApiKey middleware validates API key
3. Rate limiting checks
4. EventSchema validates payload
5. Transaction begins
6. EndUserService resolves or creates EndUser
7. EventService creates Event record
8. NotificationService creates notification (if enabled)
9. Transaction commits
10. 201 response returned
```

**Identify Flow:**
```
1. SDK calls POST /api/identify with userId and traits
2. requireApiKey middleware validates API key
3. IdentifySchema validates payload
4. Transaction begins
5. EndUserService.linkAnonymousToIdentified()
   a. Upsert identified EndUser
   b. Find anonymous EndUser(s)
   c. Update events to point to identified user
   d. Update feedback to point to identified user
   e. Soft-delete anonymous EndUser(s)
6. Transaction commits
7. Response with merge results
```

**Feedback Submission Flow:**
```
1. SDK calls POST /api/feedback with feedback data
2. requireApiKey middleware validates API key
3. FeedbackSchema validates payload
4. Transaction begins
5. EndUserService resolves or creates EndUser
6. FeedbackService creates Feedback record
7. NotificationService creates notification (if enabled)
8. Transaction commits
9. 201 response returned
```

**Dashboard Data Retrieval:**
```
1. User navigates to /dashboard/[projectId]
2. Middleware validates session
3. Page component uses React Query hooks
4. Hooks call /api/projects/[projectId]/events
5. requireAuth middleware validates session
6. Service layer queries database with filters
7. Paginated results returned
8. React Query caches data
```

---

## 4. InsightLoop SDK Purpose

### Why the SDK Exists

The SDK exists to provide a simple, reliable, and type-safe way for developers to integrate InsightLoop into their applications without worrying about:
- Network reliability
- Data batching and optimization
- Anonymous user ID management
- Error handling
- API authentication
- Request formatting

### SDK Responsibilities

**Core Responsibilities:**
1. **Anonymous ID Management**
   - Generate unique anonymous IDs
   - Persist IDs in localStorage (browser) or memory (Node.js)
   - Clear IDs on logout
   - Send anonymousId with all events/feedback

2. **Event Tracking**
   - Expose `track(eventName, properties)` method
   - Validate event payloads
   - Attach metadata (timestamp, URL, referrer, etc.)
   - Queue events for batching

3. **User Identification**
   - Expose `identify(userId, traits)` method
   - Send identify requests to link anonymous → identified
   - Update internal state after identification

4. **Feedback Submission**
   - Expose `feedback({ rating, message, ... })` method
   - Attach context (current page, user, device)
   - Send to feedback endpoint

5. **Batching & Transport**
   - Queue events in-memory
   - Flush on interval (e.g., every 5 seconds)
   - Flush on page unload (beacon API)
   - Batch multiple events into single request
   - Respect batch size limits

6. **Retry Logic**
   - Retry failed requests with exponential backoff
   - Persist failed events to localStorage (optional)
   - Drop events after max retries

7. **Configuration**
   - Accept API key, project ID, environment
   - Allow custom batch interval, flush behavior
   - Support debug mode for logging

8. **Error Handling**
   - Catch all errors internally
   - Never throw errors to host application
   - Provide optional error callbacks
   - Log errors in debug mode

### What the SDK Should NOT Do

**Out of Scope:**
- Analytics computation (that's the backend's job)
- Data visualization (that's the dashboard's job)
- User authentication (SDK doesn't authenticate users)
- Session management (SDK doesn't manage user sessions)
- Backend data access (SDK only writes data, doesn't read)
- Complex business logic (SDK is a thin client)

### Expected Functionality

**Initialization:**
```javascript
InsightLoop.init({
  apiKey: 'il_dev_xxxxx',
  environment: 'development', // optional, inferred from key
  batchInterval: 5000, // optional, default 5s
  debug: true, // optional, default false
});
```

**Tracking Events:**
```javascript
// Basic event
InsightLoop.track('Button Clicked', {
  buttonId: 'cta-button',
  page: '/pricing',
});

// Event with custom timestamp
InsightLoop.track('Purchase Completed', {
  amount: 99.99,
  currency: 'USD',
}, {
  timestamp: new Date('2026-03-10T10:30:00Z'),
});
```

**Identifying Users:**
```javascript
// Basic identify
InsightLoop.identify('user_123');

// Identify with traits
InsightLoop.identify('user_123', {
  email: 'user@example.com',
  name: 'John Doe',
  plan: 'premium',
});
```

**Submitting Feedback:**
```javascript
InsightLoop.feedback({
  rating: 5,
  title: 'Great feature!',
  message: 'This new feature is exactly what I needed.',
  additionalInfo: { page: '/dashboard' },
});
```

**Flushing Events:**
```javascript
// Force flush all queued events
await InsightLoop.flush();
```

**Clearing Anonymous ID:**
```javascript
// Clear anonymous ID (e.g., on logout)
InsightLoop.clearAnonymousId();
```

---

## 5. Current Technical Stack

### Frontend Technologies
- **Framework:** Next.js 16.1.1 (React 19.2.3)
- **Language:** TypeScript 5.9.3
- **UI Components:** Radix UI (dropdown-menu, popover, tabs, toast, tooltip)
- **Styling:** Tailwind CSS 4.1.18
- **State Management:** TanStack Query 5.90.20
- **Icons:** Lucide React 0.563.0
- **Date Utilities:** date-fns 4.1.0
- **Fonts:** Geist Sans, Geist Mono

### Backend Technologies
- **Runtime:** Node.js (Next.js API routes)
- **Framework:** Next.js 16 App Router
- **Language:** TypeScript 5.9.3
- **ORM:** Prisma 7.2.0
- **Database Driver:** pg 8.16.3 (PostgreSQL)
- **Authentication:** Custom session-based (Argon2 hashing)
- **Email:** Resend 6.8.0
- **Email Templates:** React Email 1.0.7
- **Validation:** Zod 4.3.5
- **User Agent Parsing:** ua-parser-js 2.0.8
- **Password Hashing:** Argon2 0.44.0

### Database
- **Database:** PostgreSQL
- **ORM:** Prisma 7.2.0
- **Migrations:** Prisma Migrate
- **Seeding:** tsx (TypeScript execution)

### Infrastructure
- **Deployment:** Not specified in codebase (likely Vercel)
- **Environment Variables:** dotenv 17.2.3
- **Build Tool:** Next.js (Turbopack in dev)

### Development Tools
- **Linter/Formatter:** Biome 2.2.0
- **Testing:** Vitest 4.0.18
- **Testing UI:** Vitest UI 4.0.18
- **HTTP Testing:** Supertest 7.2.2
- **Package Manager:** pnpm

### Analytics Pipeline
**Current Status:** Events and feedback are stored in PostgreSQL. No separate analytics processing pipeline yet.

**Future Consideration:** May add:
- Time-series database for fast analytics (e.g., TimescaleDB)
- Message queue for async processing (e.g., Redis, BullMQ)
- Analytics processing workers
- Data export to data warehouses

---

## 6. API Structure

### Authentication

**Two Authentication Methods:**

1. **API Key (Bearer Token)**
   - Used by SDK and external integrations
   - Header: `Authorization: Bearer <api_key>`
   - Validated by `requireApiKey` middleware
   - Validates key hash, checks revocation, project deletion
   - Updates `lastUsedAt` timestamp
   - Detects production key misuse (warns if prod key on localhost)

2. **Session Cookie**
   - Used by dashboard users
   - Cookie: `session_id`, `email_verified`
   - Validated by `requireAuth` middleware
   - Checks session existence, expiration
   - Validates user status (not deleted, banned, or locked)
   - Includes CSRF protection

### Event Ingestion Endpoints

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/events` | POST | API Key | Single event ingestion |
| `/api/events/batch` | POST | API Key | Batch event ingestion (multiple events) |

**Rate Limits:**
- Development: 100 req/min per key, 5k req/min per project
- Staging: 500 req/min per key, 25k req/min per project
- Production: 1000 req/min per key, 50k req/min per project

**Payload Limits:**
- Single event: 32KB
- Batch events: 32KB per request

**Validation:**
- Event name required (string)
- Properties optional (JSON object)
- Timestamp optional (ISO 8601 string, defaults to now)
- Environment validated against API key

**Processing:**
1. Validate API key
2. Check rate limits
3. Validate schema
4. Resolve/create EndUser
5. Create Event record(s)
6. Trigger notifications (if enabled)

### Feedback Endpoints

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/feedback` | POST | API Key | Submit feedback from SDK |
| `/api/projects/[projectId]/feedbacks` | GET | Session | List feedback for project |
| `/api/projects/[projectId]/feedbacks/[id]` | GET | Session | Get single feedback |
| `/api/projects/[projectId]/feedbacks/[id]` | PATCH | Session | Update feedback |
| `/api/projects/[projectId]/feedbacks/[id]` | DELETE | Session | Delete feedback |

**SDK Submission Rate Limits:**
- 1000 req/min per API key
- 50k req/min per project

**Payload Limit:** 24KB

**Validation:**
- Rating optional (1-5)
- Title optional (string)
- Message required (string)
- Additional info optional (string)
- Properties optional (JSON object)

### Authentication Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/authenticate` | POST | Login with email/password |
| `/api/auth/register` | POST | Register new user |
| `/api/auth/logout` | POST | Logout current session |
| `/api/auth/logout-all` | POST | Logout all sessions |
| `/api/auth/verify-email` | POST | Verify email with token |
| `/api/auth/resend-verification` | POST | Resend verification email |
| `/api/auth/forgot-password` | POST | Request password reset |
| `/api/auth/reset-password` | POST | Reset password with token |

**Security Features:**
- Argon2 password hashing
- Rate limiting on sensitive endpoints
- Email verification required
- Password history tracking (prevent reuse)
- Account lockout after failed login attempts
- CSRF token generation
- Generic responses to prevent email enumeration

### Analytics Endpoints

**Project Events:**
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/projects/[projectId]/events` | GET | List events with filters |
| `/api/projects/[projectId]/events/count` | GET | Get total event count |
| `/api/projects/[projectId]/events/first` | GET | Get first event timestamp |
| `/api/projects/[projectId]/events/recent` | GET | Get recent events |
| `/api/projects/[projectId]/recent-activity` | GET | Get mixed events + feedback |

**Filtering & Pagination:**
- Search (event name, user email, user name)
- Filter by event name, date range, end user
- Pagination (max 100 per page)
- Sort by timestamp descending

### Project Management Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/projects` | POST | Create new project |
| `/api/projects` | GET | List user's projects |
| `/api/projects/[projectId]` | GET | Get single project |
| `/api/projects/[projectId]` | PATCH | Update project settings |
| `/api/projects/[projectId]` | DELETE | Delete project |

**Project Settings:**
- Name
- Notification preferences (event, feedback, system, security)
- Auto-archive enabled
- Retention days (default 30)
- Default environment

**Rate Limits (Creation):**
- 3 projects per user per hour
- 10 projects per IP per hour

### API Key Management Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/projects/[projectId]/api-keys` | POST | Create new API key |
| `/api/projects/[projectId]/api-keys` | GET | List API keys |
| `/api/projects/[projectId]/api-keys/[id]/rotate` | POST | Rotate key |
| `/api/projects/[projectId]/api-keys/[id]/revoke` | POST | Revoke key |

**Key Types:**
- INGESTION - Public key for SDK (read-only events/feedback)
- MANAGEMENT - Private key for backend (full access)

**Environments:**
- DEVELOPMENT
- STAGING
- PRODUCTION

**Security:**
- Keys are hashed (SHA-256) before storage
- Original key shown only once at creation
- Production key creation triggers security notification
- Rotation generates new key, revokes old key
- Revocation is irreversible

### User Account Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/user` | GET | Get current user profile |
| `/api/user/me` | GET | Get authenticated user |
| `/api/user/change-password` | POST | Change password |
| `/api/user/delete-me` | DELETE | Delete account |
| `/api/user/notification-preferences` | GET | Get notification settings |
| `/api/user/notification-preferences` | PATCH | Update notification settings |

**Notification Preferences:**
- Global notifications enabled (boolean)
- Notification channels (array: IN_APP, EMAIL, SMS, PUSH, WEBHOOK)
- Quiet hours (start/end times)
- Digest frequency (REAL_TIME, DAILY, WEEKLY)

### Notification Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/notifications` | GET | List notifications |
| `/api/notifications` | DELETE | Delete multiple notifications |
| `/api/notifications/[id]` | GET | Get single notification |
| `/api/notifications/[id]` | PATCH | Update notification |
| `/api/notifications/[id]` | DELETE | Delete notification |
| `/api/notifications/mark-as-read` | PATCH | Mark multiple as read |
| `/api/notifications/mark-all-read` | POST | Mark all as read |
| `/api/notifications/delete-read` | DELETE | Delete all read notifications |
| `/api/notifications/unread-count` | GET | Get unread count |

**Filtering:**
- By project
- By type (EVENT, FEEDBACK, SECURITY, PROJECT, SYSTEM)
- By status (INFO, SUCCESS, WARNING, ERROR)
- By read status
- By date range

---

## 7. Data Model Overview

### Entity-Relationship Diagram (Text Format)

```
User (Dashboard User)
├── id: String (UUID7, PK)
├── firstName, lastName, email: String
├── password: String (Argon2 hashed)
├── role: UserRole (USER, ADMIN)
├── notification preferences
├── timestamps (createdAt, updatedAt, deletedAt, etc.)
├── owns many Project
├── has many Session
├── has many Token
├── has many ApiKey (creator)
├── has many Notification
└── has many AuditLog

Project
├── id: String (UUID7, PK)
├── name: String
├── notification settings (event, feedback, system, security)
├── retention settings (autoArchive, retentionDays)
├── defaultEnvironment: Environment
├── timestamps
├── belongs to User (owner)
├── has many Event
├── has many EndUser
├── has many Feedback
├── has many ApiKey
└── has many Notification

EndUser (Tracked Application User)
├── id: String (UUID7, PK)
├── name, email: String
├── externalUserId: String (null for anonymous, userId for identified)
├── timestamps
├── belongs to Project
├── has many Event
└── has many Feedback

Event
├── id: String (UUID7, PK)
├── eventName: String
├── properties: JSON (custom developer data)
├── metadata: JSON (system-generated)
├── environment: Environment
├── eventTimestamp: DateTime
├── timestamps
├── belongs to Project
└── belongs to EndUser

Feedback
├── id: String (UUID7, PK)
├── rating: Int (1-5, optional)
├── title, message, additionalInfo: String
├── status: FeedbackStatus (NEW, IN_PROGRESS, RESOLVED, CLOSED)
├── properties: JSON (custom)
├── metadata: JSON (system)
├── environment: Environment
├── feedbackTimestamp: DateTime
├── timestamps
├── belongs to Project
└── belongs to EndUser

ApiKey
├── id: String (UUID7, PK)
├── name: String
├── keyHash: String (SHA-256)
├── keyHint: String (first/last chars)
├── type: ApiKeyType (INGESTION, MANAGEMENT)
├── environment: Environment
├── timestamps (createdAt, revokedAt, lastUsedAt)
├── belongs to Project
└── created by User

Session
├── id: String (UUID7, PK)
├── sessionId: String (unique)
├── csrfToken: String
├── expiresAt, maxExpiresAt: DateTime
├── userAgent, ip: String
├── timestamps
└── belongs to User

Token (Email Verification, Password Reset)
├── id: String (UUID7, PK)
├── tokenHash: String
├── type: TokenType (EMAIL_VERIFICATION, PASSWORD_RESET)
├── expiresAt: DateTime
├── usedAt: DateTime (nullable)
├── timestamps
└── belongs to User

Notification
├── id: String (UUID7, PK)
├── title, message: String
├── type: NotificationType (EVENT, FEEDBACK, SECURITY, PROJECT, SYSTEM)
├── status: NotificationStatus (INFO, SUCCESS, WARNING, ERROR)
├── notificationChannel: NotificationChannel
├── read: Boolean
├── actionUrl: String (optional)
├── data: JSON (optional)
├── timestamps (createdAt, readAt)
├── belongs to User
└── optionally belongs to Project

AuditLog
├── id: String (UUID7, PK)
├── action: String
├── metadata: JSON
├── userAgent, ip: String
├── timestamps
└── belongs to User

RateLimitLog
├── id: String (UUID7, PK)
├── key: String (e.g., "login:email:user@example.com")
├── identifier: String (email, API key, IP)
├── createdAt: DateTime
└── used for time-window rate limiting

Feature
├── id: String (UUID7, PK)
├── name: String
├── timestamps
├── belongs to Project
└── created by User
```

### Key Relationships

**User → Project (1:many)**
- One user owns multiple projects
- Projects are isolated per user
- Soft-deletion preserves project data

**Project → Event, Feedback (1:many)**
- All data belongs to a project
- Project deletion cascades to data (via soft-delete)

**EndUser → Event, Feedback (1:many)**
- EndUsers represent tracked application users
- Can be anonymous or identified
- Identity resolution merges anonymous → identified

**Project → EndUser (1:many)**
- EndUsers are scoped to projects
- Same person in different projects = different EndUser records

**User → ApiKey (1:many, creator)**
- Users create API keys for their projects
- Keys are environment-specific

**Project → ApiKey (1:many)**
- Each project has multiple API keys (one per environment)

### Indexes

**Critical Indexes for Performance:**
- `users(email)` - Fast login lookups
- `projects(ownerId, name)` - Fast project listing
- `events(projectId, eventTimestamp)` - Event analytics queries
- `events(projectId, eventName)` - Event filtering
- `feedbacks(projectId, createdAt)` - Feedback listing
- `endUsers(projectId, externalUserId)` - User resolution
- `apiKeys(keyHash, deletedAt, revokedAt, environment)` - API key validation
- `sessions(userId)` - Session validation
- `notifications(userId, read)` - Notification queries

---

## 8. Security Model

### Authentication

**Dashboard Users:**
- **Password Storage:** Argon2 hashing (memory-hard, resistant to GPU attacks)
- **Password History:** Previous 5 password hashes stored to prevent reuse
- **Session Management:**
  - Unique session IDs stored in secure HttpOnly cookies
  - CSRF tokens for state-changing operations
  - Session expiration (default 7 days) and max expiration (30 days)
  - Revocable sessions (logout, logout all)
- **Email Verification:** Required before full access
- **Account Protection:**
  - Rate limiting on login attempts (5 per 10 minutes)
  - Account lockout after repeated failures
  - Banning capability with reason tracking

**API Keys (SDK/Client):**
- **Key Storage:** SHA-256 hashed, never stored in plaintext
- **Key Hint:** First/last 4 characters shown for identification
- **One-Time Display:** Original key shown only at creation
- **Revocation:** Keys can be revoked, making them permanently invalid
- **Rotation:** Generate new key, revoke old key atomically
- **Environment Scoping:** Keys only work in assigned environment
- **Misuse Detection:** Warns when production keys used in development

### Authorization

**Project Ownership:**
- Users can only access projects they own
- All project endpoints verify `ownerId === userId`
- API endpoints check project ownership before data access

**API Key Scoping:**
- INGESTION keys can only write events/feedback (SDK use)
- MANAGEMENT keys have full read/write access (backend use)
- Keys are scoped to a single project
- Keys are scoped to a single environment

**Session Validation:**
- Every protected route checks session validity
- Sessions checked for expiration
- User checked for deleted/banned/locked status

### PII Handling

**Minimal Collection:**
- EndUsers only store name and email (developer-provided)
- No automatic PII scraping from events/feedback
- System metadata (IP, user agent) stored but not exposed in SDK

**Anonymous by Default:**
- Users start anonymous (no externalUserId)
- Identification is explicit via `identify()` call
- Anonymous users can use the product without providing identity

**Data Isolation:**
- Projects are isolated (no cross-project data access)
- EndUsers are project-scoped
- Soft-deletion preserves data for compliance

**GDPR Considerations (Partial):**
- Soft-deletion allows for data recovery
- User account deletion available
- Data retention policies configurable per project
- **Not Yet Implemented:** Data export, right to be forgotten automation

### Event Validation

**Input Validation:**
- All API endpoints use Zod schemas for validation
- Type checking, length limits, format validation
- Custom error messages for clarity

**Payload Size Limits:**
- Events: 32KB max
- Feedback: 24KB max
- Identify: 16KB max
- Prevents memory exhaustion attacks

**Schema Validation:**
- Event names must be strings
- Properties must be valid JSON objects
- Timestamps must be ISO 8601 format
- Required fields enforced

**SQL Injection Prevention:**
- Prisma ORM provides parameterized queries
- No raw SQL in application code
- Type-safe database access

**XSS Prevention:**
- React escapes output by default
- No `dangerouslySetInnerHTML` usage
- Stored data never executed as code

### Rate Limiting

**Authentication Endpoints:**
- Login: 5 attempts per email per 10 minutes
- Register: 5 attempts per IP per 10 minutes
- Forgot Password: 3 attempts per email per 10 minutes
- Prevents brute force and credential stuffing

**SDK Endpoints (API Key):**
- Per-Key Limits:
  - Development: 100 req/min
  - Staging: 500 req/min
  - Production: 1000 req/min
- Per-Project Limits:
  - Development: 5k req/min
  - Staging: 25k req/min
  - Production: 50k req/min
- Prevents abuse and runaway SDK usage

**Dashboard Endpoints:**
- Project Creation: 3 per user per hour, 10 per IP per hour
- Prevents spam and abuse

**Rate Limit Implementation:**
- Stored in `RateLimitLog` table
- Time-window algorithm (sliding window)
- Identifier-based (email, API key, IP)
- Returns 429 status on limit exceeded

### Secrets Management

**Environment Variables:**
- Database URL
- Resend API key (email service)
- App URL (for email links)
- Never committed to version control (.gitignore)

**API Keys:**
- Original keys never logged
- Only hashes stored in database
- Hints stored for user reference

**CSRF Protection:**
- CSRF tokens generated per session
- Validated on state-changing operations
- Rotated on logout

### Audit Logging

**Logged Actions:**
- LOGIN
- REGISTER
- EMAIL_VERIFIED
- PASSWORD_CHANGED
- LOGOUT
- PROJECT_CREATED
- PROJECT_UPDATED
- PROJECT_DELETED
- API_KEY_CREATED
- PRODUCTION_API_KEY_GENERATED

**Audit Log Contents:**
- User ID
- Action name
- Timestamp
- User agent
- IP address
- Metadata (action-specific details)

**Use Cases:**
- Security investigations
- Compliance tracking
- User activity monitoring
- Anomaly detection

---

## 9. Current Implementation Status

### Fully Implemented

✅ **Authentication & Authorization**
- User registration with email verification
- Login with rate limiting
- Password reset flow
- Session management (logout, logout all)
- Email verification required
- CSRF protection

✅ **Project Management**
- Create, read, update, delete projects
- Project ownership validation
- Notification preferences per project
- Retention and auto-archive settings
- Last accessed project tracking

✅ **Event Ingestion**
- Single event submission (`POST /api/events`)
- Batch event submission (`POST /api/events/batch`)
- Event validation and schema enforcement
- Rate limiting per API key and project
- Environment-specific ingestion
- Event listing with filtering and pagination

✅ **User Identification**
- Identify endpoint (`POST /api/identify`)
- Anonymous → Identified user linking
- Event and feedback merging on identification
- EndUser resolution and creation

✅ **Feedback Submission**
- Feedback submission via SDK (`POST /api/feedback`)
- Feedback listing with filters (status, rating, environment)
- Feedback CRUD operations
- Notification triggers on feedback

✅ **API Key Management**
- Create API keys (INGESTION, MANAGEMENT)
- Environment-specific keys (DEV, STAGING, PROD)
- Key rotation and revocation
- Production key misuse detection
- Last used tracking

✅ **Notification System**
- Create notifications (EVENT, FEEDBACK, SECURITY, PROJECT, SYSTEM)
- List notifications with filtering
- Mark as read (single, multiple, all)
- Delete notifications
- Unread count
- Project-level notification preferences
- User-level notification channel preferences (IN_APP, EMAIL, SMS, PUSH, WEBHOOK)
- Quiet hours support
- Digest frequency settings (REAL_TIME, DAILY, WEEKLY)

✅ **User Settings**
- Profile management
- Password change
- Notification preferences
- Account deletion

✅ **Middleware**
- API key authentication and validation
- Session authentication
- Rate limiting (multiple strategies)
- Environment validation
- CSRF protection
- Error handling

✅ **Audit Logging**
- Comprehensive action logging
- User activity tracking
- Security event logging

✅ **Email Service**
- Email verification emails
- Password reset emails
- React Email templates
- Resend integration

✅ **Database Schema**
- Complete Prisma schema
- Indexes optimized for common queries
- Soft deletion support
- Timestamp tracking
- UUID7 IDs for sortable uniqueness

✅ **Frontend (Dashboard)**
- Project dashboard with recent activity
- Event listing and filtering
- Feedback listing and filtering
- Project switcher
- Notification dropdown
- User profile management
- Settings pages (profile, notifications, billing)
- Authentication pages (login, register, forgot password, reset password, verify email)

### Partially Implemented

⚠️ **Analytics & Insights**
- Event counting implemented
- Recent activity feed implemented
- **Missing:** Aggregated analytics, charts, trends, cohort analysis, funnel analysis

⚠️ **SDK**
- API endpoints ready for SDK
- **Missing:** Actual SDK library (separate repository)

⚠️ **Email Notifications**
- In-app notifications working
- Email service configured
- **Missing:** Email delivery for notifications (currently only IN_APP channel works)

⚠️ **Dashboard Visualizations**
- Event listing with pagination
- Feedback listing with filtering
- **Missing:** Charts, graphs, time-series visualizations, event flow diagrams

⚠️ **User Roles**
- User role enum exists (USER, ADMIN)
- **Missing:** Admin-specific features, role-based access control enforcement

⚠️ **API Documentation**
- API endpoints exist and are functional
- **Missing:** OpenAPI/Swagger documentation, SDK documentation

### Not Yet Implemented

❌ **Advanced Analytics**
- Funnel analysis
- Cohort analysis
- Retention charts
- User journey mapping
- Anomaly detection

❌ **Data Export**
- CSV export
- JSON export
- Data warehouse integrations
- GDPR data portability

❌ **Webhooks**
- Webhook delivery for notifications
- Webhook management endpoints
- Retry logic for webhook failures

❌ **SMS Notifications**
- SMS channel integration
- SMS notification delivery

❌ **Push Notifications**
- Push notification service
- Device token management

❌ **Team Collaboration**
- Multi-user projects
- Team roles (owner, admin, member, viewer)
- Invitations and access control

❌ **Alerting**
- Threshold-based alerts (e.g., "notify when errors > 100/hour")
- Anomaly detection alerts

❌ **Integrations**
- Slack integration
- Discord integration
- Jira integration
- GitHub integration

❌ **Advanced Rate Limiting**
- Per-user rate limits on dashboard
- Dynamic rate limits based on plan tier

❌ **Billing & Subscription**
- Stripe integration
- Subscription plans
- Usage-based billing
- Plan limits enforcement

❌ **Data Retention Enforcement**
- Automated data archiving based on `retentionDays`
- Scheduled job to delete old data

❌ **Feature Flags**
- Feature table exists but not utilized
- No feature flag SDK integration

❌ **End User Profiles**
- No UI to view individual end user details
- No user journey timeline

❌ **Feedback Management**
- No workflow for feedback triage
- No assignment to team members
- No internal comments/notes on feedback

---

## 10. Engineering Principles

### Security Practices

1. **Never Trust Client Input**
   - Validate all inputs with Zod schemas
   - Enforce payload size limits
   - Sanitize and escape data before display

2. **Least Privilege Access**
   - API keys scoped to minimal permissions
   - Session-based auth for dashboard
   - Project ownership validated on every request

3. **Defense in Depth**
   - Rate limiting at multiple levels
   - CSRF tokens for state changes
   - Session expiration and revocation
   - Audit logging for sensitive actions

4. **Secure Storage**
   - Password hashing with Argon2
   - API key hashing with SHA-256
   - No plaintext secrets in database
   - Environment variables for secrets

5. **Privacy by Default**
   - Anonymous users by default
   - Explicit identification required
   - Minimal PII collection
   - Soft deletion for data recovery

### Data Validation

1. **Schema Validation**
   - Use Zod for all API inputs
   - Define strict types with TypeScript
   - Fail fast on invalid data

2. **Type Safety**
   - Prisma generates types from schema
   - No `any` types in production code
   - Strict TypeScript configuration

3. **Boundary Validation**
   - Validate at API entry points
   - Trust internal function calls
   - Re-validate before external calls

### Logging

1. **Structured Logging**
   - Use consistent log formats
   - Include context (userId, projectId, apiKeyId)
   - Log levels: ERROR, WARN, INFO, DEBUG

2. **Audit Logging**
   - Log all sensitive actions
   - Include user context and metadata
   - Never log secrets or PII

3. **Error Logging**
   - Catch and log errors with stack traces
   - Don't expose internal errors to clients
   - Return generic error messages publicly

4. **Debug Mode**
   - Optional verbose logging
   - Never enabled in production
   - Helps during development

### Error Handling

1. **Graceful Degradation**
   - API returns appropriate status codes
   - Frontend shows user-friendly messages
   - SDK never crashes host application

2. **Transaction Safety**
   - Use Prisma transactions for multi-step operations
   - Roll back on failure
   - Ensure data consistency

3. **Idempotency**
   - Identify operations are idempotent
   - Event ingestion can be safely retried
   - Use unique constraints to prevent duplicates

4. **Error Responses**
   - 400 Bad Request - Invalid input
   - 401 Unauthorized - Missing/invalid auth
   - 403 Forbidden - Insufficient permissions
   - 404 Not Found - Resource doesn't exist
   - 409 Conflict - Unique constraint violation
   - 429 Too Many Requests - Rate limit exceeded
   - 500 Internal Server Error - Unexpected failure

### Scalability Principles

1. **Database Indexing**
   - Index all foreign keys
   - Index commonly filtered columns
   - Composite indexes for multi-column queries

2. **Query Optimization**
   - Use pagination for large result sets
   - Limit joins to necessary relations
   - Use database aggregations over application code

3. **Caching Strategy (Future)**
   - Cache frequent queries (project settings, user profiles)
   - Cache API key lookups (Redis)
   - Invalidate on writes

4. **Async Processing (Future)**
   - Move non-critical work to background jobs
   - Use message queues for event processing
   - Process notifications asynchronously

5. **Stateless API**
   - No server-side state beyond database
   - Sessions stored in database
   - Horizontally scalable

6. **Rate Limiting**
   - Prevent abuse and runaway costs
   - Protect database from overload
   - Environment-specific limits

---

## 11. Future Vision

### Short-Term (Next 3-6 Months)

**SDK Development**
- Complete JavaScript SDK with all core features
- Browser and Node.js support
- TypeScript types and documentation
- NPM package publication
- Batching and retry logic

**Analytics Dashboard**
- Real-time event charts
- Feedback sentiment trends
- User activity timelines
- Project overview with key metrics

**Enhanced Feedback Management**
- Feedback workflow (triage, assign, resolve)
- Internal notes and comments
- Status automation

**Data Export**
- CSV export for events and feedback
- JSON export for programmatic access
- Basic reporting

### Mid-Term (6-12 Months)

**Advanced Analytics**
- Funnel analysis
- Cohort retention analysis
- User journey visualization
- Anomaly detection

**Team Collaboration**
- Multi-user projects
- Team roles and permissions
- Activity feeds per project
- Commenting and mentions

**Integrations**
- Slack notifications
- Discord webhooks
- Jira ticket creation from feedback
- GitHub issue linking

**Billing & Subscriptions**
- Stripe integration
- Tiered pricing plans
- Usage-based billing
- Plan limits enforcement

**SDK Ecosystem**
- React SDK (hooks, components)
- Python SDK
- Go SDK
- Ruby SDK

### Long-Term (12+ Months)

**AI-Powered Insights**
- Automated anomaly detection
- Predictive churn analysis
- Natural language feedback analysis
- Smart alerting (context-aware)

**Data Warehouse Integration**
- BigQuery export
- Snowflake integration
- Custom data pipelines

**Advanced Privacy Features**
- End-to-end encryption for PII
- Automated GDPR compliance tools
- Data residency options (EU, US)

**Real-Time Features**
- WebSocket support for live dashboards
- Real-time event streaming
- Collaborative dashboard editing

**Enterprise Features**
- SSO (SAML, OAuth)
- Custom SLA agreements
- Dedicated support
- On-premise deployment option

---

## 12. Terminology

### Core Terms

**InsightLoop** - The product name for the analytics and feedback platform.

**Project** - A top-level container representing a tracked application or product.

**Event** - A user action tracked in the application (e.g., "Button Clicked", "Page Viewed").

**Feedback** - User-submitted input about the product (ratings, text, bug reports).

**End User** - A person using the tracked application (distinct from dashboard users).

**Dashboard User** - A person who owns and manages projects in InsightLoop (uses the web dashboard).

**Anonymous User** - An end user who has not been identified (no externalUserId).

**Identified User** - An end user who has been linked to a userId via `identify()`.

**Identity Resolution** - The process of linking an anonymous user to an identified user.

**API Key** - A credential used by the SDK to authenticate with InsightLoop's API.

**Session** - An authenticated session for a dashboard user.

**Environment** - A deployment stage (development, staging, production).

**Notification** - An in-app or external message about events, feedback, or system activity.

**Audit Log** - A record of sensitive actions taken by dashboard users.

**Rate Limit** - A restriction on the number of API requests allowed in a time window.

**Soft Delete** - Marking a record as deleted (`deletedAt`) without physically removing it.

### API Terms

**Ingestion** - The process of receiving and storing events or feedback from the SDK.

**Batching** - Sending multiple events in a single API request.

**Flush** - Forcing queued events to be sent immediately (instead of waiting for batch interval).

**Retry** - Re-attempting a failed API request after a backoff period.

**Idempotent** - An operation that can be safely retried without side effects.

**Payload** - The JSON data sent in an API request body.

**Bearer Token** - An API key sent in the `Authorization: Bearer <key>` header.

### Data Terms

**Properties** - Custom developer-provided data attached to events or feedback.

**Metadata** - System-generated data (device, location, IP, user agent) attached to events or feedback.

**Trait** - An attribute of an identified user (e.g., email, name, plan).

**External User ID** - The application's unique identifier for an end user (e.g., "user_123").

**Anonymous ID** - A unique identifier generated by the SDK for anonymous users.

**End User Resolution** - Finding or creating an EndUser record based on userId/anonymousId.

### Security Terms

**CSRF (Cross-Site Request Forgery)** - An attack where a malicious site tricks a user into making unintended requests.

**Argon2** - A memory-hard password hashing algorithm resistant to GPU attacks.

**Salt** - Random data added to a password before hashing to prevent rainbow table attacks.

**Hash** - A one-way cryptographic function used to store passwords and API keys securely.

**Key Hint** - The first and last few characters of an API key, used for identification.

**Revocation** - Permanently disabling an API key or session.

**Rotation** - Replacing an API key with a new one and revoking the old one.

**Quiet Hours** - A time window during which notifications are suppressed.

---

## 13. Change Log

### Version 1.0 - 2026-03-10
- Initial creation of master context document
- Comprehensive product, architecture, and technical documentation
- Documented current implementation status
- Defined future vision and roadmap

### Future Updates
Document updates will be tracked here with:
- Date of change
- Section(s) modified
- Description of changes
- Changed by (author)

---

## Document Maintenance

This document should be updated whenever:
1. Major architectural changes are made
2. New features are implemented
3. APIs are added, modified, or deprecated
4. Database schema changes occur
5. Security policies are updated
6. Engineering principles evolve

**Document Owner:** Lead Engineering Team
**Review Cadence:** Quarterly or on major releases
**Storage:** `/docs/INSIGHTLOOP_MASTER_CONTEXT.md`

---

**End of Document**
