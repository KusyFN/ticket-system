import { NextResponse } from 'next/server';
import { getDbClient } from '@/lib/db';
import { generateTicketId } from '@/lib/utils';

// 品目のリストを定義
const allowedItems = process.env.NEXT_PUBLIC_TICKET_ITEMS?.split(",") ?? [];

export async function POST(request: Request) {
  try {
    const { count, item } = await request.json();

    if (typeof count !== 'number' || !Number.isInteger(count) || count <= 0 || count > 1000) {
      return NextResponse.json({ error: 'Invalid count provided. Count must be an integer between 1 and 1000.' }, { status: 400 });
    }

    if (typeof item !== 'string' || !allowedItems.includes(item)) {
      return NextResponse.json({ error: 'Invalid item provided.' }, { status: 400 });
    }

    const tickets: Array<{ id: string; status: 'available' | 'used'; item: string; createdAt: string; usedAt: string | null }> = [];
    const now = new Date().toISOString();

    const client = getDbClient();

    for (let i = 0; i < count; i++) {
      let id: string = '';
      let isUnique = false;
      while (!isUnique) {
        id = generateTicketId();
        const existingTicket = await client.execute({ sql: 'SELECT id FROM tickets WHERE id = ?', args: [id] });
        if (existingTicket.rows.length === 0) {
          isUnique = true;
        }
      }
      tickets.push({ id, status: 'available', item, createdAt: now, usedAt: null });
    }

    // Batch insert
    const insertPromises = tickets.map(ticket =>
      client.execute({
        sql: 'INSERT INTO tickets (id, status, item, createdAt, usedAt) VALUES (?, ?, ?, ?, ?)',
        args: [ticket.id, ticket.status, ticket.item, ticket.createdAt, ticket.usedAt],
      })
    );
    await Promise.all(insertPromises);

    return NextResponse.json({ message: 'Tickets created successfully', tickets }, { status: 201 });
  } catch (error) {
    console.error('Error creating tickets:', error);
    return NextResponse.json({ error: 'Failed to create tickets.' }, { status: 500 });
  }
}
