import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { script } = await request.json();

    if (!script) {
      return NextResponse.json({ error: "No script provided" }, { status: 400 });
    }

    const VOICE_ID = "21m00Tcm4TlvDq8ikWAM";

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": process.env.ELEVENLABS_API_KEY || "",
        },
        body: JSON.stringify({
          text: script,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json({ error }, { status: 500 });
    }

    const audioBuffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(audioBuffer).toString("base64");

    return NextResponse.json({
      audio: base64Audio,
      contentType: "audio/mpeg",
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}