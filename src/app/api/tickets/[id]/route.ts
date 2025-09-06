import { NextResponse } from 'next/server';
import { getDbClient } from '@/lib/db';

export const dynamic = "force-dynamic"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    if (!id || typeof id !== 'string' || id.length !== 6) {
      return NextResponse.json({ error: 'Invalid Ticket ID format. ID must be a 6-character string.' }, { status: 400 });
    }

    const client = getDbClient(); // Get the client here
    const result = await client.execute({ sql: 'SELECT * FROM tickets WHERE id = ?', args: [id] });

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Ticket not found.' }, { status: 404 });
    }

    const ticket = result.rows[0];
    return NextResponse.json(ticket, { status: 200 });
  } catch (error) {
    console.error('Error fetching ticket:', error);
    return NextResponse.json({ error: 'Failed to fetch ticket.' }, { status: 500 });
  }
}
