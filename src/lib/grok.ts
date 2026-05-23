import OpenAI from "openai";

function getClient(): OpenAI {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) throw new Error("XAI_API_KEY is not set");

  return new OpenAI({
    apiKey,
    baseURL: "https://api.x.ai/v1",
  });
}

interface AnalysisInput {
  ticker: string;
  companyName: string;
  stockData: Record<string, unknown>;
  newsHeadlines: string[];
  sentimentScore: number;
  sentimentLabel: string;
}

function generateFallbackAnalysis(input: AnalysisInput): string {
  const isPositive = input.sentimentScore >= 0.05;
  const isNegative = input.sentimentScore <= -0.05;
  const sentimentStr = isPositive ? "mostly positive" : isNegative ? "mostly negative" : "mixed/neutral";
  
  const currentPrice = (input.stockData as any).currentPrice || 0;
  const change = (input.stockData as any).change || 0;
  const percentChange = (input.stockData as any).percentChange || 0;
  const direction = change >= 0 ? "upward" : "downward";

  return `### **Company Overview**
${input.companyName} (${input.ticker}) is currently showing active market interest. With a sentiment profile labeled as **${input.sentimentLabel}**, the stock remains a key point of discussion among institutional and retail investors.

### **Price Action**
The stock is trading at **$${currentPrice.toFixed(2)}**, reflecting a ${direction} movement of **$${change.toFixed(2)} (${percentChange.toFixed(2)}%)** compared to its previous close. This price action suggests a ${Math.abs(percentChange) > 1.5 ? "significant shift in short-term market momentum" : "stable consolidation pattern within the current range"}.

### **News & Sentiment Analysis**
A review of recent news headlines indicates a **${sentimentStr}** tone overall. The average sentiment score is **${input.sentimentScore.toFixed(4)}**. 
Key points extracted from recent coverage:
${input.newsHeadlines.slice(0, 3).map(h => `- ${h}`).join('\n') || "- No recent major headline events detected."}

### **Risk Factors**
- **Market Volatility:** Sector-wide volatility and macroeconomic indicators could pressure price performance.
- **Sentiment Fluctuations:** The stock's reliance on news flow exposes it to sharp sentiment swings.
- **Regulatory & Competition:** Global competitive pressures and regulatory headwinds continue to pose medium-term risks.

### **Summary**
Overall, ${input.companyName} demonstrates a **${input.sentimentLabel}** outlook based on recent metrics. While the sentiment is supportive of current levels, investors should monitor the key support/resistance areas and upcoming news flow carefully.

*Disclaimer: This analysis is generated as a fallback due to xAI API credit limits. This research is for informational purposes only and does not constitute financial advice.*`;
}

export async function generateAnalysis(input: AnalysisInput): Promise<string> {
  try {
    const client = getClient();

    const prompt = `You are a financial research analyst. Analyze the following data for ${input.companyName} (${input.ticker}) and provide a concise investment research summary.

Stock Data:
${JSON.stringify(input.stockData, null, 2)}

Recent News Headlines:
${input.newsHeadlines.map((h, i) => `${i + 1}. ${h}`).join("\n")}

News Sentiment: ${input.sentimentLabel} (score: ${input.sentimentScore})

Provide your analysis with these sections:
1. **Company Overview** - Brief summary of current market position
2. **Price Action** - Analysis of current price movement and what it signals
3. **News & Sentiment Analysis** - Key takeaways from recent news coverage
4. **Risk Factors** - Main risks to consider
5. **Summary** - Overall assessment and outlook

Keep the analysis professional, data-driven, and concise. Do not provide specific buy/sell recommendations or price targets — frame it as research for informational purposes only.`;

    const response = await client.chat.completions.create({
      model: "grok-3-mini-fast",
      messages: [
        {
          role: "system",
          content:
            "You are a professional financial research analyst. Provide clear, factual analysis based on the data provided. Always include a disclaimer that this is not financial advice.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    return (
      response.choices[0]?.message?.content ||
      "Unable to generate analysis at this time."
    );
  } catch (err) {
    console.error("Grok API Error, falling back to simulated analysis:", err);
    return generateFallbackAnalysis(input);
  }
}

