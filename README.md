# Bookmark App

A modern, real-time bookmark manager built with **Next.js 15**, **Supabase**, and **Tailwind CSS**.
- vercel link: https://bookmark-manager-livid-zeta.vercel.app/
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

##  Challenges & Solutions:

### 1. Real-Time State Synchronization
* **Challenge:** Multi-tab sessions led to "stale" data where an addition in one tab wouldn't appear in another without a manual refresh.
* **Solution:** Integrated **Supabase Realtime** subscriptions to listen for `INSERT` and `DELETE` events. This ensures the UI stays synchronized across all active sessions without redundting similar API .

### 2. Duplicate Prevention in Real-Time Subscriptions
* **Challenge:** Simultaneous actions in multiple tabs could lead to duplicate rendering of the same bookmark during a race condition.
* **Solution:** Implemented **client-side deduplication** within the subscription handler. Before processing an `INSERT` event, the app verifies if the ID already exists in the local state: `if (prev.some(b => b.id === newId))`. This ensures a single source, across various sessions.

### 3. Input Validation & Form UX
* **Challenge:** Preventing "dirty data" (empty entries or invalid URLs) from polluting the database while maintaining a fast entry flow.
* **Solution:** Integrated **pre-submission validation** and state resets (`setTitle("")`). I added support for keyboard shortcuts (Enter to submit), ensuring the UI provides immediate visual feedback and prevents duplicate submissions.

