import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { script } = await request.json();
    if (!script) {
      return NextResponse.json({ error: "No script provided" }, { status: 400 });
    }
    const resp = await fetch(
      "https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": process.env.ELEVENLABS_API_KEY || "",
        },
        body: JSON.stringify({
          text: script,
          model_id: "eleven_turbo_v2_5",
          voice_settings: { stability: 0.5, similarity_boost: 0.75 },
        }),
      }
    );
    if (!resp.ok) {
      const err = await resp.text();
      return NextResponse.json({ error: err }, { status: 500 });
    }
    const audioBuffer = await resp.arrayBuffer();
    const base64Audio = Buffer.from(audioBuffer).toString("base64");
    return NextResponse.json({ audio: base64Audio, contentType: "audio/mpeg", audioUrl: "" });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}