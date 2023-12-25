import { serve } from "https://deno.land/std@0.194.0/http/server.ts";
import { serveDir } from "https://deno.land/std@0.194.0/http/file_server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.33.1";
import * as dotenv from "https://deno.land/std@0.210.0/dotenv/mod.ts";

const env = await dotenv.load({
    export: true,
    envPath: ".env",
    examplePath: ".env.example",
});

const SEASON = 0;
const supabase = createClient(env["SUPABASE_URL"], env["SUPABASE_KEY"]);

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
        const name = json.name || "ななしの旅人";
        console.log(name, json.score, json.time);

        const res = await supabase
            .from("results")
            .select()
            .eq("time", json.time)
            .eq("score", json.score)
            .eq("name", name);
        //重複
        if (res.data.length !== 0) {
            console.log("a");
            return new Response(null, {
                status: 405,
            });
        }
        const { error } = await supabase.from("results").insert({
            name: name,
            score: json.score,
            time: json.time,
            season: SEASON,
        });
        return new Response(JSON.stringify(error));
    }

    return serveDir(req, {
        fsRoot: "public",
        urlRoot: "",
        showDirListing: true,
        enableCors: false,
    });
});
