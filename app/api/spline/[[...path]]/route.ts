const SPLINE_BASE_URL =
  "https://my.spline.design/cutecomputerfollowcursor-nOkpDVcYzEvvSrloO9SbWENR/";

export const dynamic = "force-dynamic";

type SplineRouteParams = {
  path?: string[];
};

function rewriteSplineHtml(html: string) {
  return html
    .replaceAll(
      "https://unpkg.com/@splinetool/runtime@1.12.97/build/runtime.js",
      "/api/spline-runtime"
    )
    .replaceAll("./scene.splinecode", "/api/spline/scene.splinecode");
}

export async function GET(
  _request: Request,
  context: { params: Promise<SplineRouteParams> }
) {
  const { path = [] } = await context.params;
  const targetUrl = new URL(path.join("/"), SPLINE_BASE_URL);

  try {
    const upstream = await fetch(targetUrl, {
      cache: "no-store",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      }
    });

    if (!upstream.ok) {
      return new Response("Spline asset request failed.", {
        status: upstream.status
      });
    }

    const contentType =
      upstream.headers.get("content-type") ?? "application/octet-stream";

    if (contentType.includes("text/html")) {
      const html = rewriteSplineHtml(await upstream.text());

      return new Response(html, {
        headers: {
          "Cache-Control": "no-store",
          "Content-Type": "text/html; charset=utf-8"
        }
      });
    }

    return new Response(await upstream.arrayBuffer(), {
      headers: {
        "Cache-Control": "public, max-age=3600",
        "Content-Type": contentType
      }
    });
  } catch (error) {
    return new Response(
      error instanceof Error ? error.message : "Spline proxy failed.",
      { status: 502 }
    );
  }
}
