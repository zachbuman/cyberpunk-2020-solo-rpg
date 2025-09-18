# Overview

This is a Cyberpunk 2020 tabletop RPG companion application built as a full-stack web application. The project provides digital character management, campaign progression tracking, and interactive gameplay features for the classic cyberpunk tabletop role-playing game. Users can create and manage cyberpunk characters, track their stats and equipment, participate in guided campaign scenarios, and use digital dice rolling mechanics.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client-side application is built with React 18 using TypeScript and Vite as the build tool. The UI leverages shadcn/ui components with Radix UI primitives for a consistent, accessible component library. Styling is implemented with Tailwind CSS using a cyberpunk-themed design system with custom CSS variables for colors, fonts, and effects.

The application uses Wouter for client-side routing, providing a lightweight alternative to React Router. State management is handled through React Query (TanStack Query) for server state and React's built-in state management for local component state.

## Backend Architecture
The server is built with Express.js running on Node.js with TypeScript. The application follows a RESTful API pattern with dedicated routes for character management, campaign progression, and game state tracking. The server implements middleware for request logging, JSON parsing, and error handling.

The storage layer uses an abstraction pattern with an interface (IStorage) that can be implemented by different storage backends. Currently, it includes an in-memory storage implementation for development, with the structure prepared for database integration.

## Data Storage Solutions
The application is configured to use Drizzle ORM with PostgreSQL as the primary database solution. The database schema defines three main entities:
- Characters: Core character data including stats, skills, equipment, and cyberware
- Campaigns: Campaign progress and story state tracking
- Game States: Real-time game session data and scene management

The schema uses UUID primary keys and JSONB columns for flexible nested data storage, particularly for equipment, skills, and game state data.

## Component Architecture
The UI is organized into specialized components for different game aspects:
- Character management (overview, health, skills, equipment)
- Campaign progression and mission tracking
- Interactive gameplay elements (dice rolling, decision making, combat)
- Form components for character creation and editing

## Game Logic Implementation
The application includes custom game mechanics implemented in TypeScript:
- Dice rolling system supporting D6, D10, and skill checks
- Character archetype system with predefined stats and equipment
- Campaign scenario engine with branching narratives
- Combat state management for turn-based encounters

# External Dependencies

## UI and Styling
- **Radix UI**: Provides accessible, unstyled UI primitives for complex components like dialogs, dropdowns, and form controls
- **Tailwind CSS**: Utility-first CSS framework for responsive design and theming
- **shadcn/ui**: Pre-built component library built on Radix UI with consistent design patterns
- **Lucide React**: Icon library providing cyberpunk-appropriate iconography

## State Management and Data Fetching  
- **TanStack React Query**: Handles server state management, caching, and data synchronization
- **React Hook Form**: Form state management with validation support
- **Zod**: Schema validation for form data and API responses

## Development and Build Tools
- **Vite**: Fast build tool and development server with hot module replacement
- **TypeScript**: Type safety across the entire application stack
- **PostCSS**: CSS processing with autoprefixer support

## Database and ORM
- **Drizzle ORM**: Type-safe database toolkit with migration support
- **Neon Database**: PostgreSQL-compatible serverless database (indicated by @neondatabase/serverless)
- **Drizzle Kit**: Database migration and schema management tool

## Backend Infrastructure
- **Express.js**: Web server framework for RESTful API implementation
- **connect-pg-simple**: PostgreSQL session store for Express sessions
- **nanoid**: Secure URL-friendly unique ID generator for character and session IDs

The application is structured to support both development and production environments with appropriate build configurations and database connection handling.