import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { Todo, TodoInput } from '@/types/todo';

// GET /api/todos/[id] - Get single todo
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid todo ID' },
        { status: 400 }
      );
    }

    const [rows] = await pool.execute('SELECT * FROM todos WHERE id = ?', [id]);
    const todos = rows as Todo[];

    if (todos.length === 0) {
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(todos[0]);
  } catch (error) {
    console.error('Error fetching todo:', error);
    return NextResponse.json(
      { error: 'Failed to fetch todo' },
      { status: 500 }
    );
  }
}

// PUT /api/todos/[id] - Update todo
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const id = parseInt(params.id);
    const body: TodoInput = await request.json();

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid todo ID' },
        { status: 400 }
      );
    }

    // Check if todo exists
    const [existing] = await pool.execute('SELECT * FROM todos WHERE id = ?', [id]);
    if ((existing as Todo[]).length === 0) {
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      );
    }

    // Validate title if provided
    if (body.title !== undefined && (!body.title || body.title.trim() === '')) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    // Get existing todo to merge with updates
    const existingTodo = (existing as Todo[])[0];

    const query = `
      UPDATE todos
      SET title = ?, description = ?, category = ?, priority = ?, dueDate = ?, progress = ?
      WHERE id = ?
    `;

    const queryParams = [
      body.title !== undefined ? body.title : existingTodo.title,
      body.description !== undefined ? (body.description || null) : existingTodo.description,
      body.category !== undefined ? (body.category || null) : existingTodo.category,
      body.priority || existingTodo.priority || 'medium',
      body.dueDate !== undefined ? (body.dueDate || null) : existingTodo.dueDate,
      body.progress !== undefined ? body.progress : existingTodo.progress || 'not_started',
      id,
    ];

    await pool.execute(query, queryParams);

    // Fetch the updated todo
    const [rows] = await pool.execute('SELECT * FROM todos WHERE id = ?', [id]);
    const todo = (rows as Todo[])[0];

    return NextResponse.json(todo);
  } catch (error) {
    console.error('Error updating todo:', error);
    return NextResponse.json(
      { error: 'Failed to update todo' },
      { status: 500 }
    );
  }
}

// DELETE /api/todos/[id] - Delete todo
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid todo ID' },
        { status: 400 }
      );
    }

    // Check if todo exists
    const [existing] = await pool.execute('SELECT * FROM todos WHERE id = ?', [id]);
    if ((existing as Todo[]).length === 0) {
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      );
    }

    await pool.execute('DELETE FROM todos WHERE id = ?', [id]);

    return NextResponse.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Error deleting todo:', error);
    return NextResponse.json(
      { error: 'Failed to delete todo' },
      { status: 500 }
    );
  }
}

