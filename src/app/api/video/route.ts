import { NextRequest, NextResponse } from "next/server";
import { generateVideo } from "@/lib/video-generator";
import { prisma } from "@/lib/prisma";

// Demo mode - no database required
// Set GOOGLE_PROJECT_ID and GOOGLE_LOCATION in .env.local for real video generation using Veo 3.1

export async function POST(request: NextRequest) {
  let body;
  try {
    body = await request.json();
  } catch (parseError: any) {
    const text = await request.text();
    console.error("JSON Parse Error:", parseError.message);
    console.error("Received body:", text);
    return NextResponse.json(
      { error: "Invalid JSON format", details: parseError.message },
      { status: 400 }
    );
  }

  try {
    const { prompt, duration = 8, resolution = "1080p", style = "realistic" } = body;

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: "Prompt is required and must be a valid string" },
        { status: 400 }
      );
    }

    console.log("Processing video request:", { prompt, duration, resolution, style });
    console.log("Google Project ID configured:", !!process.env.GOOGLE_PROJECT_ID);

    // Map style to aspect ratio
    const aspectRatioMap: Record<string, string> = {
      realistic: "16:9",
      cinematic: "16:9",
      anime: "16:9",
      cyberpunk: "16:9",
    };
    const aspectRatio = aspectRatioMap[style] || "16:9";

    // Always try to call Veo 3.1 API (credentials are now hardcoded in video-generator.ts)
    console.log("Calling Veo 3.1 API...");
    
    try {
      const videoUrl = await generateVideo(prompt, { 
        duration, 
        resolution, 
        aspectRatio 
      });

      // 保存视频记录到数据库
      const videoRecord = await prisma.video.create({
        data: {
          prompt,
          videoUrl,
          duration,
          resolution,
          style,
          status: "completed",
          model: "cogvideox-3",
        },
      });
      
      console.log("Video saved to database:", videoRecord.id);

      return NextResponse.json({
        success: true,
        video: {
          id: videoRecord.id,
          prompt,
          duration,
          resolution,
          style,
          status: "completed",
          videoUrl: videoUrl,
        },
        model: "cogvideox-3",
      });
    } catch (apiError: any) {
      console.error("Veo 3.1 API Error:", apiError);
      
      // Return error to frontend - no fallback to demo mode
      return NextResponse.json(
        { error: "Video generation failed", details: apiError.message },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message, stack: error.stack },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "20");
  const offset = parseInt(searchParams.get("offset") || "0");

  try {
    const [videos, total] = await Promise.all([
      prisma.video.findMany({
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.video.count(),
    ]);

    return NextResponse.json({
      videos,
      total,
      limit,
      offset,
    });
  } catch (error: any) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch videos", details: error.message },
      { status: 500 }
    );
  }
}
