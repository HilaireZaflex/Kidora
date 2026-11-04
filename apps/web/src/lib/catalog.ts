import "server-only";
export type Universe = {
  id: number;
  name: string;
  slug: string;
  theme: string;
  description: string;
  color: string;
  icon: string;
  articles_count?: number;
};
export type ArticleSummary = {
  id: number;
  title: string;
  slug: string;
  summary: string;
  illustration: string;
  country_code: string | null;
  age_label: string;
  reading_minutes: number;
  is_demo: boolean;
  universe: Universe;
};
export type Quiz = {
  id: number;
  title: string;
  questions: { id: number; prompt: string; options: string[] }[];
};
export type Article = ArticleSummary & {
  blocks: { type: "text" | "fact"; title: string; body: string }[];
  sources: { label: string; url: string }[];
  quiz: Quiz | null;
};
export const apiUrl = () =>
  process.env.API_URL ?? "http://127.0.0.1:8000/api/v1";
export async function api<T>(path: string): Promise<T> {
  const response = await fetch(`${apiUrl()}${path}`, {
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok)
    throw new Error(`Catalogue indisponible (${response.status})`);
  return response.json() as Promise<T>;
}
export const universes = () => api<{ data: Universe[] }>("/universes");
export const articles = (q = "") =>
  api<{ data: ArticleSummary[] }>(`/articles?q=${encodeURIComponent(q)}`);
