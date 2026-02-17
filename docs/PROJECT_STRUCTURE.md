# KS Resume Builder - Project Structure

## 📁 Directory Overview

```
resume-bilder/
├── src/
│   ├── app/                    # App-level components (future use)
│   ├── components/
│   │   ├── layout/            # Layout components (future)
│   │   └── ui/                # ShadCN UI components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       ├── dialog.tsx
│   │       ├── tabs.tsx
│   │       └── ... (17 total)
│   ├── features/              # Feature-based modules
│   │   ├── auth/
│   │   │   ├── AuthLayout.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   └── SignupPage.tsx
│   │   ├── dashboard/
│   │   │   └── DashboardPage.tsx
│   │   ├── landing/
│   │   │   └── LandingPage.tsx
│   │   └── resume-builder/
│   │       └── ResumeBuilderPage.tsx
│   ├── hooks/                 # Custom React hooks
│   │   └── useResume.ts      # Resume CRUD hooks
│   ├── services/              # API services
│   │   ├── ai.ts             # AI generation service
│   │   └── resume.ts         # Resume CRUD service
│   ├── lib/                   # Utilities
│   │   ├── supabase.ts       # Supabase client
│   │   └── utils.ts          # Helper functions (cn)
│   ├── types/                 # TypeScript types
│   │   └── resume.ts         # Resume data types
│   ├── context/               # React Context
│   │   └── AuthContext.tsx   # Authentication context
│   ├── routes/                # Route definitions (future)
│   ├── App.tsx               # Main app component
│   ├── main.tsx              # Entry point
│   └── index.css             # Global styles + Tailwind
├── supabase/
│   ├── functions/
│   │   └── generate-resume/
│   │       └── index.ts      # AI generation edge function
│   └── schema.sql            # Database schema + RLS
├── public/                    # Static assets
├── .env                       # Environment variables
├── components.json            # ShadCN config
├── tailwind.config.js         # Tailwind configuration
├── vite.config.ts            # Vite configuration
├── tsconfig.json             # TypeScript config
├── package.json              # Dependencies
├── README.md                 # Project overview
└── DEPLOYMENT.md             # Deployment guide
```

## 🎯 Key Files Explained

### **Entry Points**
- `src/main.tsx` - App initialization, providers setup
- `src/App.tsx` - Route configuration
- `src/index.css` - Global styles, Tailwind directives, CSS variables

### **Features**
Each feature is self-contained:
- `features/auth/` - Authentication pages (login, signup)
- `features/dashboard/` - Resume management dashboard
- `features/landing/` - Marketing landing page
- `features/resume-builder/` - Resume editor with live preview

### **Services**
- `services/resume.ts` - All resume CRUD operations
- `services/ai.ts` - AI content generation via Supabase Edge Function

### **Hooks**
- `hooks/useResume.ts` - React Query hooks for resume operations
  - `useResumes()` - Fetch all resumes
  - `useResume(id)` - Fetch single resume
  - `useCreateResume()` - Create new resume
  - `useUpdateResume()` - Update resume
  - `useUpdateResumeContent()` - Update resume content
  - `useDeleteResume()` - Delete resume
  - `useDuplicateResume()` - Duplicate resume

### **Context**
- `context/AuthContext.tsx` - Authentication state management
  - `session` - Current session
  - `user` - Current user
  - `signInWithGoogle()` - Google OAuth
  - `signOut()` - Sign out

### **Types**
- `types/resume.ts` - Complete TypeScript definitions
  - `Resume` - Resume document
  - `ResumeContent` - Resume sections
  - `PersonalInfo`, `Experience`, `Education`, etc.

## 🔧 Configuration Files

### `components.json`
ShadCN UI configuration:
- Component path: `@/components`
- Utils path: `@/lib/utils`
- CSS variables enabled
- Tailwind config path

### `tailwind.config.js`
- Dark mode: class-based
- Content: `./index.html`, `./src/**/*.{ts,tsx,js,jsx}`
- Extended theme with CSS variables
- Plugin: `tailwindcss-animate`

### `vite.config.ts`
- Path alias: `@` → `./src`
- React plugin enabled

### `tsconfig.json` & `tsconfig.app.json`
- Strict mode enabled
- Path aliases configured
- ES2022 target

## 🗄️ Database Structure

### Tables
1. **profiles** (extends auth.users)
   - User metadata
   - Plan information
   - Role management

2. **resumes**
   - Resume documents
   - JSONB content field
   - Template selection
   - Status tracking

3. **subscriptions** (future)
   - Stripe integration ready
   - Plan management

### RLS Policies
- Users can only view/edit their own resumes
- Public profile viewing
- Secure by default

## 🎨 UI Components (ShadCN)

Installed components:
- `button` - Primary actions
- `card` - Content containers
- `input` - Form inputs
- `label` - Form labels
- `dialog` - Modals
- `dropdown-menu` - Context menus
- `separator` - Visual dividers
- `badge` - Status indicators
- `progress` - Loading states
- `sheet` - Side panels
- `avatar` - User avatars
- `tabs` - Tab navigation
- `select` - Dropdowns
- `textarea` - Multi-line input
- `scroll-area` - Scrollable containers
- `popover` - Tooltips
- `slider` - Range inputs
- `form` - Form handling
- `skeleton` - Loading placeholders

## 🚀 Scripts

```json
{
  "dev": "vite",                    // Start dev server
  "build": "tsc -b && vite build",  // Production build
  "lint": "eslint .",               // Lint code
  "preview": "vite preview"         // Preview build
}
```

## 📦 Dependencies

### Core
- `react` ^19.2.0
- `react-dom` ^19.2.0
- `react-router-dom` - Routing
- `@supabase/supabase-js` - Backend
- `@tanstack/react-query` - State management

### UI
- `tailwindcss` - Styling
- `clsx` + `tailwind-merge` - Class utilities
- `lucide-react` - Icons
- `framer-motion` - Animations

### Forms
- `react-hook-form` - Form handling
- `zod` - Validation
- `@hookform/resolvers` - Form validation

## 🔐 Environment Variables

```env
VITE_SUPABASE_URL=          # Your Supabase project URL
VITE_SUPABASE_ANON_KEY=     # Your Supabase anon key
```

**Note**: OpenAI API key is stored in Supabase Secrets, not in `.env`

## 📝 Code Style

- **TypeScript**: Strict mode
- **Components**: Functional components with hooks
- **Styling**: Tailwind utility classes
- **State**: React Query for server state, useState for local
- **Naming**: 
  - Components: PascalCase
  - Files: PascalCase for components, camelCase for utilities
  - Functions: camelCase

## 🎯 Best Practices Implemented

1. **Feature-based architecture** - Easy to scale
2. **Type safety** - Full TypeScript coverage
3. **Separation of concerns** - Services, hooks, components
4. **Reusable components** - ShadCN UI system
5. **Optimistic updates** - React Query
6. **Error handling** - Try-catch with user feedback
7. **Loading states** - Skeleton loaders
8. **Responsive design** - Mobile-first approach
9. **Security** - RLS, environment variables
10. **Performance** - Code splitting, lazy loading ready

---

**This structure is production-ready and scalable for enterprise use!**
