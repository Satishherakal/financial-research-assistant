import { NextResponse } from "next/server";
import { getNewsSentiment } from "@/lib/alphavantage";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ ticker: string }> }
) {
  try {
    const { ticker } = await params;
    const symbol = ticker.toUpperCase().trim();
    const sentiment = await getNewsSentiment(symbol);

    return NextResponse.json(sentiment);
  } catch (err) {
    console.error("Sentiment API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch sentiment data" },
      { status: 500 }
    );
  }
}
