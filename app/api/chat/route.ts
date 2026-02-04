import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const SYSTEM_PROMPT = `You are an expert portfolio assistant for a comprehensive investment tracking and management platform. You have deep knowledge of:

**Core Competencies:**
1. Portfolio Analysis & Metrics
   - Calculate and explain portfolio performance, returns, and growth rates
   - Analyze asset allocation and diversification strategies
   - Interpret P/L (Profit & Loss) ratios and trends
   - Explain risk-adjusted returns (Sharpe ratio, volatility, beta)

2. Stock Market Knowledge
   - Explain stock fundamentals (P/E ratio, market cap, dividend yield, EPS)
   - Discuss market trends, sectors, and industry analysis
   - Help understand technical indicators (moving averages, RSI, MACD)
   - Explain different order types (market, limit, stop-loss)

3. Investment Instruments
   - Stocks, ETFs, Mutual Funds, Bonds
   - Index funds vs. actively managed funds
   - REITs, commodities, and alternative investments
   - Explain expense ratios, NAV, and fund performance metrics

4. Portfolio Management Strategies
   - Dollar-cost averaging and rebalancing
   - Tax-loss harvesting strategies
   - Asset allocation based on risk tolerance and time horizon
   - Growth vs. Value vs. Dividend investing strategies

5. Platform Features Assistance
   - Help users understand their dashboard metrics
   - Explain how to track performance over time
   - Guide on setting investment goals and targets
   - Assist with interpreting charts and analytics

**Communication Guidelines:**
- Use clear, educational language - explain jargon when necessary
- Always emphasize this is educational information, not personalized financial advice
- Encourage users to verify current market data and consult licensed financial advisors
- Be honest about market uncertainties and investment risks
- Provide balanced perspectives on investment strategies
- When discussing specific stocks, remind users to do their own research
- Focus on helping users understand their data and make informed decisions

**Important Restrictions:**
- Never guarantee returns or make specific buy/sell recommendations
- Don't provide tax advice (recommend consulting a tax professional)
- Don't claim to predict market movements with certainty
- Always disclose that past performance doesn't guarantee future results

**Tone & Style:**
- Friendly and supportive, like a knowledgeable financial mentor
- Patient and willing to explain concepts at different complexity levels
- Encouraging of good financial habits and continuous learning
- Concise but thorough - provide depth when asked

When users ask about their portfolio, you can help them interpret their data, understand metrics, and learn about investment concepts. Ask clarifying questions to provide better assistance.`;

const KNOWLEDGE_BASE = {
  metrics: {
    "P/L": "Profit and Loss - the difference between your current portfolio value and the total amount invested",
    "ROI": "Return on Investment - percentage gain or loss on your investment",
    "Sharpe Ratio": "Measures risk-adjusted returns - higher is better",
    "Beta": "Measures volatility compared to the market (S&P 500). Beta > 1 means more volatile",
    "Diversification": "Spreading investments across different assets to reduce risk",
  },
  strategies: {
    "Dollar-Cost Averaging": "Investing fixed amounts regularly regardless of price, reducing timing risk",
    "Rebalancing": "Adjusting portfolio back to target asset allocation",
    "Buy and Hold": "Long-term strategy of holding investments despite short-term volatility",
    "Value Investing": "Buying undervalued stocks trading below intrinsic value",
  },
  assetTypes: {
    "ETF": "Exchange-Traded Fund - a basket of securities that trades like a stock",
    "Index Fund": "Mutual fund or ETF that tracks a market index like S&P 500",
    "REIT": "Real Estate Investment Trust - invests in income-producing real estate",
    "Blue Chip": "Large, established, financially stable company",
  }
};

export async function POST(req: NextRequest) {
  try {
    const { messages, portfolioContext } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }
    let enhancedPrompt = SYSTEM_PROMPT;
    
    if (portfolioContext) {
      enhancedPrompt += `\n\n**Current User Portfolio Context:**\n`;
      
      if (portfolioContext.totalValue) {
        enhancedPrompt += `- Total Portfolio Value: $${portfolioContext.totalValue.toLocaleString()}\n`;
      }
      if (portfolioContext.totalInvested) {
        enhancedPrompt += `- Total Invested: $${portfolioContext.totalInvested.toLocaleString()}\n`;
      }
      if (portfolioContext.profitLoss) {
        enhancedPrompt += `- Overall P/L: $${portfolioContext.profitLoss.toLocaleString()} (${portfolioContext.profitLossPercentage}%)\n`;
      }
      if (portfolioContext.holdings && portfolioContext.holdings.length > 0) {
        enhancedPrompt += `- Number of Holdings: ${portfolioContext.holdings.length}\n`;
        enhancedPrompt += `- Top Holdings: ${portfolioContext.holdings.slice(0, 5).map((h: any) => h.symbol).join(", ")}\n`;
      }
      if (portfolioContext.assetAllocation) {
        enhancedPrompt += `- Asset Allocation: ${JSON.stringify(portfolioContext.assetAllocation)}\n`;
      }
      
      enhancedPrompt += `\nUse this context to provide personalized insights when relevant. Help the user understand their portfolio performance and suggest areas they might want to explore or learn about.`;
    }
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: enhancedPrompt,
    });

    const chatHistory = messages
      .slice(0, -1)
      .filter((msg: any) => msg.role === "user" || msg.role === "assistant")
      .map((msg: any) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      }));

    const validHistory = chatHistory.length > 0 && chatHistory[0].role === "user" 
      ? chatHistory 
      : [];
    const chat = model.startChat({
      history: validHistory,
    });

    const userMessage = messages[messages.length - 1].content;

    const result = await chat.sendMessage(userMessage);
    const response = result.response;
    const text = response.text();

    return NextResponse.json({ 
      message: text,
      role: "assistant" 
    });

  } catch (error: any) {
    console.error("Chat API Error:", error);
    if (error.status === 429) {
      return NextResponse.json(
        { 
          message: "I'm currently experiencing high demand. Please wait a moment and try again.",
          role: "assistant"
        },
        { status: 200 }
      );
    }
    
    return NextResponse.json(
      { 
        message: "I apologize, but I'm having technical difficulties. Please try again in a moment.",
        role: "assistant"
      },
      { status: 200 }
    );
  }
}