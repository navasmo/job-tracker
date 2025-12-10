# nmo. Job Tracker

A modern, full-stack job application tracking system with Kanban board and list views. Built with Next.js 16, Tailwind CSS 4, and Neon PostgreSQL.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwind-css)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791?logo=postgresql)

## Features

### Core Functionality
- **Kanban Board**: Drag-and-drop jobs across 6 status columns (Saved, Applied, Interviewing, Offer, Rejected, Withdrawn)
- **List View**: Paginated table with sortable columns and mobile card layout
- **Job Management**: Full CRUD operations with comprehensive job details
- **Search & Filter**: Global search + date range filtering
- **Statistics Dashboard**: Real-time stats with response rate calculation

### User Experience
- **Dark Mode**: System-aware theme with manual toggle
- **Mobile Responsive**: Bottom sheet modals, touch-friendly status picker
- **Company Logos**: Automatic fetching from Clearbit with smart fallbacks
- **Toast Notifications**: Real-time feedback for all actions
- **Optimistic Updates**: Instant UI response with error rollback

### Authentication
- **Email/Password**: Traditional credential-based login
- **OAuth**: GitHub and Google sign-in options
- **Protected Routes**: Middleware-based authentication

## Tech Stack

| Category | Technologies |
|----------|-------------|
| **Framework** | Next.js 16 (App Router) |
| **UI** | React 19, Tailwind CSS 4, Framer Motion |
| **Database** | Neon PostgreSQL, Drizzle ORM |
| **Auth** | Stack Auth (@stackframe/stack) |
| **DnD** | dnd-kit |
| **Icons** | Lucide React |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- [Neon](https://neon.tech) database account
- [Stack Auth](https://stack-auth.com) account (for authentication)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/navasmo/nmo-job-tracker.git
   cd nmo-job-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```

4. **Configure your `.env.local`**
   ```env
   # Database (from Neon dashboard)
   DATABASE_URL=postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require

   # Stack Auth (from Stack dashboard)
   NEXT_PUBLIC_STACK_PROJECT_ID=your-project-id
   NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=your-client-key
   STACK_SECRET_SERVER_KEY=your-secret-key
   ```

5. **Initialize the database**
   ```bash
   npm run db:push
   npm run db:seed  # Optional: seed with sample data
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open** [http://localhost:3000](http://localhost:3000)

## Database Commands

```bash
# Generate migration files from schema changes
npm run db:generate

# Apply migrations to database
npm run db:migrate

# Push schema directly (development)
npm run db:push

# Open Drizzle Studio GUI
npm run db:studio

# Seed database with sample data
npm run db:seed
```

## Project Structure

```
src/
├── app/
│   ├── (auth)/           # Auth pages (login, signup, forgot-password)
│   ├── api/jobs/         # REST API endpoints
│   ├── handler/          # Stack Auth handler
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Dashboard page
├── components/
│   ├── jobs/             # Job-related components
│   │   ├── JobCard.tsx
│   │   ├── JobDetail.tsx
│   │   ├── JobForm.tsx
│   │   ├── KanbanBoard.tsx
│   │   ├── KanbanColumn.tsx
│   │   └── ListView.tsx
│   ├── ui/               # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Select.tsx
│   │   └── StatusPicker.tsx
│   ├── Dashboard.tsx     # Main dashboard logic
│   ├── Header.tsx        # Navigation header
│   ├── Providers.tsx     # Context providers
│   └── StatsBar.tsx      # Statistics bar
├── lib/
│   ├── db/               # Database connection & schema
│   ├── logo.ts           # Company logo utilities
│   ├── stack.ts          # Server auth
│   ├── stack-client.ts   # Client auth
│   └── utils.ts          # Utility functions
├── types/                # TypeScript interfaces
└── middleware.ts         # Auth middleware
```

## API Reference

### Jobs Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/jobs` | List all jobs |
| POST | `/api/jobs` | Create a new job |
| GET | `/api/jobs/[id]` | Get job details with interviews |
| PATCH | `/api/jobs/[id]` | Update a job |
| DELETE | `/api/jobs/[id]` | Delete a job |

### Job Schema

```typescript
interface Job {
  id: number;
  company: string;           // Required
  title: string;             // Required
  status: JobStatus;         // Required
  link?: string;
  location?: string;
  workType?: 'remote' | 'hybrid' | 'in-person';
  expectedSalary?: string;
  payRange?: string;
  dateApplied?: Date;
  resumeUsed?: string;
  notes?: string;
  companyLogo?: string;
  companyDomain?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Add environment variables:
   - `DATABASE_URL`
   - `NEXT_PUBLIC_STACK_PROJECT_ID`
   - `NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY`
   - `STACK_SECRET_SERVER_KEY`
4. Deploy!

### Other Platforms

Works with any Node.js hosting that supports Next.js:
- Railway
- Render
- DigitalOcean App Platform
- AWS Amplify

## Customization

### Adding Status Types

Edit `src/lib/db/schema.ts`:
```typescript
export const jobStatusEnum = pgEnum("job_status", [
  "saved",
  "applied",
  "interviewing",
  "offer",
  "rejected",
  "withdrawn",
  "your-new-status",  // Add here
]);
```

### Adding Company Domains

Edit `src/lib/logo.ts` and add to `KNOWN_DOMAINS`:
```typescript
const KNOWN_DOMAINS: Record<string, string> = {
  // ... existing entries
  "your company": "yourcompany.com",
};
```

### Customizing Colors

Edit `src/app/globals.css` to modify CSS variables or status colors.

## Roadmap

- [ ] Interview tracking with calendar
- [ ] Email reminders for follow-ups
- [ ] Resume version management
- [ ] Export to CSV/PDF
- [ ] Browser extension
- [ ] AI job description analysis

## Documentation

For detailed technical documentation, see [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md).

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) for details.

---

Built with care by [nmo.](https://github.com/navasmo)
