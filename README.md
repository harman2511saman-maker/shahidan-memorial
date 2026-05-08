# یادگاری شەهیدان (Kurdish Martyrs Memorial)

A modern, high-performance web application built with Next.js 15 and Supabase to honor and document the lives of Kurdish martyrs.

## Tech Stack
- **Frontend:** Next.js 15 (App Router), Tailwind CSS 4, Framer Motion
- **Backend:** Supabase (Auth, PostgreSQL, Storage)
- **Icons:** Lucide React
- **Typography:** Inter & Outfit (Google Fonts)

## Features
- **Cinematic Homepage:** Hero section with search and organization filters.
- **Detailed Profiles:** Biography, battle history, gallery, and memorial candles.
- **Submission System:** Multi-step form for users to submit martyr information.
- **Admin Dashboard:** Manage submissions, edit profiles, and view statistics.
- **Responsive Design:** Fully optimized for mobile and desktop.
- **RTL Support:** Full Kurdish (Sorani) language support.
- **Dark Mode:** Deep dark theme inspired by professional memorials.

## Setup Instructions

### 1. Environment Variables
Create a `.env.local` file in the root directory and add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Database Setup
1. Go to your Supabase Project Dashboard.
2. Open the **SQL Editor**.
3. Copy the contents of `supabase_schema.sql` and run it.
4. This will create the necessary tables, seed data, and Row Level Security (RLS) policies.

### 3. Authentication
1. In Supabase, go to **Authentication > Providers**.
2. Enable **Email** and **Google** (optional).
3. Set up a profile as an admin to access the dashboard:
   ```sql
   INSERT INTO profiles (id, full_name, role)
   VALUES ('YOUR_USER_ID', 'Admin Name', 'admin');
   ```

### 4. Running Locally
```bash
npm install
npm run dev
```

## Contributing
We welcome contributions to preserve the history of our heroes. Please submit a Pull Request or open an issue for suggestions.

## License
MIT
