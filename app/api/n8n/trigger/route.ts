import { NextResponse } from "next/server";

type TriggerRequestBody = {
  userId?: unknown;
};

export async function POST(request: Request) {
  const webhookUrl = process.env.N8N_WEBHOOK_URL;

  if (!webhookUrl) {
    return NextResponse.json(
      { success: false, error: "N8N_WEBHOOK_URL is not configured." },
      { status: 500 }
    );
  }

  let body: TriggerRequestBody;

  try {
    body = (await request.json()) as TriggerRequestBody;
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  const userId = typeof body.userId === "string" && body.userId.trim()
    ? body.userId.trim()
    : "anonymous";

  const payload = {
    action: "collect_today_english_news",
    userId,
    timestamp: new Date().toISOString()
  };

  try {
    // Future authentication checks can be added here before calling n8n.
    const n8nResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text().catch(() => "");

      return NextResponse.json(
        {
          success: false,
          error: "n8n webhook request failed.",
          status: n8nResponse.status,
          details: errorText || undefined
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to trigger n8n webhook."
      },
      { status: 500 }
    );
  }
}
