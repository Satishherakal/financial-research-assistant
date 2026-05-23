import { NextResponse } from "next/server";
import { generateAnalysis } from "@/lib/grok";
import { getSupabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { ticker, companyName, stockData, newsData, sentimentData } = body;

    if (!ticker) {
      return NextResponse.json(
        { error: "Ticker is required" },
        { status: 400 }
      );
    }

    const headlines: string[] = (newsData?.articles || []).map(
      (a: { headline?: string; title?: string }) => a.headline || a.title || ""
    );

    const analysis = await generateAnalysis({
      ticker,
      companyName: companyName || ticker,
      stockData: stockData || {},
      newsHeadlines: headlines,
      sentimentScore: sentimentData?.averageScore || 0,
      sentimentLabel: sentimentData?.overallLabel || "Neutral",
    });

    const { error: dbError } = await getSupabase().from("analyses").insert({
      ticker: ticker.toUpperCase(),
      company_name: companyName || ticker,
      stock_data: stockData || {},
      news_data: newsData || {},
      sentiment_data: sentimentData || {},
      ai_summary: analysis,
    });

    if (dbError) {
      console.error("Supabase insert error:", dbError);
    }

    return NextResponse.json({ analysis });
  } catch (err) {
    console.error("Analyze API error:", err);
    return NextResponse.json(
      { error: "Failed to generate analysis" },
      { status: 500 }
    );
  }
}
