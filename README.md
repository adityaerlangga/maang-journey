# MAANG Journey Tracker

A full-stack Next.js application with TypeScript and MySQL database for tracking your journey to becoming a world-class software engineer at MAANG companies.

![Demo Screenshot](./demo.png)

## Features

- ✅ **Full CRUD Operations** - Create, read, update, and delete todos
- 🏷️ **Categories** - Organize tasks by category (e.g., "Algorithms", "System Design", "Projects")
- ⚡ **Priority Levels** - High, Medium, Low with color-coded badges
- 📅 **Due Dates** - Set deadlines with visual warnings for overdue and upcoming tasks
- 📊 **Progress Tracking** - Track status: Not Started → In Progress → Completed
- 📝 **Rich Descriptions** - Add detailed notes and descriptions for each task
- 🔍 **Advanced Filtering** - Filter by category, priority, progress, and search by text
- 📈 **Statistics Dashboard** - View total todos, completed count, in-progress count, and overall progress percentage
- 📄 **Detail Page** - Click any todo card to view full details on a dedicated page
- 📑 **Pagination** - Browse todos with pagination (12 items per page)
- 🎨 **Modern UI** - Beautiful, responsive design with Tailwind CSS
- 🔔 **Toast Notifications** - Get instant feedback on actions
- ⚠️ **Confirmation Dialogs** - Safe delete operations with SweetAlert2

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
│   │   └── todos/
│   │       ├── route.ts          # GET, POST endpoints
│   │       └── [id]/
│   │           └── route.ts      # GET, PUT, DELETE endpoints
│   ├── todos/
│   │   └── [id]/
│   │       └── page.tsx          # Todo detail page
│   ├── page.tsx                  # Main page
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
├── components/
│   ├── TodoList.tsx              # Main list component with pagination
│   ├── TodoForm.tsx              # Create/edit modal form
│   ├── TodoItem.tsx              # Individual todo card
│   ├── FilterBar.tsx             # Filtering component
│   └── Pagination.tsx            # Pagination controls
├── lib/
│   └── db.ts                     # MySQL connection utility
├── types/
│   └── todo.ts                   # TypeScript type definitions
└── scripts/
    ├── init-db.ts                # Database initialization script
    └── seed.ts                   # Database seeder with initial todos
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

### Main Page
1. **Create a todo:** Click the "Create New Todo" button
2. **View todos:** Browse todos in a 4-column grid layout
3. **Filter todos:** Use the filter bar to search and filter by category, priority, progress, or text
4. **Navigate pages:** Use pagination controls to browse through todos (12 per page)
5. **View details:** Click on any todo card to view full details

### Todo Card Actions
- **View Details:** Click anywhere on the card (except buttons) to navigate to detail page
- **Edit:** Click the "Edit" button to modify the todo
- **Delete:** Click the "Delete" button (confirmation required)
- **Change Status:** Use the status dropdown to update progress directly from the card

### Detail Page
- View complete todo information
- Update status using the dropdown
- Edit or delete the todo
- Navigate back to the main page

## Technologies Used

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety
- **MySQL** - Database with connection pooling
- **Tailwind CSS** - Utility-first CSS framework
- **React Select** - Beautiful dropdown components
- **SweetAlert2** - Elegant confirmation dialogs
- **React Hot Toast** - Toast notifications
- **date-fns** - Date formatting utilities

## API Endpoints

- `GET /api/todos` - Fetch all todos (supports query parameters for filtering)
- `POST /api/todos` - Create a new todo
- `GET /api/todos/[id]` - Get a single todo by ID
- `PUT /api/todos/[id]` - Update a todo
- `DELETE /api/todos/[id]` - Delete a todo

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run init-db` - Initialize database and create tables
- `npm run seed` - Seed database with initial todos

## License

MIT
