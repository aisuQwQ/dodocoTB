import { serve } from "https://deno.land/std@0.194.0/http/server.ts";
import { serveDir } from "https://deno.land/std@0.194.0/http/file_server.ts";

serve(async (req) => {
    const pathname = new URL(req.url).pathname;
    console.log(pathname);

    if (req.method === "GET" && pathname === "/start") {
        return new Response("はじまり\n※音が出ます");
    }

    if (req.method === "GET" && pathname === "/time") {
        const time = new Date();
        console.log(time.toISOString());
        return new Response(time.toISOString());
    }

    if (req.method === "POST" && pathname === "/rank") {
        const json = await req.json();
        console.log(json.name || "ななしの旅人", json.score, json.time);
        return new Response("ok");
    }

    return serveDir(req, {
        fsRoot: "public",
        urlRoot: "",
        showDirListing: true,
        enableCors: false,
    });
});
