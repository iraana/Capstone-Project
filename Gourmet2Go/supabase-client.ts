import { createClient } from "@supabase/supabase-js";

const supabaseURL = "https://vnnlrooakzcseeiqskxw.supabase.co";
// const supabaseURL = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase= createClient(supabaseURL, supabaseAnonKey);