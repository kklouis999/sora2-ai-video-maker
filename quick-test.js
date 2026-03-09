const { VertexAI } = require('@google-cloud/vertexai');

async function run() {
  const vertexAI = new VertexAI({
    project: 'my-ai-video-key-id', 
    location: 'us-central1'
  });

  const model = vertexAI.getGenerativeModel({
    model: 'veo-3.1-fast-generate-001',
  });

  console.log("正在尝试生成视频 (通过系统环境变量代理)...");
  try {
    const resp = await model.generateContent({
      prompt: 'A cinematic high-tech city, 4k, realistic.'
    });
    console.log("✅ 成功！响应内容:", JSON.stringify(resp, null, 2));
  } catch (e) {
    console.log("❌ 报错详情:", e.message);
  }
}
run();