import { NextResponse } from "next/server";
import { getDbClient } from "@/lib/db";

export const dynamic = "force-dynamic"
export async function GET() {
  const db = getDbClient();

  const result = await db.execute({
    sql: "SELECT count FROM counter WHERE id = 1",
    args: [],
  });

  const count = result.rows[0]?.count ?? 0;
  return NextResponse.json({ count });
}
