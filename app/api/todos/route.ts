import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { Todo, TodoInput, TodoFilters } from '@/types/todo';

// GET /api/todos - Fetch all todos with filtering support
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filters: TodoFilters = {
      category: searchParams.get('category') || undefined,
      priority: (searchParams.get('priority') as any) || undefined,
      progress: (searchParams.get('progress') as any) || undefined,
      search: searchParams.get('search') || undefined,
    };

    let query = 'SELECT * FROM todos WHERE 1=1';
    const params: any[] = [];

    if (filters.category) {
      query += ' AND category = ?';
      params.push(filters.category);
    }

    if (filters.priority) {
      query += ' AND priority = ?';
      params.push(filters.priority);
    }

    if (filters.progress) {
      query += ' AND progress = ?';
      params.push(filters.progress);
    }

    if (filters.search) {
      query += ' AND (title LIKE ? OR description LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm);
    }

    query += ' ORDER BY createdAt DESC';

    const [rows] = await pool.execute(query, params);
    const todos = rows as Todo[];

    return NextResponse.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch todos' },
      { status: 500 }
    );
  }
}

// POST /api/todos - Create new todo
export async function POST(request: NextRequest) {
  try {
    const body: TodoInput = await request.json();

    if (!body.title || body.title.trim() === '') {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    const query = `
      INSERT INTO todos (title, description, category, priority, dueDate, progress)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const params = [
      body.title,
      body.description || null,
      body.category || null,
      body.priority || 'medium',
      body.dueDate || null,
      body.progress || 'not_started',
    ];

    const [result] = await pool.execute(query, params) as any;
    const insertId = result.insertId;

    // Fetch the created todo
    const [rows] = await pool.execute('SELECT * FROM todos WHERE id = ?', [insertId]);
    const todo = (rows as Todo[])[0];

    return NextResponse.json(todo, { status: 201 });
  } catch (error) {
    console.error('Error creating todo:', error);
    return NextResponse.json(
      { error: 'Failed to create todo' },
      { status: 500 }
    );
  }
}

