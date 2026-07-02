<div align="center">

<div align="center">
  <img
    src="./public/images/main-logo-landscape.png"
    alt="Propely Logo"
    width="200"
  />
</div>

# Propely Real Estate

### Modern Real Estate Platform for Buying, Selling & Renting Properties

Built with Next.js, TypeScript, MySQL, Drizzle ORM, Socket.IO, Cloudinary, and Tailwind CSS.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-Type_Safe-C5F74F?style=for-the-badge)

</div>

---

# Overview

**Propely Real Estate** is a full-stack real estate platform that allows users to discover, list, buy, sell, and rent properties through a modern and responsive web experience.

The platform combines property management, interactive maps, advanced filtering, media uploads, user profiles, and real-time messaging into a single application. Instead of forcing users to switch between multiple tools and communication channels, Propely keeps the entire property journey in one place.

Whether users are searching for their next home, publishing property listings, or communicating with buyers and sellers, the experience remains fast, secure, and intuitive across desktop and mobile devices.

---

# Key Features

## Property Marketplace

- Browse available properties for sale and rent
- View detailed property information
- Advanced search and filtering system
- Responsive property grid layouts
- Modern property detail pages

## Interactive Maps

- Property locations displayed on interactive maps
- Location-based property discovery
- Smooth geospatial navigation using Leaflet

## Real-Time Messaging

- Instant communication between buyers and sellers
- Dedicated conversations per property
- Real-time message delivery using Socket.IO
- Unread message tracking
- Message status synchronization

## Property Management

- Create new property listings
- Upload multiple property images
- Edit and manage existing listings
- Rich property descriptions using Lexical Editor

## User Accounts & Authentication

- Secure user authentication
- Role-based access control
- Personalized user profiles
- Listing ownership management

## Media Management

- Cloudinary integration for image uploads
- Optimized media delivery
- Multiple image support
- Responsive image rendering

## Mobile-First Experience

- Fully responsive design
- Mobile-friendly filters
- Bottom sheet interfaces
- Optimized layouts for all screen sizes

---

# Technology Stack

## Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- Zustand
- React Hook Form
- Zod

## Backend

- Next.js Server Actions
- Node.js
- Socket.IO
- Authentication System

## Database

- MySQL
- Drizzle ORM

## Third-Party Services

- Cloudinary
- Leaflet Maps

## Development Tools

- ESLint
- TypeScript
- Drizzle Kit

---

# Project Structure

```bash
Propely-real-estate/
│
├── app/
│   ├── (pages)/
│   ├── api/
│   └── layout.tsx
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── forms/
│   └── shared/
│
├── lib/
│   ├── actions/
│   ├── db/
│   ├── validations/
│   ├── socket/
│   └── stores/
│
├── public/
│
├── server.ts
├── drizzle.config.ts
├── package.json
└── README.md
```

---

# Getting Started

## Prerequisites

Before running the project, make sure you have:

- Node.js 18+
- MySQL 8+
- npm, pnpm, or yarn

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Shahzaib-Awann/propely-real-estate.git

cd propely-real-estate
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root.

```env
# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database
DATABASE_USER=your_db_user
DATABASE_PASSWORD=your_db_password
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_NAME=Propely_real_estate
DATABASE_MAX_CONNECTION=
DATABASE_CA_CERT=

# Authentication
AUTH_SECRET=your_auth_secret

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_CLOUDINARY_API_KEY=your_public_api_key
```

---

### 4. Push Database Schema

```bash
npx drizzle-kit push
```

---

### 5. Start Development Server

```bash
npm run dev
```

---

### 6. Open the Application

```text
http://localhost:3000
```

---

# Real-Time Chat Architecture

Propely includes a custom Socket.IO server that enables real-time communication between users.

### Features

- Property-specific conversations
- Dedicated conversation rooms
- Instant message delivery
- Seen/unseen message tracking
- Live conversation updates

### Flow

```text
Buyer → Opens Property
        ↓
Creates Conversation
        ↓
Joins Socket Room
        ↓
Sends Message
        ↓
Server Broadcasts Event
        ↓
Seller Receives Message Instantly
```

---

# Database Design

The application is built around a relational database structure.

### Core Entities

- Users
- Properties
- Conversations
- Messages
- Property Images
- Favorites
- Saved Listings

Relationships are managed using Drizzle ORM with fully type-safe queries.

---

# Performance Considerations

- Server Components where appropriate
- Optimized image delivery through Cloudinary
- Type-safe database queries with Drizzle ORM
- Real-time communication using Socket.IO
- Efficient state management with Zustand
- Responsive layouts for all device sizes

---

# Roadmap

### Planned Features

- Saved Searches
- Push Notifications
- Advanced Analytics Dashboard
- Admin Management Panel
- Property Verification System
- AI-Powered Property Recommendations
- Multi-Language Support

---

# Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/new-feature
```

3. Commit your changes

```bash
git commit -m "Add new feature"
```

4. Push the branch

```bash
git push origin feature/new-feature
```

5. Open a Pull Request

---

# Author

**Shahzaib Awan**

Full Stack Engineer focused on building scalable SaaS platforms, real-time applications, AI-powered systems, and modern web experiences.

GitHub:
https://github.com/Shahzaib-Awann

Portfolio:
https://shahzaib.is-a.dev

---

# License

This project is 100% free for personal or educational use.

MIT-style open freedom — no restrictions.
