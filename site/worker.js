const JAR = "/donutsmp-rtp-mapper-1.3.0.jar";
const JAR_NAME = "donutsmp-rtp-mapper-1.3.0.jar";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/download" || url.pathname === JAR) {
      const assetUrl = new URL(JAR, url);
      const asset = await env.ASSETS.fetch(new Request(assetUrl, request));
      if (!asset.ok) {
        return new Response("JAR not found", { status: 404 });
      }
      const headers = new Headers(asset.headers);
      headers.set("Content-Type", "application/java-archive");
      headers.set("Content-Disposition", `attachment; filename="${JAR_NAME}"`);
      headers.set("Cache-Control", "public, max-age=3600");
      return new Response(asset.body, { status: 200, headers });
    }

    return env.ASSETS.fetch(request);
  },
};
