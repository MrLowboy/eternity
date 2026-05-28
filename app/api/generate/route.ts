import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { answers } = await request.json();

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY || "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
       model: "claude-sonnet-4-5",
        max_tokens: 4000,
        messages: [
          {
            role: "user",
            content: `Write a short beautiful documentary script based on these life answers: ${JSON.stringify(answers)}`,
          },
        ],
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error("Anthropic error:", JSON.stringify(data));
      return NextResponse.json({ error: JSON.stringify(data) }, { status: 500 });
    }

    const script = data.content[0].text;
    return NextResponse.json({ script });
  } catch (error) {
    console.error("Caught error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}