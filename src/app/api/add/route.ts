import { NextResponse } from "next/server";
import { getDbClient } from "@/lib/db";

export async function POST() {
  const db = getDbClient();

  await db.execute({
    sql: "UPDATE counter SET count = count + 1 WHERE id = 1",
    args: [],
  });

  const result = await db.execute({
    sql: "SELECT count FROM counter WHERE id = 1",
    args: [],
  });

  const count = result.rows[0]?.count ?? 0;
  return NextResponse.json({ count });
}
