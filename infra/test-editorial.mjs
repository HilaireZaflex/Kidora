import { createServer } from "node:net";
import { readFileSync } from "node:fs";
import { randomBytes } from "node:crypto";
import { spawn, spawnSync } from "node:child_process";

const password = randomBytes(32).toString("hex");
const name = "kidora-editorial-tests-" + process.pid;
const children = [];
function run(command, args, options = {}) {
  const result = spawnSync(command, args, { stdio: "inherit", ...options });
  if (result.status !== 0) throw new Error(command + " failed");
}
function server(command, args, env = process.env) {
  const child = spawn(command, args, { env, detached: true, stdio: ["ignore", "pipe", "pipe"] });
  let output = "";
  for (const stream of [child.stdout, child.stderr]) stream.on("data", data => { output = (output + data).slice(-6000); });
  children.push(child);
  return { child, output: () => output };
}
async function ready(url, process) {
  for (let attempt = 0; attempt < 60; attempt++) {
    if (process.child.exitCode !== null) throw new Error(process.output());
    try { if ((await fetch(url, { signal: AbortSignal.timeout(1000) })).ok) return; } catch {}
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  throw new Error("Test server did not become ready: " + process.output());
}
try {
  for (const port of [8011, 3011]) {
    await new Promise((resolve, reject) => {
      const probe = createServer();
      probe.once("error", reject);
      probe.listen(port, "127.0.0.1", () => probe.close(resolve));
    });
  }
  run("docker", ["compose", "exec", "-T", "db", "psql", "-U", "kidora", "-d", "postgres", "-v", "ON_ERROR_STOP=1"], { input: readFileSync("infra/test-db.sql"), stdio: ["pipe", "inherit", "inherit"] });
  // The guarded PHP fixture entrypoint refuses every database except kidora_test.
  run("docker", ["compose", "exec", "-T", "-e", "APP_ENV=testing", "-e", "DB_DATABASE=kidora_test", "api", "php", "tests/Browser/prepare.php"], { input: password + "\n", stdio: ["pipe", "inherit", "inherit"] });
  const api = server("docker", ["compose", "run", "--rm", "--no-deps", "--name", name, "-p", "127.0.0.1:8011:8011", "-e", "APP_ENV=local", "-e", "APP_DEBUG=false", "-e", "DB_DATABASE=kidora_test", "-e", "SESSION_COOKIE=kidora_editorial_test", "api", "php", "artisan", "serve", "--host=0.0.0.0", "--port=8011", "--no-reload"]);
  await ready("http://127.0.0.1:8011/up", api);
  const web = server("npm", ["--prefix", "apps/web", "run", "start", "--", "--hostname", "127.0.0.1", "--port", "3011"], { ...process.env, API_URL: "http://127.0.0.1:8011/api/v1" });
  await ready("http://127.0.0.1:3011/administration/connexion", web);
  run("npx", ["playwright", "test", "--config", "playwright.editorial.config.ts"], { env: { ...process.env, KIDORA_TEST_PASSWORD: password } });
} finally {
  for (const child of children.reverse()) { try { process.kill(-child.pid, "SIGTERM"); } catch {} }
  spawnSync("docker", ["stop", "-t", "2", name], { stdio: "ignore" });
}
