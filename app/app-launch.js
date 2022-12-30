import { handler } from "./app.js";
import { serve } from "https://deno.land/std@0.166.0/http/server.ts";

await serve(handler, {
  port: 7777,
});
