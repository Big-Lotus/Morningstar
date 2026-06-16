const SPLINE_RUNTIME_URL =
  "https://unpkg.com/@splinetool/runtime@1.12.97/build/runtime.js";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const upstream = await fetch(SPLINE_RUNTIME_URL, {
      cache: "no-store",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      }
    });

    if (!upstream.ok) {
      return new Response("Spline runtime request failed.", {
        status: upstream.status
      });
    }

    return new Response(await upstream.text(), {
      headers: {
        "Cache-Control": "public, max-age=3600",
        "Content-Type": "application/javascript; charset=utf-8"
      }
    });
  } catch (error) {
    return new Response(
      error instanceof Error ? error.message : "Spline runtime proxy failed.",
      { status: 502 }
    );
  }
}
