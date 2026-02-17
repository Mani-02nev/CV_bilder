# KS Resume Builder

Enterprise-grade AI Resume Builder SaaS Platform.

## Features

- **AI-Powered Generation**: Create professional resumes instantly using OpenAI.
- **ATS Optimization**: Ensure your resume is parsed correctly.
- **Multiple Templates**: Choose from professional templates.
- **Real-time Preview**: Edit and view changes live.
- **PDF Export**: High-quality export.

## Tech Stack

- **Frontend**: React, Vite, TypeScript, TailwindCSS, ShadCN UI
- **Backend**: Supabase (Auth, Database, Storage, Edge Functions)
- **AI**: OpenAI API via Supabase Edge Functions

## Architecture

- `src/features`: Modular feature-based architecture (Auth, Dashboard, Builder, etc.)
- `src/components`: Shared UI components (ShadCN)
- `src/lib`: Utilities and Supabase client
- `supabase/`: Database schema and Edge Functions

## Setup

1. **Clone Repository**
2. **Install Dependencies**
   ```bash
   npm install
   ```
3. **Setup Environment Variables**
   Create `.env` based on example.
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. **Deploy Supabase**
   - Run `supabase/schema.sql` in your Supabase SQL Editor.
   - Deploy Edge Function: `supabase functions deploy generate-resume`
   - Set OPENAI_API_KEY in Supabase Secrets.

## Deployment

Build the frontend:
```bash
npm run build
```
Deploy to Vercel or any static host.
