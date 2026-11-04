import { apiUrl } from "@/lib/catalog";

export const runtime = "nodejs";
const bodyLimit = 1024 * 1024;

async function proxy(
  request: Request,
  { params }: { params: Promise<{ path?: string[] }> },
) {
  const { path = [] } = await params;
  if (path.some(part => !/^[a-zA-Z0-9_-]+(?:\.[a-zA-Z0-9_-]+)?$/.test(part))) {
    return new Response("Chemin invalide", { status: 400 });
  }

  const origin = request.headers.get("origin");
  const expectedOrigin =
    process.env.WEB_ORIGIN ||
    new URL(request.url).protocol + "//" + request.headers.get("host");
  if (request.method !== "GET" && origin && origin !== expectedOrigin) {
    return new Response("Origine refusée", { status: 403 });
  }

  let body: Uint8Array | undefined;
  if (request.body) {
    const reader = request.body.getReader();
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const item = await reader.read();
      if (item.done) break;
      size += item.value.byteLength;
      if (size > bodyLimit) {
        await reader.cancel();
        return new Response("Formulaire trop volumineux", { status: 413 });
      }
      chunks.push(item.value);
    }
    body = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      body.set(chunk, offset);
      offset += chunk.length;
    }
  }

  const target = new URL(
    "/administration" +
      (path.length ? "/" + path.map(encodeURIComponent).join("/") : ""),
    new URL(apiUrl()).origin,
  );
  target.search = new URL(request.url).search;
  const headers = new Headers({ "accept-encoding": "identity" });
  for (const name of [
    "accept", "accept-language", "content-type", "cookie", "user-agent",
    "x-csrf-token", "x-requested-with",
  ]) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }

  try {
    const upstream = await fetch(target, {
      method: request.method,
      headers,
      body: body as BodyInit | undefined,
      redirect: "manual",
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });
    const output = new Headers(upstream.headers);
    // fetch decompresses responses; never relay stale encoding or length headers.
    for (const name of [
      "connection", "keep-alive", "transfer-encoding",
      "content-length", "content-encoding",
    ]) {
      output.delete(name);
    }
    const location = output.get("location");
    if (location && !/^\/administration(?:\/|\?|$)/.test(location)) {
      return new Response("Redirection refusée", { status: 502 });
    }
    output.set("Cache-Control", "no-store, private");
    output.set("X-Robots-Tag", "noindex, nofollow");
    output.set("Referrer-Policy", "same-origin");
    output.set(
      "Content-Security-Policy",
      "default-src 'self'; style-src 'self'; script-src 'none'; img-src 'self' data:; form-action 'self'; frame-ancestors 'none'; base-uri 'none'",
    );
    return new Response(upstream.body, { status: upstream.status, headers: output });
  } catch {
    return new Response("L’espace éditorial est momentanément indisponible.", {
      status: 503,
    });
  }
}

export { proxy as GET, proxy as POST };
