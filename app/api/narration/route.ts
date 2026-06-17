import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  try {
    const { script, userId } = await request.json();
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

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const fileName = `${userId}/${Date.now()}-narration.mp3`;
    const { error: uploadError } = await supabase.storage
      .from("Memories")
      .upload(fileName, Buffer.from(audioBuffer), { contentType: "audio/mpeg" });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const audioUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/Memories/${fileName}`;

    return NextResponse.json({ audio: base64Audio, contentType: "audio/mpeg", audioUrl });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}