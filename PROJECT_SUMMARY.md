# nmo. Job Tracker - Project Summary

## Overview

**nmo. Job Tracker** is a modern, full-stack job application tracking system built with Next.js 16. It provides an intuitive Kanban-style board and list view for managing job applications throughout the hiring process, from initial discovery to offer acceptance or rejection.

---

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.0.7 | React framework with App Router |
| React | 19.2.0 | UI library |
| Tailwind CSS | 4.x | Utility-first CSS framework |
| Framer Motion | 12.x | Animation library |
| dnd-kit | 6.x | Drag-and-drop functionality |
| Lucide React | 0.556.0 | Icon library |
| next-themes | 0.4.6 | Dark/light mode support |
| react-hot-toast | 2.6.0 | Toast notifications |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Neon PostgreSQL | - | Serverless PostgreSQL database |
| Drizzle ORM | 0.45.0 | Type-safe ORM |
| @neondatabase/serverless | 1.0.2 | Neon database driver |

### Authentication
| Technology | Version | Purpose |
|------------|---------|---------|
| @stackframe/stack | 2.8.54 | Authentication provider |

### Development Tools
| Technology | Purpose |
|------------|---------|
| TypeScript | 5.x | Type safety |
| ESLint | 9.x | Code linting |
| Drizzle Kit | 0.31.8 | Database migrations |
| tsx | 4.21.0 | TypeScript execution |

---

## Features

### 1. Kanban Board View
- **6 Status Columns**: Saved, Applied, Interviewing, Offer, Rejected, Withdrawn
- **Drag-and-Drop**: Move jobs between columns with dnd-kit
- **Visual Feedback**: Column highlighting on hover, card lift effects
- **Optimistic Updates**: Instant UI updates with API rollback on failure

### 2. List View
- **Paginated Table**: Configurable rows per page (10, 25, 50, 100)
- **Sortable Columns**: Sort by company, title, status, date applied
- **Mobile Card View**: Responsive design switches to cards on mobile
- **Status Picker**: Quick status change without opening details

### 3. Job Management
- **Create Jobs**: Add new job applications with comprehensive details
- **Edit Jobs**: Update any field including status, salary, notes
- **Delete Jobs**: Remove applications with confirmation dialog
- **Job Details Modal**: Full view of all job information

### 4. Job Data Fields
| Field | Type | Description |
|-------|------|-------------|
| Company | Required | Company name |
| Title | Required | Job position title |
| Status | Required | Current application status |
| Location | Optional | Job location |
| Work Type | Optional | Remote/Hybrid/In-Person |
| Expected Salary | Optional | Your salary expectation |
| Pay Range | Optional | Employer's posted range |
| Date Applied | Optional | When you applied |
| Resume Used | Optional | Which resume version |
| Job Link | Optional | URL to job posting |
| Notes | Optional | Personal notes |

### 5. Company Logos
- **Automatic Fetching**: Uses Clearbit API for high-quality logos
- **Domain Guessing**: Maps company names to domains (100+ known companies)
- **Fallback System**: Clearbit → Google Favicon → UI Avatars initials
- **Cached Locally**: Stores logo URLs in database

### 6. Search & Filtering
- **Global Search**: Search by company, title, or location
- **Date Filtering**: All time, Today, Last 7 days, Last 30 days, Custom range
- **Real-time Updates**: Filters apply instantly

### 7. Statistics Dashboard
- **Quick Stats Bar**: Shows count for each status
- **Response Rate**: Percentage of applications with interviews/offers
- **Visual Indicators**: Color-coded badges and icons

### 8. Authentication
- **Email/Password**: Traditional credential login
- **OAuth Providers**: GitHub and Google sign-in
- **Protected Routes**: Middleware redirects unauthenticated users
- **User Menu**: Profile display with sign-out option

### 9. Theme Support
- **Dark Mode**: Full dark theme support
- **System Detection**: Respects OS preference
- **Manual Toggle**: Switch themes via header button
- **Persistent**: Saves preference

### 10. Mobile Responsiveness
- **Bottom Sheet Modals**: Native-feeling modals on mobile
- **Touch-Friendly**: Larger tap targets, status picker for mobile
- **Horizontal Scroll**: Kanban columns scroll horizontally
- **Compact Header**: Condensed navigation on small screens

---

## Database Schema

### Jobs Table
```sql
CREATE TABLE jobs (
  id SERIAL PRIMARY KEY,
  company VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  link TEXT,
  company_logo TEXT,
  company_domain VARCHAR(255),
  expected_salary VARCHAR(100),
  location VARCHAR(255),
  work_type work_type DEFAULT 'hybrid',
  date_applied TIMESTAMP,
  status job_status DEFAULT 'saved' NOT NULL,
  resume_used VARCHAR(255),
  pay_range VARCHAR(100),
  current_salary VARCHAR(100),
  offer_amount VARCHAR(100),
  notes TEXT,
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

### Interviews Table (Future Use)
```sql
CREATE TABLE interviews (
  id SERIAL PRIMARY KEY,
  job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
  interview_number INTEGER NOT NULL,
  person VARCHAR(255),
  date_time TIMESTAMP,
  completed BOOLEAN DEFAULT FALSE,
  follow_up_sent BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

### Activities Table (Audit Log)
```sql
CREATE TABLE activities (
  id SERIAL PRIMARY KEY,
  job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
  type VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

### Enums
- **job_status**: saved, applied, interviewing, offer, rejected, withdrawn
- **work_type**: remote, hybrid, in-person

---

## API Endpoints

### Jobs API

#### GET /api/jobs
Returns all jobs ordered by last updated.

**Response**: `Job[]`

#### POST /api/jobs
Creates a new job application.

**Body**:
```json
{
  "company": "string (required)",
  "title": "string (required)",
  "status": "JobStatus",
  "link": "string",
  "location": "string",
  "workType": "WorkType",
  "expectedSalary": "string",
  "payRange": "string",
  "dateApplied": "ISO date string",
  "resumeUsed": "string",
  "notes": "string"
}
```

**Response**: `Job` (201 Created)

#### GET /api/jobs/[id]
Returns a single job with its interviews.

**Response**: `JobWithInterviews`

#### PATCH /api/jobs/[id]
Updates a job. Any field can be updated.

**Body**: Partial job fields

**Response**: `Job`

#### DELETE /api/jobs/[id]
Deletes a job and cascades to related interviews and activities.

**Response**: `{ success: true }`

---

## Project Structure

```
nmo-job-tracker/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx      # Login page with OAuth
│   │   │   ├── signup/page.tsx     # Registration page
│   │   │   └── forgot-password/    # Password reset
│   │   ├── api/
│   │   │   └── jobs/
│   │   │       ├── route.ts        # GET all, POST new
│   │   │       └── [id]/route.ts   # GET, PATCH, DELETE by ID
│   │   ├── handler/[...stack]/     # Stack Auth handler
│   │   ├── globals.css             # Global styles & CSS variables
│   │   ├── layout.tsx              # Root layout with fonts
│   │   ├── loading.tsx             # Loading state
│   │   └── page.tsx                # Home page (dashboard)
│   ├── components/
│   │   ├── jobs/
│   │   │   ├── JobCard.tsx         # Individual job card
│   │   │   ├── JobDetail.tsx       # Job detail modal content
│   │   │   ├── JobForm.tsx         # Add/Edit job form
│   │   │   ├── KanbanBoard.tsx     # Main Kanban container
│   │   │   ├── KanbanColumn.tsx    # Single status column
│   │   │   └── ListView.tsx        # Table/card list view
│   │   ├── ui/
│   │   │   ├── Badge.tsx           # Status badges
│   │   │   ├── Button.tsx          # Button component
│   │   │   ├── Input.tsx           # Form input
│   │   │   ├── Modal.tsx           # Modal dialog
│   │   │   ├── Select.tsx          # Dropdown select
│   │   │   └── StatusPicker.tsx    # Mobile status selector
│   │   ├── Dashboard.tsx           # Main dashboard logic
│   │   ├── Header.tsx              # Navigation header
│   │   ├── Providers.tsx           # Context providers
│   │   └── StatsBar.tsx            # Statistics display
│   ├── lib/
│   │   ├── db/
│   │   │   ├── index.ts            # Database connection
│   │   │   └── schema.ts           # Drizzle schema
│   │   ├── logo.ts                 # Company logo utilities
│   │   ├── stack.ts                # Server-side auth
│   │   ├── stack-client.ts         # Client-side auth
│   │   └── utils.ts                # Utility functions
│   ├── types/
│   │   └── index.ts                # TypeScript interfaces
│   └── middleware.ts               # Auth middleware
├── scripts/
│   ├── seed.ts                     # Database seeding
│   ├── update-logos.ts             # Batch logo updates
│   ├── update-links.ts             # Link validation
│   ├── check-links.ts              # Link checking
│   └── add-logo-columns.ts         # Migration helper
├── drizzle.config.ts               # Drizzle configuration
├── next.config.ts                  # Next.js configuration
├── tailwind.config.ts              # Tailwind (if needed)
├── tsconfig.json                   # TypeScript config
└── package.json                    # Dependencies
```

---

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require

# Stack Auth
NEXT_PUBLIC_STACK_PROJECT_ID=your-project-id
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=your-client-key
STACK_SECRET_SERVER_KEY=your-secret-key
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Drizzle migrations |
| `npm run db:migrate` | Run migrations |
| `npm run db:push` | Push schema to database |
| `npm run db:studio` | Open Drizzle Studio |
| `npm run db:seed` | Seed database with sample data |

---

## UI/UX Design

### Color Palette
| Color | Hex | Usage |
|-------|-----|-------|
| Primary Blue | #1f95ea | Buttons, links, accents |
| Green | #10b981 | Success, offers, remote |
| Yellow | #febe26 | Warning, interviewing |
| Red | #ef4444 | Danger, rejected |
| Purple | #7C3AED | Response rate indicator |

### Status Colors
| Status | Light Mode | Dark Mode |
|--------|------------|-----------|
| Saved | Gray | Gray |
| Applied | Blue | Blue |
| Interviewing | Yellow/Amber | Yellow/Amber |
| Offer | Green | Green |
| Rejected | Red | Red |
| Withdrawn | Gray | Gray |

### Typography
- **Primary**: Geist Sans (body text)
- **Monospace**: Geist Mono (code)
- **Brand**: Cairo (logo, headings)

---

## Authentication Flow

1. **Unauthenticated User**
   - Middleware checks authentication state
   - Redirects to `/login` with return URL

2. **Login Options**
   - Email/password credentials
   - GitHub OAuth
   - Google OAuth

3. **Authenticated User**
   - Access to dashboard and all features
   - User menu shows email and sign-out option

---

## Mobile Considerations

### Bottom Sheet Modals
- Modals slide up from bottom on mobile
- Max height 90vh with internal scrolling
- Rounded top corners for native feel
- Backdrop tap to close

### Status Picker
- Full-screen overlay on mobile
- Touch-friendly large tap targets
- Visual header with drag indicator
- Replaces drag-and-drop for status changes

### Responsive Breakpoints
- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

---

## Future Enhancements

### Planned Features
- [ ] Interview tracking with calendar integration
- [ ] Email reminders for follow-ups
- [ ] Resume version management
- [ ] Application timeline visualization
- [ ] Export to CSV/PDF
- [ ] Multi-user support with data isolation
- [ ] Browser extension for quick job saving
- [ ] AI-powered job description analysis

### Technical Improvements
- [ ] Offline support with service workers
- [ ] Real-time sync with WebSockets
- [ ] Advanced search with filters
- [ ] Keyboard shortcuts
- [ ] Bulk operations (delete, status change)

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

---

## License

MIT License - See LICENSE file for details.

---

*Last Updated: December 2025*
