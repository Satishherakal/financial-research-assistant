import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await getSupabase()
      .from("analyses")
      .select("id, ticker, company_name, ai_summary, created_at")
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      console.error("Supabase query error:", error);
      return NextResponse.json({ history: [] });
    }

    return NextResponse.json({ history: data || [] });
  } catch (err) {
    console.error("History API error:", err);
    return NextResponse.json({ history: [] });
  }
}
