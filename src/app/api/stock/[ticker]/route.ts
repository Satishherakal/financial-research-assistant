import { NextResponse } from "next/server";
import { getQuote, getCompanyProfile } from "@/lib/finnhub";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ ticker: string }> }
) {
  try {
    const { ticker } = await params;
    const symbol = ticker.toUpperCase().trim();

    const [quote, profile] = await Promise.all([
      getQuote(symbol),
      getCompanyProfile(symbol),
    ]);

    // Validate that we got real data back
    if (!quote.currentPrice && !profile.name) {
      return NextResponse.json(
        { error: "Invalid ticker or no data available" },
        { status: 404 }
      );
    }

    return NextResponse.json({ quote, profile });
  } catch (err) {
    console.error("Stock API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch stock data" },
      { status: 500 }
    );
  }
}
