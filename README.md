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

## 💡 Challenges & Solutions

### 1. Real-Time State Synchronization
* **Challenge:** Multi-tab sessions led to "stale" data where an addition in one tab wouldn't appear in another without a manual refresh.
* **Solution:** Integrated **Supabase Realtime** subscriptions to listen for `INSERT` and `DELETE` events. This ensures the UI stays synchronized across all active sessions without redundant API polling.

### 2. Multi-Tenant Data Privacy (RLS)
* **Challenge:** Preventing unauthorized data access. Relying on client-side filtering is insecure if a user intercepts the API call.
* **Solution:** Enforced **Row Level Security (RLS)** at the PostgreSQL level using `auth.uid() = user_id`. The database itself rejects unauthorized queries, guaranteeing data isolation regardless of frontend logic.

### 3. Latency Compensation (Optimistic UI)
* **Challenge:** Waiting for database round-trips during CRUD operations made the interface feel sluggish and unresponsive.
* **Solution:** Adopted **Optimistic UI updates**. The local state updates immediately while the request is in flight. If the server returns an error, the state **rolls back** to its previous snapshot, maintaining a snappy yet consistent user experience.

### 4. Hydration & Next.js 15 Architecture
* **Challenge:** Integrating browser-only libraries (Framer Motion, Supabase Client) within the Next.js App Router triggered hydration mismatches.
* **Solution:** Refactored the component hierarchy to strictly separate **Server Components** (data fetching) from **Client Components** (interactive UI). This minimized the client-side bundle and ensured error-free hydration of animated elements.
