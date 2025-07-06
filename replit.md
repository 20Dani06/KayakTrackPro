# PaddleTracker - Kayaking Performance Tracking App

## Overview

PaddleTracker is a specialized kayaking performance tracking application that serves as "Garmin Connect for kayaking". The app enables paddlers to track their training sessions, monitor performance metrics, and receive intelligent insights about their paddling performance. It focuses on kayak-specific metrics like stroke rate, paddle power, and kayak-adapted VO₂ max calculations.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Router**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management
- **Styling**: Tailwind CSS with custom kayak-themed design system
- **Component Library**: Radix UI primitives with shadcn/ui components
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Session Management**: Express sessions with PostgreSQL store
- **Development**: Hot module replacement via Vite middleware integration

### Database Schema
The application uses PostgreSQL with two main tables:

1. **Sessions Table**: Stores paddling session data
   - Core metrics: date, session type, distance, duration
   - Performance data: heart rate, stroke rate, power output
   - Subjective data: perceived effort, notes

2. **User Settings Table**: Stores user-specific configuration
   - Physical metrics: weight, max heart rate, resting heart rate
   - Calculated metrics: VO₂ max

## Key Components

### Performance Tracking
- **Session Logging**: Comprehensive form for recording paddling sessions
- **Real-time Metrics**: Heart rate, stroke rate, power output tracking
- **Session Types**: Training, race, recovery, technique classifications

### Analytics Engine
- **VO₂ Max Calculation**: Kayak-specific algorithms for aerobic capacity estimation
- **Race Predictions**: Time predictions for 200m, 500m, and 1000m distances
- **Training Zone Analysis**: Heart rate zone distribution and recommendations
- **Performance Insights**: AI-driven analysis of training patterns and efficiency

### User Interface
- **Responsive Design**: Mobile-first approach with dedicated mobile navigation
- **Dashboard**: Performance overview with key metrics and quick actions
- **Session Management**: List view and detailed session tracking
- **Analytics Views**: Charts and visualizations for performance trends

## Data Flow

1. **Session Input**: Users log sessions through the session form component
2. **Data Validation**: Zod schemas validate input data on both client and server
3. **Storage**: Drizzle ORM handles database operations with type safety
4. **Retrieval**: TanStack Query manages data fetching and caching
5. **Analysis**: Performance calculations process raw session data
6. **Presentation**: React components render insights and visualizations

## External Dependencies

### Core Libraries
- **Database**: Drizzle ORM with PostgreSQL dialect
- **Validation**: Zod for schema validation
- **UI Components**: Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with custom design tokens
- **Date Handling**: date-fns for date operations
- **Forms**: React Hook Form with resolver integration

### Development Tools
- **Build System**: Vite with React plugin
- **Development Server**: Express with Vite middleware
- **TypeScript**: Full type safety across the stack
- **ESLint/Prettier**: Code quality and formatting (configured via components.json)

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with Express backend
- **Hot Reload**: Vite HMR for frontend, tsx watch for backend
- **Database**: Local PostgreSQL or Neon Database connection

### Production Build
- **Frontend**: Vite build process creates optimized static assets
- **Backend**: ESBuild bundles server code with external package handling
- **Database**: Drizzle migrations manage schema changes
- **Deployment**: Single-artifact deployment with static assets served by Express

### Environment Configuration
- **Database URL**: Environment variable for PostgreSQL connection
- **Build Commands**: 
  - Development: `npm run dev`
  - Production Build: `npm run build`
  - Production Start: `npm run start`

## Changelog

```
Changelog:
- July 06, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```