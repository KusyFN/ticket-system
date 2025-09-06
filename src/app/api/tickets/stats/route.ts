import { NextResponse } from 'next/server';
import { getDbClient } from '@/lib/db';


export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const client = getDbClient();

    const totalTicketsResult = await client.execute('SELECT COUNT(*) as count FROM tickets');
    const totalTickets = totalTicketsResult.rows[0].count as number;

    const usedTicketsResult = await client.execute('SELECT COUNT(*) as count FROM tickets WHERE status = \'used\''
);    const usedTickets = usedTicketsResult.rows[0].count as number;

    const percentageUsed = totalTickets > 0 ? (usedTickets / totalTickets) * 100 : 0;

    return NextResponse.json({
      totalTickets,
      usedTickets,
      percentageUsed: percentageUsed.toFixed(2),
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching ticket stats:', error);
    return NextResponse.json({ error: 'Failed to fetch ticket stats.' }, { status: 500 });
  }
}
