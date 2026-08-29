/**
 * Neon-backed export/delete for "my data" (used by AccountSettings & MyData
 * pages). Mirrors the old `delete_account()` RPC, scoped to the caller only.
 */
import { sql } from "@/lib/neon";

type Row = Record<string, unknown>;

export async function exportMyData(userId: string) {
  const [profile, saved, tracked, badges] = await Promise.all([
    sql`select * from public.profiles where id = ${userId} limit 1` as unknown as Promise<Row[]>,
    sql`select * from public.saved_qrs where user_id = ${userId}` as unknown as Promise<Row[]>,
    sql`select * from public.tracked_qrs where user_id = ${userId}` as unknown as Promise<Row[]>,
    sql`select * from public.user_badges where user_id = ${userId}` as unknown as Promise<Row[]>,
  ]);
  return {
    profile: profile[0] ?? null,
    savedQrs: saved,
    trackedQrs: tracked,
    badges,
  };
}

/** Mirrors `public.delete_account()`: wipes owned rows, keeps the auth identity. */
export async function deleteMyAccountData(userId: string) {
  await sql`delete from public.saved_qrs where user_id = ${userId}`;
  await sql`delete from public.tracked_qrs where user_id = ${userId}`;
  await sql`delete from public.api_keys where user_id = ${userId}`;
  await sql`delete from public.custom_domains where user_id = ${userId}`;
  await sql`delete from public.notifications where user_id = ${userId}`;
  await sql`delete from public.user_badges where user_id = ${userId}`;
  await sql`delete from public.profiles where id = ${userId}`;
}
