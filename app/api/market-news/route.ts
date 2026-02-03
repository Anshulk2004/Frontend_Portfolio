import { NextResponse } from "next/server"

export async function GET() {
  const res = await fetch(
    `https://newsapi.org/v2/everything?q=stocks%20india%20NSE%20BSE&language=en&sortBy=publishedAt&pageSize=10`,
    {
      headers: {
        "X-Api-Key": process.env.NEWS_API_KEY!,
      },
    }
  )

  const data = await res.json()

  const formatted = data.articles.map((a: any) => ({
    title: a.title,
    source: a.source.name,
    time: new Date(a.publishedAt).toLocaleTimeString(),
    category: "Market",
    url: a.url,
  }))

  return NextResponse.json(formatted)
}
