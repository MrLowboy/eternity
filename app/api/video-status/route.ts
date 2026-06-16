import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const renderId = searchParams.get("renderId");

    if (!renderId) {
      return NextResponse.json({ error: "Missing renderId" }, { status: 400 });
    }

    const response = await fetch(
      `https://api.creatomate.com/v1/renders/${renderId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CREATOMATE_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json({ error }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json({ status: data.status, url: data.url });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}