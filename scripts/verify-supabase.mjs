import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";

const root = process.cwd();
const shouldWrite = process.argv.includes("--write");
const env = {
  ...readEnvFile(join(root, ".env.local")),
  ...process.env
};

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Add them to .env.local, then rerun this command."
  );
  process.exit(1);
}

const db = createClient(supabaseUrl, supabaseAnonKey);

await verifyReadFlow();

if (shouldWrite) {
  await verifyWriteFlow();
}

console.log(
  shouldWrite
    ? "Supabase read/write verification completed."
    : "Supabase read verification completed. Run npm run verify:supabase:write to test user actions."
);

function readEnvFile(filePath) {
  if (!existsSync(filePath)) {
    return {};
  }

  return Object.fromEntries(
    readFileSync(filePath, "utf8")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))
      .map((line) => {
        const [key, ...valueParts] = line.split("=");
        return [key, valueParts.join("=").replace(/^"|"$/g, "")];
      })
  );
}

async function verifyReadFlow() {
  const { data, error } = await db
    .from("articles")
    .select("id, slug, title, category, external_id, language, status, fetched_at")
    .eq("status", "published")
    .limit(3);

  if (error) {
    throw new Error(`Could not read articles: ${error.message}`);
  }

  if (!data || data.length === 0) {
    throw new Error(
      "Connected to Supabase, but articles is empty. Run supabase/seed.sql in the SQL editor."
    );
  }

  console.log(`Read ${data.length} article rows from Supabase.`);
}

async function verifyWriteFlow() {
  const timestamp = Date.now();
  const username = `saetbyeol_verify_${timestamp}`;

  const { data: article, error: articleError } = await db
    .from("articles")
    .select("id, slug")
    .limit(1)
    .single();

  if (articleError) {
    throw new Error(`Could not load a seed article: ${articleError.message}`);
  }

  const { data: user, error: userError } = await db
    .from("users")
    .insert({
      username,
      password_hash: "verification-only"
    })
    .select("id")
    .single();

  if (userError) {
    throw new Error(`Could not create verification user: ${userError.message}`);
  }

  try {
    await insertOrThrow("user_interests", {
      user_id: user.id,
      category: "National"
    });
    await insertOrThrow("bookmarks", {
      user_id: user.id,
      article_id: article.id
    });

    const customSlug = `custom-verification-${timestamp}`;
    const { data: customSource } = await insertOrThrow("custom_sources", {
      user_id: user.id,
      slug: customSlug,
      title: "Verification Source",
      source_name: "example.com",
      source_url: `https://example.com/verification-${timestamp}`,
      category: "National",
      keyword: "verification",
      intro: "A temporary source used to verify Supabase writes."
    });

    const { data: investigation } = await insertOrThrow("investigations", {
      user_id: user.id,
      title: "Verification Investigation",
      requirements: "Check whether the app can write investigation data.",
      analysis: "Verification analysis.",
      status: "generated"
    });

    await insertOrThrow("investigation_sources", {
      investigation_id: investigation.id,
      source_type: "article",
      source_id: article.id,
      sort_order: 0,
      is_seed: true
    });
    await insertOrThrow("investigation_sources", {
      investigation_id: investigation.id,
      source_type: "custom_source",
      source_id: customSource.id,
      sort_order: 1,
      is_seed: false
    });

    await insertOrThrow("saved_vocabulary", {
      user_id: user.id,
      source_type: "article",
      source_id: article.id,
      word: "verification",
      meaning: "A test word used to verify vocabulary writes.",
      sentence: "This row verifies vocabulary writes."
    });

    const { data: analysisPost } = await insertOrThrow(
      "community_analysis_posts",
      {
        user_id: user.id,
        investigation_id: investigation.id,
        title: "Verification Shared Analysis",
        insight: "Verification insight."
      }
    );

    await insertOrThrow("community_analysis_comments", {
      post_id: analysisPost.id,
      user_id: user.id,
      body: "Verification analysis comment."
    });

    const { data: poll } = await insertOrThrow("community_polls", {
      user_id: user.id,
      title: "Verification Poll",
      question: "Does community polling write correctly?",
      summary_insight: "Verification summary."
    });

    const { data: pollOption } = await insertOrThrow("community_poll_options", {
      poll_id: poll.id,
      label: "Yes",
      sort_order: 0
    });

    await insertOrThrow("community_poll_options", {
      poll_id: poll.id,
      label: "No",
      sort_order: 1
    });

    await insertOrThrow("community_poll_votes", {
      poll_id: poll.id,
      option_id: pollOption.id,
      user_id: user.id,
      opinion: "Verification vote."
    });

    await insertOrThrow("community_poll_comments", {
      poll_id: poll.id,
      user_id: user.id,
      body: "Verification poll comment."
    });

    console.log("Created verification rows for user data, investigation, vocabulary, shared analysis, comments, poll, options, and vote.");
  } finally {
    const { error: cleanupError } = await db.from("users").delete().eq("id", user.id);

    if (cleanupError) {
      throw new Error(
        `Verification succeeded, but cleanup failed for ${username}: ${cleanupError.message}`
      );
    }

    console.log("Cleaned up verification rows.");
  }
}

async function insertOrThrow(table, row) {
  const result = await db.from(table).insert(row).select("*").single();

  if (result.error) {
    throw new Error(`Could not insert into ${table}: ${result.error.message}`);
  }

  return result;
}
