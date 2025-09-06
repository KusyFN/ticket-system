import { NextResponse } from "next/server";
import { getDbClient } from "@/lib/db";

export async function POST() {
  const db = getDbClient();

  // 0 より大きい場合のみ減らす
  await db.execute({
    sql: "UPDATE counter SET count = count - 1 WHERE id = 1 AND count > 0",
    args: [],
  });

  const result = await db.execute({
    sql: "SELECT count FROM counter WHERE id = 1",
    args: [],
  });

  const count = result.rows[0]?.count ?? 0;
  return NextResponse.json({ count });
}
