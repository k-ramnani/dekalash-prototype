// Minimal static file server for the Deka Lash Franklin Lakes prototype.
// Run:  deno run -A server.ts   (then open http://localhost:8000)

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

const PORT = Number(Deno.env.get("PORT") ?? 8000);
const ROOT = new URL("./", import.meta.url);

Deno.serve({ port: PORT, onListen: () => console.log(`▸ Deka Lash prototype: http://localhost:${PORT}`) }, async (req) => {
  let path = new URL(req.url).pathname;
  if (path === "/") path = "/index.html";
  try {
    const file = await Deno.readFile(new URL("." + path, ROOT));
    const ext = path.slice(path.lastIndexOf("."));
    return new Response(file, { headers: { "content-type": MIME[ext] ?? "application/octet-stream" } });
  } catch {
    return new Response("404 Not Found", { status: 404 });
  }
});
