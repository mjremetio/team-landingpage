# Portfolio Admin - Modern Portfolio with Content Management

## Overview

A modern, responsive portfolio website with a complete admin panel for content management. The system features a public-facing portfolio that dynamically displays projects, skills, and content, alongside a secure admin interface for managing all content. Built with Next.js 14, TypeScript, and Tailwind CSS, the application uses file-based encrypted storage and is designed for deployment on Vercel's free tier.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: Next.js 14 with App Router for modern React development
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent design
- **Theme System**: Next-themes for dark/light mode support with system preference detection
- **State Management**: React hooks with local state management (no external state library)
- **Form Handling**: React Hook Form with Zod validation for type-safe form management

### Backend Architecture
- **API Routes**: Next.js API routes providing RESTful endpoints for projects, sections, and file uploads
- **Authentication**: Custom JWT-based authentication system optimized for Edge Runtime
- **Middleware**: Next.js middleware for route protection and authentication verification
- **File Handling**: Vercel Blob storage integration for image and document uploads

### Data Storage Solutions
- **Primary Storage**: Encrypted JSON file storage using CryptoJS for data encryption
- **File Structure**: Separate files for projects, sections, and users with encrypted content
- **Caching**: Built-in Next.js caching with ISR (Incremental Static Regeneration)
- **Backup Strategy**: Version-controlled encrypted files in the repository

### Authentication and Authorization
- **Authentication Method**: Custom JWT implementation with HTTP-only cookies
- **Admin Access**: Role-based access control with admin-only routes and API endpoints
- **Session Management**: Secure cookie-based sessions with configurable expiration
- **Route Protection**: Middleware-based protection for admin routes and API endpoints

### Content Management System
- **Dynamic Sections**: Five main content sections (Hero, About, Tools, Contact, Footer) with editable content
- **Project Management**: Full CRUD operations for portfolio projects with image galleries
- **Real-time Updates**: Changes reflect immediately on the public site without deployment
- **Rich Content**: Support for complex content structures including skills, experience, and social links

### API Architecture
- **RESTful Design**: Standard HTTP methods for resource management
- **Error Handling**: Consistent error responses with proper HTTP status codes
- **Validation**: Input validation for all API endpoints with type safety
- **File Upload**: Multi-file upload support with type and size validation

## External Dependencies

### Core Framework Dependencies
- **Next.js 15.5.2**: React framework with App Router and server components
- **React 19.1.0**: Frontend library with latest concurrent features
- **TypeScript**: Type safety and enhanced developer experience

### UI and Styling
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **Radix UI**: Headless component primitives for accessibility
- **Lucide React**: Modern icon library with consistent design
- **Class Variance Authority**: Type-safe variant management for components

### Authentication and Security
- **CryptoJS**: Encryption library for data security and JWT signing
- **bcryptjs**: Password hashing for secure authentication
- **js-cookie**: Cookie management utilities

### Form and Validation
- **React Hook Form**: Performant form library with minimal re-renders
- **Zod**: TypeScript-first schema validation library
- **@hookform/resolvers**: Integration between React Hook Form and Zod

### Vercel Services (Required for Production)
- **@vercel/blob**: File storage service for images and documents
- **@vercel/kv**: Redis-compatible key-value database (alternative storage option)
- **Resend**: Email service for contact form functionality

### Development Tools
- **ESLint**: Code linting with Next.js configuration
- **Turbopack**: Fast build tool for development (Next.js integrated)

### Deployment Configuration
- **Vercel Platform**: Serverless deployment with automatic scaling
- **Environment Variables**: Secure configuration management
- **Edge Runtime**: Optimized performance for authentication middleware