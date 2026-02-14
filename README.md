# Bookmark App

A modern, real-time bookmark manager built with **Next.js 15 (App Router)**, **Supabase**, and **Tailwind CSS**.

## Features

- **Authentication**: Secure Google OAuth login via Supabase.
- **Privacy**: Bookmarks are private to each user (enforced by RLS policies).
- **Real-time Sync**: Updates instantly across multiple tabs/devices using Supabase Realtime.
- **Modern UI**: Responsive design with glassmorphism effects and smooth animations (Framer Motion).
- **CRUD Operations**: Add and delete bookmarks seamlessly.

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS v4, Framer Motion
- **Backend/Database**: Supabase (PostgreSQL, Auth, Realtime)
- **Deployment**: Vercel

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/bookmark-app.git
    cd bookmark-app
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up Environment Variables:**
    Create a `.env.local` file in the root directory:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) with your browser.

## Challenges & Solutions

### 1. Real-time Synchronization Across Tabs
**Problem:** Initially, if a user had the app open in two tabs, adding a bookmark in one tab wouldn't reflect in the other without a manual refresh.
**Solution:** Implemented **Supabase Realtime subscriptions**. By subscribing to `postgres_changes` on the `bookmarks` table, the app listens for `INSERT` and `DELETE` events.
*   **Key Detail:** We specifically filtered events by `user_id` to ensure users only receive updates for their own data, optimizing performance and security.

### 2. Ensuring Data Privacy (RLS)
**Problem:** Without proper restrictions, any authenticated user could potentially query all bookmarks in the database.
**Solution:** Implemented **Row Level Security (RLS)** policies in PostgreSQL.
*   **Policy:** `create policy "Users can view own bookmarks" on bookmarks for select using (auth.uid() = user_id);`
*   This ensures that the database engine itself enforces privacy, regardless of client-side logic.

### 3. Handling Optimistic UI Updates
**Problem:** Waiting for the database response before updating the UI made the app feel sluggish.
**Solution:** Adopted an **Optimistic UI** approach. When a user deletes a bookmark, it is immediately removed from the local state (`bookmarks` array) before the API call completes. If the API call fails, the change is reverted, ensuring a snappy user experience.

### 4. Next.js App Router & Client Components
**Problem:** Integrating browser-only libraries (like `framer-motion` and Supabase client) with Next.js Server Components caused hydration errors.
**Solution:** Carefully separated logic into Client Components using the `"use client"` directive. We ensured that interactive elements (like the Dashboard and Login form) are Client Components, while keeping the structural layout server-rendered where possible.
