import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { photos } = await request.json();

    if (!photos || photos.length === 0) {
      return NextResponse.json({ error: "Missing photos" }, { status: 400 });
    }

    const photoDuration = Math.max(5, Math.floor(60 / photos.length));
    const totalDuration = photos.length * photoDuration;

    const elements = photos.map((photoUrl: string, index: number) => ({
      type: "image",
      source: photoUrl,
      time: index * photoDuration,
      duration: photoDuration + 1,
      animations: [
        {
          type: "scale",
          scope: "element",
          easing: "linear",
          start_scale: "100%",
          end_scale: "110%",
        },
      ],
    }));

    const renderPayload = {
      source: {
        output_format: "mp4",
        width: 1920,
        height: 1080,
        duration: totalDuration,
        elements,
      },
    };

    const response = await fetch("https://api.creatomate.com/v1/renders", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CREATOMATE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(renderPayload),
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json({ error }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json({ renderId: data[0].id, status: data[0].status });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}