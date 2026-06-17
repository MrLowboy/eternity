import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { answers, userId } = await request.json();

    // Fetch contributions from family and friends
    const { data: contributions } = await supabase
      .from("contributions")
      .select("contributor_name, message")
      .eq("owner_id", userId);

    const contributionsText = contributions && contributions.length > 0
      ? contributions.map((c) => `${c.contributor_name}: ${c.message}`).join("\n\n")
      : "No contributions yet.";

  const prompt = `You are a world class documentary filmmaker and storyteller. Based on the following life story answers and memories shared by loved ones, write a beautiful, moving documentary script.

IMPORTANT: The script must be SHORT — exactly 2 minutes when read aloud (approximately 280-300 words total). This is a strict requirement.

Structure it with:
- A brief opening narration (1-2 sentences)
- 3 key moments from their life story
- A closing narration (1-2 sentences)

Make it deeply personal, warm, and cinematic. Write it as a narrator would speak it. Use specific details from their answers.

THEIR LIFE STORY ANSWERS:
${answers}

MEMORIES FROM LOVED ONES:
${contributionsText}

Write the 2-minute documentary script now (280-300 words maximum):`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY || "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: JSON.stringify(data) }, { status: 500 });
    }

    const script = data.content[0].text;
    return NextResponse.json({ script });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}