# The SLP Curriculum: Headless Integration Platform

> Designed and built for Elizabeth (Founder, The SLP Curriculum) & Epiphrame  
> Design System: **MarketNest** (Terracotta `#C2410C`, Lora Serif headings, Open Sans body, flat bordered architecture)  
> Stack: **React 18 + Vite + Tailwind CSS + Vercel Serverless API + Rumahweb MySQL Database**

---

## 🚀 Live Demo & Key Capabilities

1. **Top Performance Metrics Bar**: Real-time display showing API connectivity status, 1,000 active interactive lessons, query execution speed (< 5ms), and DOM node virtualization count.
2. **Tab 1: Member Dashboard**:
   - Hero search bar with instant query dispatch.
   - *Continue Where You Left Off* (prominent active session resume).
   - *My Folders & Weekly Therapy Organizer* (quick playlist cards).
   - *Recently Used Activities*, *My Favorites*, and *Newly Added Activities*.
3. **Tab 2: Search & Filter Library (1,000+ Items)**:
   - Multi-facet sidebar filtering by **Domain**, **Specific Target**, **Level** (Isolation to Conversation), **Activity Format**, and **Topic/Theme**.
   - Zero-reload instantaneous search with URL query synchronization.
   - *Save Filter Combination* preset modal.
4. **Tab 3: Step-by-Step Curriculums**:
   - Sequential step progression (Step 1 -> Step 2 -> Step 3 -> Step 4 -> Step 5).
   - Clinician teaching scripts, target levels, and *Suggested Next Lesson* flow.
5. **Tab 4: My Folders & Phase 2 AI Lesson Planner**:
   - Full CRUD folder management (Create, Rename, Delete, Item Management).
   - *Start Therapy Session* sequential playback runner with Private Therapist Notes.
   - Interactive Multi-Goal Selection Engine with dual output generation (*Option A: Quick Guide* vs. *Option B: Full Lesson Plan*).
6. **Interactive Genially Lesson Modal**:
   - Split 60/40 viewport: live interactive slide simulation on the left and Step-by-Step Teaching Script + auto-saving Private Notes on the right.

---

## 🗄️ Setting Up Your Rumahweb MySQL Database

### Step 1: Open phpMyAdmin in cPanel Rumahweb
1. Log in to your **Rumahweb cPanel** account.
2. Under the **Databases** section, click **MySQL Databases** and create a new database (e.g., `user_slpcurriculum`).
3. Create a database user, set a strong password, and assign that user **All Privileges** on the new database.
4. Open **phpMyAdmin**, select your new database, and click the **Import** tab.

### Step 2: Import the Master SQL File
1. Upload the pre-compiled file:
   ```
   database/master-setup.sql
   ```
2. Click **Go** / **Import**.  
   This creates all 9 relational tables (`slp_users`, `slp_curriculums`, `slp_lessons`, `slp_curriculum_steps`, `slp_playlists`, `slp_playlist_items`, `slp_favorites`, `slp_user_progress`, `slp_saved_filters`) and seeds **all 1,000 realistic SLP lesson records**, curriculums, and default user accounts.

### Step 3: Remote MySQL Access in Rumahweb (cPanel)
Because Vercel serverless functions connect to your Rumahweb database over the network:
1. In cPanel Rumahweb, click **Remote MySQL**.
2. Under **Add Access Host**, enter `%` (or your specific Vercel IP range) and click **Add Host**. This allows secure remote connections from your Vercel deployment.

---

## ☁️ Deploying to Vercel

### Step 1: Push Project to GitHub / GitLab
```bash
cd slp-curriculum
git init
git add .
git commit -m "Initial commit: SLP Curriculum headless integration"
# Push to your repository
```

### Step 2: Import Project into Vercel
1. Go to [vercel.com](https://vercel.com) and click **Add New Project**.
2. Select your repository.
3. Framework Preset will auto-detect as **Vite**.
4. Root Directory: `slp-curriculum` (if the repo root is `demo_SLP`, set Root Directory to `slp-curriculum`).

### Step 3: Configure Environment Variables in Vercel
In the Vercel project setup screen, under **Environment Variables**, add:

| Key | Example Value | Description |
|---|---|---|
| `MYSQL_HOST` | `srv123.rumahweb.com` or your server IP | Your Rumahweb database server host |
| `MYSQL_PORT` | `3306` | Default MySQL port |
| `MYSQL_USER` | `user_slpadmin` | Your MySQL database username |
| `MYSQL_PASSWORD` | `your_secure_password` | Your MySQL database user password |
| `MYSQL_DATABASE` | `user_slpcurriculum` | Your MySQL database name |
| `MYSQL_SSL` | `false` | SSL setting (false for standard cPanel) |
| `JWT_SECRET` | `slp-super-secret-jwt-key-2026` | Any strong random string for JWT signing |

> **Note**: Even if your MySQL database credentials are not set immediately, the application includes a built-in high-speed client-side cache and API fallback with all 1,000 lessons so the demo and pitching preview run instantly with zero errors!

---

## 💻 Local Development

```bash
# 1. Navigate to directory
cd slp-curriculum

# 2. Install dependencies
npm install

# 3. Create .env file from template
cp .env.example .env

# 4. Start local development server
npm run dev

# 5. Build for production test
npm run build
```

---

## 🔑 Default Demo Login Credentials

- **Email**: `member@slpcurriculum.com`
- **Password**: `password123`
*(A convenient "Demo Credentials" auto-fill button is available on the login page).*
