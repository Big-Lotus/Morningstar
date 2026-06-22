import { requireSupabase } from "@/lib/db/client";

export type UserRecord = {
  id: string;
  username: string;
  email?: string | null;
  password_hash?: string | null;
  created_at: string;
};

export async function getUserById(id: string) {
  const db = requireSupabase();
  const { data, error } = await db
    .from("users")
    .select("id, username, email, password_hash, created_at")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data as UserRecord | null;
}

export async function getUserByUsername(username: string) {
  const db = requireSupabase();
  const { data, error } = await db
    .from("users")
    .select("id, username, email, password_hash, created_at")
    .eq("username", username.trim())
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data as UserRecord | null;
}

export async function getUserByEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail) {
    return null;
  }

  const db = requireSupabase();
  const { data, error } = await db
    .from("users")
    .select("id, username, email, password_hash, created_at")
    .eq("email", normalizedEmail)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data as UserRecord | null;
}

export async function ensureUserProfile({
  id,
  email,
  username,
  passwordHash = null
}: {
  id: string;
  email?: string | null;
  username: string;
  passwordHash?: string | null;
}) {
  const db = requireSupabase();
  const normalizedUsername = username.trim();
  const normalizedEmail = email?.trim().toLowerCase() || null;

  const { data, error } = await db
    .from("users")
    .upsert(
      {
        id,
        username: normalizedUsername,
        email: normalizedEmail,
        password_hash: passwordHash
      },
      { onConflict: "id" }
    )
    .select("id, username, email, password_hash, created_at")
    .single();

  if (error) {
    throw error;
  }

  return data as UserRecord;
}
