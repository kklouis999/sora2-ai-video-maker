interface VideoGenerationOptions {
  prompt: string;
  duration?: number;
  resolution?: string;
  aspectRatio?: string;
  withAudio?: boolean;
  quality?: "speed" | "quality";
}

interface VideoGenerationResult {
  videoUrl: string;
  taskId: string;
}

interface ZhipuVideoResponse {
  model: string;
  id: string;
  request_id: string;
  task_status: "PROCESSING" | "SUCCESS" | "FAIL";
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function generateVideo(
  prompt: string,
  options: VideoGenerationOptions = {}
): Promise<string> {
  const {
    duration = 5,
    resolution = "1920x1080",
    withAudio = false,
    quality = "speed",
  } = options;

  const apiKey = process.env.ZHIPU_API_KEY;

  if (!apiKey) {
    throw new Error("ZHIPU_API_KEY is not configured. Please set it in .env.local");
  }

  console.log("Initializing ZhipuAI (CogVideoX-3) client...");
  console.log("Prompt:", prompt);

  // Map resolution to ZhipuAI format
  const sizeMap: Record<string, string> = {
    "1920x1080": "1920x1080",
    "1080x1920": "1080x1920",
    "1280x720": "1280x720",
    "720x1280": "720x1280",
    "1024x1024": "1024x1024",
    "2048x1080": "2048x1080",
    "3840x2160": "3840x2160",
  };

  const size = sizeMap[resolution] || "1920x1080";

  // Map duration - ZhipuAI supports 5 or 10 seconds
  const videoDuration = duration > 5 ? 10 : 5;

  try {
    // Step 1: Submit video generation request
    console.log("Submitting video generation request to CogVideoX-3...");

    const submitResponse = await fetch(
      "https://open.bigmodel.cn/api/paas/v4/videos/generations",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "cogvideox-3",
          prompt: prompt,
          quality: quality,
          with_audio: withAudio,
          size: size,
          fps: 30,
          duration: videoDuration,
        }),
      }
    );

    if (!submitResponse.ok) {
      const errorText = await submitResponse.text();
      throw new Error(`ZhipuAI API error: ${submitResponse.status} - ${errorText}`);
    }

    const result: ZhipuVideoResponse = await submitResponse.json();
    console.log("Video generation task submitted:", result);

    const taskId = result.id;
    const requestId = result.request_id;

    if (!taskId) {
      throw new Error("No task ID returned from ZhipuAI API");
    }

    // Step 2: Poll for results
    console.log("Polling for video generation result...");

    const maxAttempts = 120; // Maximum 10 minutes (5 seconds per attempt)
    const pollInterval = 5000;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      await sleep(pollInterval);

      const statusResponse = await fetch(
        `https://open.bigmodel.cn/api/paas/v4/async-result/${taskId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!statusResponse.ok) {
        const errorText = await statusResponse.text();
        console.error("Status check error:", errorText);
        continue;
      }

      const statusResult = await statusResponse.json();
      console.log(
        `Video generation status: ${statusResult.task_status} (attempt ${attempt + 1}/${maxAttempts})`
      );

      if (statusResult.task_status === "SUCCESS") {
        console.log("Video generated successfully!");

        // Extract video URL from the result - API returns video_result array
        const videoResult = statusResult.video_result?.[0];
        const videoUrl = videoResult?.url;

        if (videoUrl) {
          console.log("Video URL:", videoUrl);
          return videoUrl;
        }

        throw new Error("Video generation completed but no video URL found");
      }

      if (statusResult.task_status === "FAIL") {
        const errorMsg = statusResult.error?.message || "Video generation failed";
        throw new Error(`Video generation failed: ${errorMsg}`);
      }
    }

    throw new Error("Video generation timed out");

  } catch (error: any) {
    console.error("CogVideoX API Error:", error);

    if (error.message?.includes("401") || error.message?.includes("authentication")) {
      throw new Error("Authentication failed. Please check your ZHIPU_API_KEY.");
    }

    if (error.message?.includes("403") || error.message?.includes("permission")) {
      throw new Error("Permission denied. Please check your ZhipuAI API permissions.");
    }

    if (error.message?.includes("quota") || error.message?.includes("rate limit")) {
      throw new Error("Rate limit or quota exceeded. Please try again later.");
    }

    throw error;
  }
}

export async function getVideoStatus(taskId: string): Promise<any> {
  const apiKey = process.env.ZHIPU_API_KEY;

  if (!apiKey) {
    throw new Error("ZHIPU_API_KEY is not configured");
  }

  const response = await fetch(
    `https://open.bigmodel.cn/api/paas/v4/async-result/${taskId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`ZhipuAI API error: ${response.status} - ${errorText}`);
  }

  return await response.json();
}
