module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/src/lib/video-generator.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "generateVideo",
    ()=>generateVideo,
    "getVideoStatus",
    ()=>getVideoStatus
]);
async function sleep(ms) {
    return new Promise((resolve)=>setTimeout(resolve, ms));
}
async function generateVideo(prompt, options = {}) {
    const { duration = 5, resolution = "1920x1080", withAudio = false, quality = "speed" } = options;
    const apiKey = process.env.ZHIPU_API_KEY;
    if (!apiKey) {
        throw new Error("ZHIPU_API_KEY is not configured. Please set it in .env.local");
    }
    console.log("Initializing ZhipuAI (CogVideoX-3) client...");
    console.log("Prompt:", prompt);
    // Map resolution to ZhipuAI format
    const sizeMap = {
        "1920x1080": "1920x1080",
        "1080x1920": "1080x1920",
        "1280x720": "1280x720",
        "720x1280": "720x1280",
        "1024x1024": "1024x1024",
        "2048x1080": "2048x1080",
        "3840x2160": "3840x2160"
    };
    const size = sizeMap[resolution] || "1920x1080";
    // Map duration - ZhipuAI supports 5 or 10 seconds
    const videoDuration = duration > 5 ? 10 : 5;
    try {
        // Step 1: Submit video generation request
        console.log("Submitting video generation request to CogVideoX-3...");
        const submitResponse = await fetch("https://open.bigmodel.cn/api/paas/v4/videos/generations", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "cogvideox-3",
                prompt: prompt,
                quality: quality,
                with_audio: withAudio,
                size: size,
                fps: 30,
                duration: videoDuration
            })
        });
        if (!submitResponse.ok) {
            const errorText = await submitResponse.text();
            throw new Error(`ZhipuAI API error: ${submitResponse.status} - ${errorText}`);
        }
        const result = await submitResponse.json();
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
        for(let attempt = 0; attempt < maxAttempts; attempt++){
            await sleep(pollInterval);
            const statusResponse = await fetch(`https://open.bigmodel.cn/api/paas/v4/async-result/${taskId}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                }
            });
            if (!statusResponse.ok) {
                const errorText = await statusResponse.text();
                console.error("Status check error:", errorText);
                continue;
            }
            const statusResult = await statusResponse.json();
            console.log(`Video generation status: ${statusResult.task_status} (attempt ${attempt + 1}/${maxAttempts})`);
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
    } catch (error) {
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
async function getVideoStatus(taskId) {
    const apiKey = process.env.ZHIPU_API_KEY;
    if (!apiKey) {
        throw new Error("ZHIPU_API_KEY is not configured");
    }
    const response = await fetch(`https://open.bigmodel.cn/api/paas/v4/async-result/${taskId}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json"
        }
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`ZhipuAI API error: ${response.status} - ${errorText}`);
    }
    return await response.json();
}
}),
"[project]/src/app/api/video/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$video$2d$generator$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/video-generator.ts [app-route] (ecmascript)");
;
;
async function POST(request) {
    let body;
    try {
        body = await request.json();
    } catch (parseError) {
        const text = await request.text();
        console.error("JSON Parse Error:", parseError.message);
        console.error("Received body:", text);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Invalid JSON format",
            details: parseError.message
        }, {
            status: 400
        });
    }
    try {
        const { prompt, duration = 8, resolution = "1080p", style = "realistic" } = body;
        if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Prompt is required and must be a valid string"
            }, {
                status: 400
            });
        }
        console.log("Processing video request:", {
            prompt,
            duration,
            resolution,
            style
        });
        console.log("Google Project ID configured:", !!process.env.GOOGLE_PROJECT_ID);
        // Map style to aspect ratio
        const aspectRatioMap = {
            realistic: "16:9",
            cinematic: "16:9",
            anime: "16:9",
            cyberpunk: "16:9"
        };
        const aspectRatio = aspectRatioMap[style] || "16:9";
        // Always try to call Veo 3.1 API (credentials are now hardcoded in video-generator.ts)
        console.log("Calling Veo 3.1 API...");
        try {
            const videoUrl = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$video$2d$generator$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateVideo"])(prompt, {
                duration,
                resolution,
                aspectRatio
            });
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: true,
                video: {
                    id: "veo-" + Date.now(),
                    prompt,
                    duration,
                    resolution,
                    style,
                    status: "completed",
                    videoUrl: videoUrl
                },
                model: "veo-3.1-generate-001"
            });
        } catch (apiError) {
            console.error("Veo 3.1 API Error:", apiError);
            // Return error to frontend - no fallback to demo mode
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Video generation failed",
                details: apiError.message
            }, {
                status: 500
            });
        }
    } catch (error) {
        console.error("API Error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Internal server error",
            details: error.message,
            stack: error.stack
        }, {
            status: 500
        });
    }
}
async function GET(request) {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");
    // Demo mode: return empty list
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        videos: [],
        total: 0,
        limit,
        offset,
        demo: true
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__6af6f63c._.js.map