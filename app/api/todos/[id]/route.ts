import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { Todo, TodoInput } from '@/types/todo';

// PUT /api/todos/[id] - Update todo
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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

    const query = `
      UPDATE todos
      SET title = ?, description = ?, category = ?, priority = ?, dueDate = ?, progress = ?
      WHERE id = ?
    `;

    const params = [
      body.title,
      body.description || null,
      body.category || null,
      body.priority || 'medium',
      body.dueDate || null,
      body.progress || 'not_started',
      id,
    ];

    await pool.execute(query, params);

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
  { params }: { params: { id: string } }
) {
  try {
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

