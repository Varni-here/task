# Event Calendar Application

A modern event management application built with Next.js, Prisma, and FullCalendar. Features include recurring events, mobile-responsive design, and CRUD operations.

## Features

- Interactive calendar view with FullCalendar
- Recurring events (daily, weekly, monthly)
- Mobile-responsive design
- Form validation with date restrictions
- Event management with soft delete
- Active/Stopped event filtering
- Event details modal

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Database**: SQLite with Prisma ORM
- **Calendar**: FullCalendar
- **Styling**: Tailwind CSS

## Prerequisites

- Node.js 18+
- npm/yarn/pnpm

## Setup Instructions

### 1. Clone and Install

```bash
git clone 
cd task
npm install
```

### 2. Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Update `.env` with your database path:

```env
DATABASE_URL="file:./dev.db"
```

### 3. Database Setup

Generate Prisma client and run migrations:

```bash
npx prisma generate
npx prisma db push
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.


## API Endpoints

- `GET /api/events` - List all events
- `POST /api/events` - Create new event
- `GET /api/events/[id]` - Get single event
- `PUT /api/events/[id]` - Update event
- `DELETE /api/events/[id]` - Soft delete event

## Database Schema

### Event Model
- `id` - Unique identifier
- `title` - Event title
- `description` - Event description
- `startDate` - Start date/time
- `endDate` - End date/time
- `isRecurring` - Recurring flag
- `frequency` - Recurrence pattern
- `recurringEndDate` - End date for recurring events
- `daysOfWeek` - Days for weekly recurrence
- `isActive` - Soft delete flag
