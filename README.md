# 🏠 Broomate — Room Rent Sharing Platform

> **RMIT University — ISYS2101 Software Engineering Project Management**  
> A social networking web application that helps young Vietnamese people find compatible roommates and safe, transparent shared housing — powered by AI compatibility matching and real-time communication.

[![Java](https://img.shields.io/badge/Java-Spring%20Boot-6DB33F?style=flat-square&logo=spring)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=flat-square&logo=firebase)](https://firebase.google.com/)
[![PostgreSQL](https://img.shields.io/badge/JWT-Auth-000000?style=flat-square&logo=jsonwebtokens)](https://jwt.io/)
[![Supabase](https://img.shields.io/badge/Supabase-Storage-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![Swagger](https://img.shields.io/badge/Swagger-API%20Docs-85EA2D?style=flat-square&logo=swagger)](https://swagger.io/)
[![WebSocket](https://img.shields.io/badge/WebSocket-Real--Time-ff6b35?style=flat-square)]()
[![Grade](https://img.shields.io/badge/Grade-HD%2092-brightgreen?style=flat-square)]()

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Live Demo](#-live-demo)
- [Team](#-team)
- [Features](#-features)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [API Documentation](#-api-documentation)
- [Getting Started](#-getting-started)
- [Individual Contributions — Backend Lead](#-individual-contributions--backend-lead)
- [Project Management](#-project-management)
- [Reflections](#-reflections)
- [Links](#-links)

---

## 🔍 Overview

**Broomate** is a full-stack social networking website addressing a critical gap in Vietnam's shared rental market, where rental and deposit fraud has caused losses exceeding 5 billion VND. The platform provides a safe, transparent, and informative space for young people to:

- **Find compatible roommates** through AI-assisted compatibility testing (Gemini LLM)
- **Browse verified room listings** with AI-powered image fraud detection (Google Vision API)
- **Communicate in real time** via WebSocket-based messaging and group chats
- **Make informed decisions** through structured profiles, compatibility scores, and direct landlord contact

The project was delivered as a fully functional MVP within **12 weeks** using a hybrid **Waterfall-Scrum** methodology, achieving an **HD grade of 92**.

---

## 🌐 Live Demo

**🔗 [broomate2211.vercel.app](https://broomate2211.vercel.app/)**

---

## 👥 Team

| # | Name | Student ID | Role |
|---|------|------------|------|
| 1 | **Tran Dang Duong** | S3979381 | **Team Lead + Backend Developer** |
| 2 | Jay Kim | S3726103 | Frontend Developer |
| 3 | Nguyen Pham Tan Hau | S3978175 | Backend Developer |
| 4 | Nguyen Doan Trung Truc | S3974820 | Fullstack / AI Integration |

**Course:** ISYS2101 Software Engineering Project Management  
**Lecturer:** Ms. Anna Lyza Felipe | **Class:** Tut 01 — Monday 8:00–11:00, SGS

---

## ✨ Features

### 🔐 User Identity & Authentication
| Feature | Description |
|---------|-------------|
| Secure Registration | Tenants and landlords register separately with role-specific onboarding flows |
| JWT Authentication | Stateless login with Spring Security + JWT; sessions secured throughout |
| Role-Based Access | RBAC enforces strict access boundaries between Tenant, Landlord, and Admin roles |
| Profile Management | Users update name, avatar, preferences, budget, location, and stay duration |

### 🤝 Roommate Discovery & Compatibility
| Feature | Description |
|---------|-------------|
| Profile Browsing & Swiping | Browse tenant profiles one at a time; swipe right (like) or left (skip) |
| AI Compatibility Check | Gemini LLM generates culturally aware lifestyle questions based on both users' profiles |
| Compatibility Scoring | System calculates and displays a compatibility score with a short explanation before the final swipe decision |
| Connection Approval | Mutual likes unlock a private 1-to-1 messaging channel |

### 🏘️ Room Listings & Trust
| Feature | Description |
|---------|-------------|
| Room Search & Filtering | Browse available rooms; filter by price range, district, stay length, and amenities |
| Room Detail View | Full room page with verified photos, pricing, location, and landlord contact |
| Bookmarking | Save and compare rooms for later review |
| Landlord Room Management | Landlords create, edit, and manage listings through a structured dashboard |
| AI Image Verification | Google Vision API detects fake, duplicate, internet-stolen, or AI-generated room photos |

### 💬 Real-Time Communication
| Feature | Description |
|---------|-------------|
| 1-to-1 Messaging | Real-time private chat between matched tenants via WebSocket |
| Group Chat | Automatically created when two connected tenants both bookmark the same room — includes the landlord |
| Media Sharing | Exchange images and videos within defined size limits |
| Sub-1-second Delivery | WebSocket implementation achieves message delivery under 1 second |
| Notification System | Real-time notifications for new messages and connections |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                             │
│              React (Vercel) — Responsive Web App                │
└──────────────────────┬──────────────────────────────────────────┘
                       │  HTTPS (REST) + WebSocket
┌──────────────────────▼──────────────────────────────────────────┐
│                       SERVER LAYER                              │
│           Java Spring Boot (Render Cloud Platform)              │
│                                                                 │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────────────┐  │
│  │   Spring    │  │  Swagger UI  │  │     WebSocket         │  │
│  │  Security   │  │  API Docs    │  │  (Real-time Messaging) │  │
│  │  JWT + RBAC │  │              │  │                       │  │
│  └─────────────┘  └──────────────┘  └───────────────────────┘  │
└───────┬───────────────────────┬─────────────────────────────────┘
        │                       │
┌───────▼──────────┐   ┌────────▼──────────────────────────────┐
│  Firebase        │   │           External AI Services        │
│  Firestore       │   │  ┌──────────────┐  ┌───────────────┐  │
│  (NoSQL DB)      │   │  │  Gemini LLM  │  │ Google Vision │  │
│                  │   │  │  (Compat.)   │  │ API (Images)  │  │
│  Profiles,       │   │  └──────────────┘  └───────────────┘  │
│  Matches,        │   └───────────────────────────────────────┘
│  Messages        │
└──────────────────┘   ┌───────────────────────────────────────┐
                       │         Supabase Storage              │
                       │   (Media files — images, videos,      │
                       │    documents via cloud bucket)        │
                       └───────────────────────────────────────┘
```

### Key Architecture Decisions
- **Stateless REST API** on Spring Boot enables horizontal cloud scaling
- **WebSocket** handles all real-time messaging — bypassing REST overhead for low-latency delivery
- **Firestore (NoSQL)** chosen for its real-time sync capabilities and flexible schema for profiles, matches, and conversations
- **Supabase storage bucket** separates media from structured data to keep DB lean
- **Swagger** serves as the API contract between FE and BE teams, enforced from the start to prevent integration drift
- **Environment variable configuration** distinguishes dev vs. production — different API keys, CORS origins, and Firestore projects per environment

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React, Vercel | Responsive UI, cloud deployment |
| **Backend** | Java Spring Boot | REST API server, business logic |
| **Authentication** | Spring Security + JWT | Stateless auth, RBAC enforcement |
| **Database** | Firebase Firestore (NoSQL) | Profiles, matches, messages, rooms |
| **Media Storage** | Supabase Cloud Bucket | Images, videos, documents |
| **Real-Time** | WebSocket (STOMP) | Messaging, notifications |
| **AI — Compatibility** | Google Gemini LLM API | Culturally aware compatibility questions |
| **AI — Image Verification** | Google Vision API | Fake/duplicate photo detection |
| **API Documentation** | Swagger / OpenAPI | FE-BE contract, dev documentation |
| **Testing** | JUnit + Mockito | Unit tests for profile matching algorithm |
| **Hosting — Backend** | Render | Spring Boot cloud deployment |
| **Project Management** | Jira (Scrum) | Sprint planning, burndown tracking |
| **Design** | Figma | UI/UX wireframes and prototypes |

---

## 📖 API Documentation

Full Swagger API documentation is available at the backend server endpoint:

```
GET /swagger-ui/index.html
```

The API is organised around the following resource groups:

- **`/auth`** — Registration, login, JWT token management
- **`/users`** — Profile CRUD, preferences, avatar upload
- **`/rooms`** — Room listing CRUD, filtering, bookmarking
- **`/matches`** — Swipe actions, compatibility scoring, connection management
- **`/messages`** — Chat history, group chat creation
- **`/ai`** — Compatibility question generation, image verification

All endpoints require a valid `Bearer <JWT>` header except public auth routes.

---

## 🚀 Getting Started

### Prerequisites
- Java 17+
- Maven 3.8+
- Node.js 18+ (for frontend)
- Firebase project with Firestore enabled
- Supabase project with storage bucket configured

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/RMIT-Vietnam-Teaching/SEPM.git
cd SEPM/backend

# Configure environment variables
cp .env.example .env
# Fill in: FIREBASE_CREDENTIALS, SUPABASE_URL, SUPABASE_KEY,
#          GEMINI_API_KEY, GOOGLE_VISION_KEY, JWT_SECRET

# Run in development mode
mvn spring-boot:run -Dspring.profiles.active=dev

# Run in production mode
mvn spring-boot:run -Dspring.profiles.active=prod
```

### Frontend Setup

```bash
cd SEPM/frontend
npm install
npm run dev       # Development
npm run build     # Production build
```

### Environment Profiles

| Variable | Dev | Prod |
|----------|-----|------|
| `CORS_ORIGIN` | `http://localhost:3000` | `https://broomate2211.vercel.app` |
| `FIREBASE_PROJECT` | `broomate-dev` | `broomate-prod` |
| `LOG_LEVEL` | `DEBUG` | `WARN` |
| `API_BASE_URL` | `http://localhost:8080` | Render backend URL |

---

## 👤 Individual Contributions — Backend Lead

**Name:** Tran Dang Duong (S3979381)  
**Role:** Team Lead + Backend Developer  
**GitHub:** [github.com/RMIT-Vietnam-Teaching/SEPM](https://github.com/RMIT-Vietnam-Teaching/SEPM)  
**Period:** October 2025 – January 2026

---

### 🔧 REST API Development — Spring Boot

Architected and developed the core backend using **Java Spring Boot**, designing a clean layered structure (Controller → Service → Repository) that the entire team built on. Defined the API contract via **Swagger/OpenAPI** from day one, enabling the frontend team to mock and develop UI flows before backend endpoints were complete — significantly reducing integration delays.

Key API responsibilities:
- Designed and implemented all RESTful endpoints across auth, profiles, rooms, matches, and messaging resources
- Enforced consistent request/response schemas and HTTP status codes across the API surface
- Handled all server-side input validation and error response formatting

### 🔐 Authentication & Authorisation — Spring Security + JWT + RBAC

Implemented the complete authentication and authorisation system:

- **JWT-based stateless auth** — users receive a signed token on login, validated on every protected request without server-side session storage
- **Spring Security filter chain** — custom `OncePerRequestFilter` extracts and validates JWT from the `Authorization: Bearer` header
- **Role-Based Access Control (RBAC)** — `TENANT`, `LANDLORD` roles enforced at the endpoint level using `@PreAuthorize` annotations and Spring Security method security
- **Password encryption** — BCrypt hashing for all stored credentials
- Edge cases handled: token expiry, invalid signature, missing roles, concurrent login invalidation

### 🔥 Firestore (NoSQL) — Data Operations

Utilised **Firebase Firestore** to handle all dynamic, relationship-heavy data:

- Designed Firestore collection/document schemas for users, rooms, swipe history, match records, and chat messages
- Implemented complex Firestore queries: compound filtering (e.g., available rooms by district + price range), subcollection traversal for message threads, and batch writes for atomic match creation
- Managed Firestore security rules to enforce data access by authenticated user UID
- Handled Firestore's eventual consistency model in the matching and chat flows

### 📡 WebSocket — Real-Time Messaging

Implemented full-duplex **WebSocket** communication using Spring's STOMP support:

- Configured `WebSocketMessageBrokerConfigurer` with STOMP endpoint and message broker
- Topic-based routing: `/topic/chat/{roomId}` for group chats, `/user/{userId}/queue/messages` for private messages
- Integrated **real-time notifications** for new messages and connection requests
- Achieved **sub-1-second message delivery** in testing under normal load
- Implemented graceful fallback and reconnection handling on the backend

### 🗄️ Supabase — Media Storage

Managed all media file operations via **Supabase Storage**:

- Implemented file upload pipeline: receive multipart file → validate type/size → upload to Supabase bucket → store public URL in Firestore
- Enforced file type allowlisting and filename sanitisation to prevent malicious uploads
- Configured bucket policies to separate tenant media, landlord room photos, and document attachments into logical prefixes
- Handled presigned URL generation for time-limited secure access

### 🧪 Unit Testing — JUnit + Mockito

Wrote unit tests focused on the **profile matching algorithm**:

- Tested compatibility score calculation logic with mocked user preference inputs
- Used **Mockito** to mock Firestore and Gemini API responses, isolating the scoring logic from external dependencies
- Validated edge cases: identical profiles, completely opposing preferences, missing preference fields

```java
@Test
void testCompatibilityScore_shouldReturnHighScore_whenPreferencesMatch() {
    UserProfile userA = mockProfile("HCMC", 3_000_000L, "non-smoker");
    UserProfile userB = mockProfile("HCMC", 2_800_000L, "non-smoker");
    when(geminiService.generateQuestions(any(), any())).thenReturn(mockQuestions);
    
    int score = matchingService.calculateCompatibility(userA, userB);
    
    assertThat(score).isGreaterThanOrEqualTo(80);
}
```

### ⚙️ Environment Configuration

Configured **Spring Profiles** to distinguish dev and production environments:

- Separate `application-dev.properties` and `application-prod.properties` with environment-specific values
- Externalised all secrets (API keys, JWT secret, Firebase credentials) as environment variables — never hardcoded
- Configured CORS allowed origins per profile to prevent cross-origin issues in both local and deployed environments
- Set log levels and Firestore project targets per profile

### 🏗️ Team Lead Responsibilities

- Maintained the **Jira sprint board** — created tickets, assigned story points, tracked burndown
- Led **daily Scrum standups** and weekly sprint review meetings with stakeholders
- Defined and enforced **Git branching strategy** (feature branches → PR → team lead review → main)
- Acted as **Product Owner** — maintained the product backlog and prioritised features using MoSCoW
- Coordinated FE-BE integration sessions to resolve API contract disputes early
- Managed scope and re-planned sprints when AI API limitations or deployment issues arose

---

## 📊 Project Management

### Methodology: Hybrid Waterfall + Scrum

- **Waterfall phase (Weeks 1–2):** Full planning, requirements analysis, UI/UX design, architecture design, and documentation
- **Scrum phase (Weeks 3–12):** 9 weekly sprints with daily standups, sprint reviews, and stakeholder demos

### Sprint Performance

The project was completed **1 week ahead of schedule** (January 5, 2026 vs. planned January 12). The burndown chart consistently tracked at or below the ideal line, with a brief plateau in early sprints during architecture spike investigations.

### Risk Management

17 risks were identified and tracked throughout the project. Key risks that occurred and were mitigated:

| Risk | Outcome |
|------|---------|
| FE-BE Integration Delay | Mitigated via Swagger API-first contract |
| AI LLM Policy Rejection | Mitigated via prompt engineering + rule-based fallback |
| Deployment Environment Conflict | Mitigated by switching from AWS to Render/Vercel |
| Sprint Overcommitment | Mitigated via velocity-based planning and WIP limits |
| Key Person Dependency | Mitigated via shared documentation and task redistribution |

---

## 📖 Reflections

### Successes
- All core MVP features delivered within 12 weeks with a grade of **HD 92**
- AI integration (Gemini compatibility + Google Vision image verification) elevated the product significantly
- Swagger-first API development dramatically reduced FE-BE integration friction
- WebSocket messaging achieved the sub-1-second delivery target
- Hybrid methodology balanced planning rigour with sprint flexibility effectively

### Challenges
- Initial AWS deployment configuration proved too complex within budget constraints — migrated to Render/Vercel, which resolved the issue with minimal delay
- Inconsistent coding conventions across team members added code review overhead
- Free-tier API rate limits required careful usage monitoring and caching strategies

### Future Improvements
- Centralised user action history (currently device-bound via Firestore queries)
- Real-time dashboard updates without manual refresh
- Encrypted password storage for landlord accounts (plaintext is a known gap in the current MVP)
- AI-based chat content moderation (deferred due to privacy concerns and cost)
- Booking and rental agreement system for end-to-end rental flow
- Push notifications for mobile

---

## 🔗 Links

| Resource | Link |
|----------|------|
| 🌐 Live Application | [broomate2211.vercel.app](https://broomate2211.vercel.app/) |
| 📁 GitHub Repository | [RMIT-Vietnam-Teaching/SEPM](https://github.com/RMIT-Vietnam-Teaching/SEPM) |
| 🎥 Video Presentation | [YouTube](https://youtu.be/zy9bL-s8gjA) |
| 📐 Application Flow Diagram | [Google Drive](https://drive.google.com/file/d/1cMVuTndrR50cbMuo5gZebiGaIbAaUqEp/view?usp=sharing) |
| 🏗️ Software Architecture Diagram | [Draw.io](https://drive.google.com/file/d/1Dhh5T0uyn7w9wS0mQ45IZVt7CsPUvx8A/view?usp=sharing) |
| 📋 Work Breakdown Structure | [Draw.io](https://drive.google.com/file/d/1sDamW-9QBe1CGAIWVQ-zoilfFt10oD8d/view?usp=sharing) |
| 📊 Jira Sprint Board | [Jira](https://sepm2025c.atlassian.net/jira/software/projects/SCRUM/boards/1) |
| 🎨 Figma UI/UX Design | [Figma](https://www.figma.com/design/T7WvtLzlkx8rPeDGx3E8s2/Broomate---Product?node-id=0-1) |
| 📊 Use Cases Diagram | [Draw.io](https://drive.google.com/file/d/1f1s6mw4z9IL_Zi_-QyKYIpcFv0QIBOQv/view?usp=sharing) |
| 🗺️ Context Diagram | [Draw.io](https://drive.google.com/file/d/1r-W_dQNw_44JKiW1P8zetdHx5wbq31ro/view?usp=sharing) |

---

<div align="center">

**RMIT University · ISYS2101 Software Engineering Project Management · HD 92**

*Built with Java Spring Boot, React, Firebase, WebSocket, and a lot of sprint planning.*

</div>
