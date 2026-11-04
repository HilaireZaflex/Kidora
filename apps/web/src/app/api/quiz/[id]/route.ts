import { apiUrl } from "@/lib/catalog";
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!/^\d{1,10}$/.test(id))
    return Response.json({ message: "Quiz introuvable" }, { status: 404 });
  // Same-origin browser requests only. The public API also rate limits and validates each answer.
  const origin = request.headers.get("origin");
  const expectedOrigin =
    process.env.WEB_ORIGIN ||
    `${new URL(request.url).protocol}//${request.headers.get("host")}`;
  if (origin && origin !== expectedOrigin) {
    return Response.json({ message: "Origine refusée" }, { status: 403 });
  }
  const text = await request.text();
  if (text.length > 16000)
    return Response.json({ message: "Requête trop longue" }, { status: 413 });
  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return Response.json({ message: "JSON invalide" }, { status: 400 });
  }
  try {
    const response = await fetch(`${apiUrl()}/quizzes/${id}/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok)
      return Response.json(
        { message: "Correction indisponible" },
        {
          status:
            response.status === 422 ? 422 : response.status === 429 ? 429 : 503,
        },
      );
    return Response.json(await response.json(), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return Response.json(
      { message: "Catalogue indisponible" },
      { status: 503 },
    );
  }
}
