'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState('8');
  const [resolution, setResolution] = useState('1080p');
  const [style, setStyle] = useState('realistic');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [demo, setDemo] = useState(false);

  const examplePrompts = [
    "在阳光明媚的海滩上，波浪轻轻拍打海岸，金色的夕阳缓缓落下，海鸥在空中盘旋",
    "赛博朋克城市夜景，霓虹灯光闪烁，无人驾驶汽车在街道上行驶，天空下着酸雨",
    "一只可爱的猫咪在草地上追逐蝴蝶，阳光透过树叶洒下斑驳的光影",
    "航拍视角下的雪山山脉，白雪皑皑，云海翻腾，阳光照耀下闪闪发光",
    "未来科技的实验室里，机器人正在组装精密零件，蓝色全息投影显示着数据",
    "古老的中国寺庙，樱花盛开，僧人在庭院中扫地，钟声悠扬"
  ];

  const handleRandomExample = () => {
    const random = examplePrompts[Math.floor(Math.random() * examplePrompts.length)];
    setPrompt(random);
  };

  const handleExampleClick = (examplePrompt) => {
    setPrompt(examplePrompt);
    document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!prompt.trim()) {
      setError('请输入视频描述内容');
      return;
    }

    if (prompt.length > 500) {
      setError('描述内容不能超过500字');
      return;
    }

    setIsGenerating(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          duration: parseInt(duration),
          resolution,
          style
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '视频生成失败');
      }

      setResult(data.video);
      setDemo(!!data.demo);
      if (data.message) {
        console.log(data.message);
      }
    } catch (err) {
      setError(err.message || '生成失败，请重试');
    } finally {
      setIsGenerating(false);
    }
  };

  const getStyleName = (styleValue) => {
    const styleMap = {
      'realistic': '真实写实',
      'cinematic': '电影质感',
      'anime': '二次元动画',
      'cyberpunk': '赛博朋克'
    };
    return styleMap[styleValue] || styleValue;
  };

  return (
    <>
      <header className="header">
        <div className="container header-inner">
          <a href="/" className="logo">
            <span className="logo-icon">▶</span>
            <span className="logo-text">Sora<span className="logo-highlight">2</span> Video</span>
          </a>
          <nav className="nav">
            <a href="#generator" className="nav-link active">生成视频</a>
            <a href="#examples" className="nav-link">示例</a>
            <a href="#features" className="nav-link">功能</a>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="hero">
          <div className="container">
            <div className="hero-badge">✨ Veo 3.1 技术驱动</div>
            <h1 className="hero-title">Video Maker</h1>
            <p className="hero-subtitle">输入文本提示词，AI 自动生成精彩视频</p>
            <p className="hero-desc">支持中英文描述，生成 5-15 秒高清视频，无需任何视频制作经验</p>
          </div>
        </section>

        {/* Generator Section */}
        <section id="generator" className="generator">
          <div className="container">
            <div className="generator-card">
              <form id="video-form" className="video-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="prompt" className="form-label">
                    <span className="label-icon">💬</span>
                    描述你想要生成的视频
                  </label>
                  <textarea
                    id="prompt"
                    name="prompt"
                    className="form-textarea"
                    rows={4}
                    placeholder="例如：在阳光明媚的海滩上，波浪轻轻拍打海岸，金色的夕阳缓缓落下..."
                    required
                    maxLength={500}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                  <div className="form-hint">
                    <span style={{ color: prompt.length > 450 ? '#ef4444' : '#9ca3af' }}>{prompt.length}/500</span>
                    <button type="button" id="example-btn" className="example-btn" onClick={handleRandomExample}>
                      ✨ 随机示例
                    </button>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group form-group-inline">
                    <label htmlFor="duration" className="form-label">视频时长</label>
                    <select
                      id="duration"
                      name="duration"
                      className="form-select"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                    >
                      <option value="5">5 秒</option>
                      <option value="8">8 秒</option>
                      <option value="10">10 秒</option>
                    </select>
                  </div>

                  <div className="form-group form-group-inline">
                    <label htmlFor="resolution" className="form-label">分辨率</label>
                    <select
                      id="resolution"
                      name="resolution"
                      className="form-select"
                      value={resolution}
                      onChange={(e) => setResolution(e.target.value)}
                    >
                      <option value="720p">720p</option>
                      <option value="1080p">1080p</option>
                      <option value="4k">4K</option>
                    </select>
                  </div>

                  <div className="form-group form-group-inline">
                    <label htmlFor="style" className="form-label">视频风格</label>
                    <select
                      id="style"
                      name="style"
                      className="form-select"
                      value={style}
                      onChange={(e) => setStyle(e.target.value)}
                    >
                      <option value="realistic">真实写实</option>
                      <option value="cinematic">电影质感</option>
                      <option value="anime">二次元动画</option>
                      <option value="cyberpunk">赛博朋克</option>
                    </select>
                  </div>
                </div>

                <button type="submit" className="generate-btn" disabled={isGenerating}>
                  <span className="btn-icon">{isGenerating ? '⏳' : '⚡'}</span>
                  <span className="btn-text">{isGenerating ? '生成中...' : '开始生成视频'}</span>
                </button>

                {error && <p className="form-message error">{error}</p>}
              </form>

              {/* Result Section */}
              {result && (
                <div className="result-section">
                  <div className="result-header">
                    <h2 className="result-title">生成结果</h2>
                    <span className="result-status success">生成成功</span>
                  </div>
                  <div className="result-content">
                    <div className="result-video-wrapper">
                      <video
                        className="result-video"
                        controls
                        src={result.videoUrl}
                        poster=""
                      >
                        您的浏览器不支持 video 元素
                      </video>
                    </div>
                    <div className="result-prompt">
                      <div className="result-prompt-label">提示词</div>
                      <div className="result-prompt-text">{result.prompt}</div>
                    </div>
                    <div className="result-prompt" style={{ marginTop: '12px' }}>
                      <div className="result-prompt-label">生成参数</div>
                      <div className="result-prompt-text">
                        时长: {result.duration}秒 | 分辨率: {result.resolution} | 风格: {getStyleName(result.style)}
                      </div>
                    </div>
                    {demo && (
                      <div className="demo-notice">
                        <span className="demo-badge">演示模式</span>
                        <p>当前使用的是示例视频。配置 GOOGLE_PROJECT_ID 和 GOOGLE_LOCATION 环境变量可启用真实视频生成。</p>
                      </div>
                    )}
                    <div className="result-actions">
                      <a
                        href={result.videoUrl}
                        download
                        className="result-btn result-btn-primary"
                      >
                        下载视频
                      </a>
                      <button
                        className="result-btn result-btn-secondary"
                        onClick={() => {
                          navigator.clipboard.writeText(result.videoUrl);
                        }}
                      >
                        复制链接
                      </button>
                      <button
                        className="result-btn result-btn-secondary"
                        onClick={() => {
                          setResult(null);
                          setError('');
                        }}
                      >
                        再次生成
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Examples Section */}
        <section id="examples" className="examples">
          <div className="container">
            <h2 className="section-title">示例提示词</h2>
            <p className="section-desc">点击提示词即可自动填入，体验AI视频生成的魅力</p>

            <div className="examples-grid">
              <button className="example-card" onClick={() => handleExampleClick("在阳光明媚的海滩上，波浪轻轻拍打海岸，金色的夕阳缓缓落下，海鸥在空中盘旋")}>
                <div className="example-preview example-preview-1"></div>
                <p className="example-text">在阳光明媚的海滩上，波浪轻轻拍打海岸...</p>
              </button>

              <button className="example-card" onClick={() => handleExampleClick("赛博朋克城市夜景，霓虹灯光闪烁，无人驾驶汽车在街道上行驶，天空下着酸雨")}>
                <div className="example-preview example-preview-2"></div>
                <p className="example-text">赛博朋克城市夜景，霓虹灯光闪烁...</p>
              </button>

              <button className="example-card" onClick={() => handleExampleClick("一只可爱的猫咪在草地上追逐蝴蝶，阳光透过树叶洒下斑驳的光影")}>
                <div className="example-preview example-preview-3"></div>
                <p className="example-text">一只可爱的猫咪在草地上追逐蝴蝶...</p>
              </button>

              <button className="example-card" onClick={() => handleExampleClick("航拍视角下的雪山山脉，白雪皑皑，云海翻腾，阳光照耀下闪闪发光")}>
                <div className="example-preview example-preview-4"></div>
                <p className="example-text">航拍视角下的雪山山脉...</p>
              </button>

              <button className="example-card" onClick={() => handleExampleClick("未来科技的实验室里，机器人正在组装精密零件，蓝色全息投影显示着数据")}>
                <div className="example-preview example-preview-5"></div>
                <p className="example-text">未来科技的实验室里，机器人正在组装...</p>
              </button>

              <button className="example-card" onClick={() => handleExampleClick("古老的中国寺庙，樱花盛开，僧人在庭院中扫地，钟声悠扬")}>
                <div className="example-preview example-preview-6"></div>
                <p className="example-text">古老的中国寺庙，樱花盛开...</p>
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="features">
          <div className="container">
            <h2 className="section-title">为什么选择我们</h2>

            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">🚀</div>
                <h3 className="feature-title">快速生成</h3>
                <p className="feature-desc">先进的AI模型，几分钟内完成视频生成，无需长时间等待</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">🎬</div>
                <h3 className="feature-title">多种风格</h3>
                <p className="feature-desc">支持写实、动画、电影、赛博朋克等多种风格，满足不同需求</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">🆓</div>
                <h3 className="feature-title">免费使用</h3>
                <p className="feature-desc">基础功能完全免费，无需注册即可体验AI视频创作</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">📱</div>
                <h3 className="feature-title">高清输出</h3>
                <p className="feature-desc">支持720p、1080p和4K分辨率，适配各种平台发布需求</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="faq">
          <div className="container">
            <h2 className="section-title">常见问题</h2>

            <div className="faq-list">
              <details className="faq-item">
                <summary className="faq-question">Veo 3.1 AI Video Maker 是什么？</summary>
                <p className="faq-answer">Veo 3.1 AI Video Maker 是一款基于 Google Veo 3.1 技术的 AI 视频生成工具，用户只需输入文本描述，即可自动生成对应的视频内容。无需任何视频制作经验，只需描述你的想法，AI 会帮你完成创作。</p>
              </details>

              <details className="faq-item">
                <summary className="faq-question">生成视频需要多长时间？</summary>
                <p className="faq-answer">视频生成时间取决于多个因素，包括服务器负载、提示词复杂度和所选时长。一般情况下，5-10秒的视频生成需要 2-5 分钟。</p>
              </details>

              <details className="faq-item">
                <summary className="faq-question">生成的视频可以商用吗？</summary>
                <p className="faq-answer">是的，用户生成的视频可以用于个人和商业用途。我们建议查看最新的服务条款了解具体细节。</p>
              </details>

              <details className="faq-item">
                <summary className="faq-question">支持哪些语言输入？</summary>
                <p className="faq-answer">支持中英文输入。英文提示词通常能获得更好的生成效果，建议使用英文描述复杂场景。</p>
              </details>

              <details className="faq-item">
                <summary className="faq-question">视频生成失败怎么办？</summary>
                <p className="faq-answer">如果生成失败，可能是由于提示词描述不清晰或系统负载过高。建议：1）尝试简化提示词；2）稍后重试；3）调整视频参数设置。</p>
              </details>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <span className="logo-text">Veo<span className="logo-highlight">3.1</span> Video</span>
              <p className="footer-tagline">让每个人都能轻松创作视频</p>
            </div>
            <div className="footer-links">
              <a href="#" className="footer-link">使用条款</a>
              <a href="#" className="footer-link">隐私政策</a>
              <a href="#" className="footer-link">联系我们</a>
            </div>
          </div>
          <p className="footer-copyright">© 2026 Veo 3.1 AI Video Maker. All rights reserved.</p>
        </div>
      </footer>

      {/* Result video styles */}
      <style jsx>{`
        .result-video-wrapper {
          width: 100%;
          max-width: 640px;
          aspect-ratio: 16/9;
          background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 16px;
        }
        .result-video {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .result-prompt {
          padding: 16px;
          background: #f9fafb;
          border-radius: 8px;
          width: 100%;
          max-width: 640px;
        }
        .result-prompt-label {
          font-size: 12px;
          color: #6b7280;
          margin-bottom: 4px;
        }
        .result-prompt-text {
          font-size: 14px;
          color: #1f2937;
        }
        .result-actions {
          display: flex;
          gap: 12px;
          margin-top: 16px;
          flex-wrap: wrap;
        }
        .result-btn {
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
          display: inline-block;
        }
        .result-btn-primary {
          background: linear-gradient(135deg, #f97316 0%, #fb923c 100%);
          color: white;
          border: none;
        }
        .result-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.4);
        }
        .result-btn-secondary {
          background: white;
          color: #374151;
          border: 1px solid #e5e7eb;
        }
        .result-btn-secondary:hover {
          background: #f9fafb;
        }
        .demo-notice {
          margin-top: 16px;
          padding: 12px;
          background: #fef3c7;
          border-radius: 8px;
          max-width: 640px;
        }
        .demo-badge {
          display: inline-block;
          padding: 2px 8px;
          background: #f59e0b;
          color: white;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          margin-bottom: 8px;
        }
        .demo-notice p {
          font-size: 13px;
          color: #92400e;
          margin: 0;
        }
      `}</style>
    </>
  );
}
