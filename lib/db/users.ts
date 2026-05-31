import { requireSupabase } from "@/lib/db/client";

export type UserRecord = {
  id: string;
  username: string;
  password_hash?: string;
  created_at: string;
};

export async function getUserByUsername(username: string) {
  const db = requireSupabase();
  const { data, error } = await db
    .from("users")
    .select("id, username, password_hash, created_at")
    .eq("username", username.trim())
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data as UserRecord | null;
}

export async function createUser({
  username,
  passwordHash
}: {
  username: string;
  passwordHash: string;
}) {
  const db = requireSupabase();
  const { data, error } = await db
    .from("users")
    .insert({
      username: username.trim(),
      password_hash: passwordHash
    })
    .select("id, username, created_at")
    .single();

  if (error) {
    throw error;
  }

  return data as UserRecord;
}
