import { NextResponse } from "next/server";
import { getCompanyNews } from "@/lib/finnhub";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ ticker: string }> }
) {
  try {
    const { ticker } = await params;
    const symbol = ticker.toUpperCase().trim();
    const articles = await getCompanyNews(symbol);

    return NextResponse.json({ articles });
  } catch (err) {
    console.error("News API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}
