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
"[project]/src/app/api/video/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '@/lib/video-generator'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
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
        // Try to call Google Veo 3.1 API if credentials are available
        if (process.env.GOOGLE_PROJECT_ID) {
            try {
                console.log("Calling Veo 3.1 API...");
                const videoUrl = await generateVideo(prompt, {
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
                // Check if it's an authentication or credential error
                const errorMessage = apiError.message || "";
                if (errorMessage.includes("401") || errorMessage.includes("403") || errorMessage.includes("authentication") || errorMessage.includes("permission") || errorMessage.includes("credentials")) {
                    // Fall back to demo mode
                    console.log("API credentials error, using demo mode");
                    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                        success: true,
                        video: {
                            id: "demo-" + Date.now(),
                            prompt,
                            duration,
                            resolution,
                            style,
                            status: "completed",
                            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                        },
                        demo: true,
                        message: "Demo mode: API credentials error. Using sample video."
                    });
                }
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: "Video generation failed",
                    details: apiError.message
                }, {
                    status: 500
                });
            }
        }
        // No API credentials: return demo response with sample video
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            video: {
                id: "demo-" + Date.now(),
                prompt,
                duration,
                resolution,
                style,
                status: "completed",
                videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            },
            demo: true,
            message: "Demo mode: Using sample video. Configure GOOGLE_PROJECT_ID and GOOGLE_LOCATION in .env.local for real generation (Veo 3.1)."
        });
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

//# sourceMappingURL=%5Broot-of-the-server%5D__4108494f._.js.map