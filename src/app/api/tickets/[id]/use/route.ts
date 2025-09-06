import { NextResponse } from 'next/server';
import { getDbClient } from '@/lib/db';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    if (!id || typeof id !== 'string' || id.length !== 6) {
      return NextResponse.json({ error: 'Invalid Ticket ID format. ID must be a 6-character string.' }, { status: 400 });
    }

    const client = getDbClient(); // Get the client here
    const result = await client.execute({ sql: 'SELECT status FROM tickets WHERE id = ?', args: [id] });

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Ticket not found.' }, { status: 404 });
    }

    const ticket = result.rows[0];
    if (ticket.status === 'used') {
      return NextResponse.json({ error: 'Ticket already used.' }, { status: 409 });
    }

    const now = new Date().toISOString();
    await client.execute({ sql: 'UPDATE tickets SET status = ?, usedAt = ? WHERE id = ?', args: ['used', now, id] });

    return NextResponse.json({ message: 'Ticket used successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Error using ticket:', error);
    return NextResponse.json({ error: 'Failed to use ticket.' }, { status: 500 });
  }
}

