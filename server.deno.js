import { serve } from "https://deno.land/std@0.194.0/http/server.ts";
import { serveDir } from "https://deno.land/std@0.194.0/http/file_server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SEASON = 0;
const supabase = createClient(
    "https://btkwbrhppmdmpysusslx.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0a3dicmhwcG1kbXB5c3Vzc2x4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDA2NjgzNTEsImV4cCI6MjAxNjI0NDM1MX0.F34o0DJXV_BwvwW11rqwvdDtSYSn0jaINF6CpH2npLw"
);

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
