# MAANG Journey Tracker

A full-stack Next.js application with TypeScript and MySQL database for tracking your journey to becoming a world-class software engineer at MAANG companies.

## Features

- ✅ Create, read, update, and delete todos
- 🏷️ Categorize tasks (e.g., "Algorithms", "System Design", "Projects")
- ⚡ Priority levels (High, Medium, Low)
- 📅 Due dates with visual warnings
- 📊 Progress tracking (Not Started, In Progress, Completed)
- 📝 Rich notes/descriptions for each task
- 🔍 Filter and search functionality
- 📈 Progress statistics dashboard

## Prerequisites

- Node.js 18+ installed
- MySQL server running
- npm or yarn package manager

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure database:**
   - Copy `.env.example` to `.env.local`:
     ```bash
     cp .env.example .env.local
     ```
   - Update `.env.local` with your MySQL credentials:
     ```
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=your_password
     DB_NAME=maang_journey
     ```

3. **Initialize database:**
   ```bash
   npm run init-db
   ```
   This will create the database and todos table if they don't exist.

4. **Seed initial data (optional but recommended):**
   ```bash
   npm run seed
   ```
   This will populate your database with 40+ pre-configured todos including:
   - Algorithm patterns (Two Pointers, Sliding Window, DP, etc.)
   - Data structures (Trees, Heaps, Hash Tables, etc.)
   - Popular LeetCode problems (#1, #15, #53, #206, etc.)
   - System design topics (URL Shortener, Twitter Feed, etc.)
   - Interview prep and projects
   
   **Note:** The seeder will skip if todos already exist to avoid duplicates.

5. **Run the development server:**
   ```bash
   npm run dev
   ```

6. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
maang-journey/
├── app/
│   ├── api/
│   │   └── todos/          # API routes for CRUD operations
│   ├── page.tsx            # Main page
│   └── layout.tsx          # Root layout
├── components/
│   ├── TodoList.tsx        # Main list component
│   ├── TodoForm.tsx        # Create/edit form
│   ├── TodoItem.tsx        # Individual todo item
│   └── FilterBar.tsx       # Filtering component
├── lib/
│   └── db.ts               # MySQL connection utility
├── types/
│   └── todo.ts             # TypeScript type definitions
└── scripts/
    ├── init-db.ts          # Database initialization script
    └── seed.ts             # Database seeder with initial todos
```

## Database Schema

The `todos` table includes:
- `id` - Auto-increment primary key
- `title` - Todo title (required)
- `description` - Detailed notes
- `category` - Task category
- `priority` - low, medium, or high
- `dueDate` - Due date
- `progress` - not_started, in_progress, or completed
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

## Usage

1. **Create a todo:** Click the "Create New Todo" button
2. **Edit a todo:** Click "Edit" on any todo item
3. **Delete a todo:** Click "Delete" on any todo item (confirmation required)
4. **Update progress:** Click the progress button to cycle through: Not Started → In Progress → Completed
5. **Filter todos:** Use the filter bar to search and filter by category, priority, progress, or text search

## Technologies Used

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety
- **MySQL** - Database
- **Tailwind CSS** - Styling
- **date-fns** - Date formatting

## License

MIT
