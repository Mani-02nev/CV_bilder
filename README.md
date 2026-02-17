# 📄 KS Resume Builder

A modern, professional resume builder built with **React**, **Vite**, **Tailwind CSS**, and **Supabase**.

## 🚀 Features

-   **12 Professional Templates**: 4 Free and 8 Premium templates.
-   **Smart Content Generator**: Instantly generate professional summaries and job descriptions based on your role (No API Keys required!).
-   **100% Private & Fast**: Local generation means your data never leaves the browser for AI processing.
-   **Live Interactive Preview**: Real-time resume preview with mobile-friendly scaling.
-   **One-Click PDF Export**: Download your resume in high-quality PDF format.
-   **Admin Dashboard**: Manage users and toggle Pro account status via a secure portal (`/admin`).
-   **Mobile First**: Fully responsive design with smooth animations.

## 📁 Project Documentation

All detailed project documentation, guides, and feature summaries have been moved to the `docs/` folder for a cleaner workspace:

-   [Quick Setup Guide](./docs/QUICK_SETUP.md)
-   [AI Feature Setup](./docs/AI_SETUP.md)
-   [Admin Panel Guide](./docs/LANDING_ADMIN_COMPLETE.md)
-   [User Resume Flow](./docs/RESUME_CREATION_FLOW.md)
-   [Feature Checklist](./docs/CHECKLIST.md)

## 🛠️ Deployment (Vercel + Supabase)

1.  **Vercel Environment Variables**:
    -   `VITE_SUPABASE_URL`: Your Supabase Project URL.
    -   `VITE_SUPABASE_ANON_KEY`: Your Supabase Project Anon Key.
2.  **Supabase Edge Functions**:
    -   Deploy the `generate-resume` function using the Supabase CLI.
    -   Add your `OPENAI_API_KEY` to the Supabase project secrets.

## 💻 Local Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev
```

---
Built with ❤️ for professional career building.
