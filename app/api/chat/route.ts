import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
interface ChatPart {
  text: string;
}
interface ChatHistoryItem {
  role: "user" | "model";
  parts: ChatPart[];
}

const SYSTEM_PROMPT = `You are a Senior Market Insight AI. 

**RESPONSE PROTOCOL (STRICT):**
1. **INITIAL RESPONSE:** Keep it very short (max 4-5 bullet points). Summarize the core trend.
2. **"MORE INFO" LOGIC:** If the user asks "More Info", "Tell me more", or "Details", provide a deep-dive analysis.
3. **STRICTLY POINTS:** Never use paragraphs. Every single sentence must be a bullet point (-).
4. **MARKETING FOCUS:** Analyze market demand, sector momentum, and strategic growth catalysts rather than basic definitions.
5. **HYPERLINKS:** Always conclude with exactly one high-value link formatted as: [Investopedia: Topic Name](URL) or [YouTube: Market Analysis](URL).

**FORMATTING:**
- Use ### for headers.
- **Bold** all percentages, ticker symbols (e.g., **$AAPL**), and key strategic terms.

**STRUCTURE:**
### 📈 Quick Insight
- (Bullet points only)

### 📚 Learn More
- [Resource Title](Link)

**LEGAL:** Educational only. Not financial advice.`;

export async function POST(req: NextRequest) {
  try {
    const { messages, portfolioContext } = await req.json();
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
    }

    let enhancedPrompt = SYSTEM_PROMPT;
    if (portfolioContext) {
      enhancedPrompt += `\n\n**CURRENT USER CONTEXT:**
      - Total Value: $${portfolioContext.totalValue?.toLocaleString()}
      - Holdings: ${portfolioContext.holdings?.map((h: any) => h.symbol).join(", ")}
      - Allocation: ${JSON.stringify(portfolioContext.assetAllocation)}      
      Always relate market trends back to how they might impact these specific holdings.`;
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash", 
      systemInstruction: enhancedPrompt 
    });
    const chatHistory: ChatHistoryItem[] = messages
      .slice(-11, -1)
      .filter((msg: any) => msg.role === "user" || msg.role === "assistant")
      .map((msg: any) => ({
        role: msg.role === "assistant" ? ("model" as const) : ("user" as const),
        parts: [{ text: msg.content }],
      }));
    const chat = model.startChat({
      history: chatHistory,
    });

    const userMessage = messages[messages.length - 1].content;
    const result = await chat.sendMessage(userMessage);
    const text = result.response.text();

    return NextResponse.json({ 
      message: text,
      role: "assistant" 
    });

  } catch (error: any) {
    console.error("Chat API Error:", error);
    if (error.status === 429 || error.message?.includes("429")) {
      return NextResponse.json({ 
        message: "⚠️ **Market Volatility (Rate Limit):** I've received too many requests. Please wait **60 seconds** for the market data to refresh!",
        role: "assistant"
      }, { status: 200 });
    }    
    return NextResponse.json({ 
      message: "I encountered a technical glitch. Please try refreshing the chat.",
      role: "assistant"
    }, { status: 200 });
  }
}