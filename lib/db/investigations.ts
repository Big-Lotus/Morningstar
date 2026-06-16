import { requireSupabase } from "@/lib/db/client";
import { InvestigationRow, mapInvestigationRow } from "@/lib/db/mappers";

export type InvestigationSourceInput = {
  slug: string;
  sourceType: "article" | "custom_source";
  sortOrder: number;
  isSeed: boolean;
};

async function getSourceId(
  userId: string,
  sourceType: "article" | "custom_source",
  slug: string
) {
  if (sourceType === "article") {
    return slug;
  }

  const db = requireSupabase();
  const { data, error } = await db
    .from("custom_sources")
    .select("id")
    .eq("slug", slug)
    .eq("user_id", userId)
    .single();

  if (error) {
    throw error;
  }

  return data.id as string;
}

export async function getInvestigations(userId: string) {
  const db = requireSupabase();
  const { data, error } = await db
    .from("investigations")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  const investigations = (data ?? []) as InvestigationRow[];
  const sourceSlugEntries = await Promise.all(
    investigations.map(async (investigation) => ({
      investigationId: investigation.id,
      sourceSlugs: await getInvestigationSourceSlugs(investigation.id)
    }))
  );
  const sourceSlugsByInvestigation = new Map(
    sourceSlugEntries.map((entry) => [entry.investigationId, entry.sourceSlugs])
  );

  return investigations.map((row) =>
    mapInvestigationRow(row, sourceSlugsByInvestigation.get(row.id) ?? [])
  );
}

export async function createInvestigation(
  userId: string,
  entry: {
    id?: string;
    title: string;
    requirements: string;
    analysis: string;
    status?: "draft" | "generated" | "shared";
    sources: InvestigationSourceInput[];
  }
) {
  const db = requireSupabase();
  const { data, error } = await db
    .from("investigations")
    .insert({
      id: entry.id,
      user_id: userId,
      title: entry.title,
      requirements: entry.requirements,
      analysis: entry.analysis,
      status: entry.status ?? "generated"
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  const investigation = data as InvestigationRow;
  await replaceInvestigationSources(userId, investigation.id, entry.sources);

  return mapInvestigationRow(
    investigation,
    entry.sources.map((source) => source.slug)
  );
}

export async function replaceInvestigationSources(
  userId: string,
  investigationId: string,
  sources: InvestigationSourceInput[]
) {
  const db = requireSupabase();
  const { error: deleteError } = await db
    .from("investigation_sources")
    .delete()
    .eq("investigation_id", investigationId);

  if (deleteError) {
    throw deleteError;
  }

  if (sources.length === 0) {
    return;
  }

  const rows = await Promise.all(
    sources.map(async (source) => ({
      investigation_id: investigationId,
      source_type: source.sourceType,
      source_id: await getSourceId(userId, source.sourceType, source.slug),
      sort_order: source.sortOrder,
      is_seed: source.isSeed
    }))
  );
  const { error: insertError } = await db
    .from("investigation_sources")
    .insert(rows);

  if (insertError) {
    throw insertError;
  }
}

async function getInvestigationSourceSlugs(investigationId: string) {
  const db = requireSupabase();
  const { data, error } = await db
    .from("investigation_sources")
    .select("source_type, source_id, sort_order")
    .eq("investigation_id", investigationId)
    .order("sort_order", { ascending: true });

  if (error) {
    throw error;
  }

  return Promise.all(
    (data ?? []).map((source) =>
      getSourceSlug(
        source.source_type as "article" | "custom_source",
        source.source_id as string
      )
    )
  );
}

async function getSourceSlug(
  sourceType: "article" | "custom_source",
  sourceId: string
) {
  if (sourceType === "article") {
    return sourceId;
  }

  const db = requireSupabase();
  const { data, error } = await db
    .from("custom_sources")
    .select("slug")
    .eq("id", sourceId)
    .single();

  if (error) {
    throw error;
  }

  return data.slug as string;
}

export async function deleteInvestigation(userId: string, investigationId: string) {
  const db = requireSupabase();
  const { error } = await db
    .from("investigations")
    .delete()
    .eq("user_id", userId)
    .eq("id", investigationId);

  if (error) {
    throw error;
  }
}
