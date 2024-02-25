import dotenv from "dotenv";
dotenv.config();

import { createClient } from "@supabase/supabase-js";

const supabaseApiKey = process.env.SUPABASE_API_KEY;
const supabaseUrl = process.env.SUPABASE_URL;
// eslint-disable-next-line no-console
if (!supabaseApiKey || !supabaseUrl) {
  throw new Error("Supabase API Key and Project ID must be set");
}

const supabase = createClient(supabaseUrl, supabaseApiKey);
export { supabase };
