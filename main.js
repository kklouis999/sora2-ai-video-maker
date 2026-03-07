// Example prompts for the random button
const examplePrompts = [
  "在阳光明媚的海滩上，波浪轻轻拍打海岸，金色的夕阳缓缓落下，海鸥在空中盘旋",
  "赛博朋克城市夜景，霓虹灯光闪烁，无人驾驶汽车在街道上行驶，天空下着酸雨",
  "一只可爱的猫咪在草地上追逐蝴蝶，阳光透过树叶洒下斑驳的光影",
  "航拍视角下的雪山山脉，白雪皑皑，云海翻腾，阳光照耀下闪闪发光",
  "未来科技的实验室里，机器人正在组装精密零件，蓝色全息投影显示着数据",
  "古老的中国寺庙，樱花盛开，僧人在庭院中扫地，钟声悠扬"
];

// DOM Elements
const form = document.getElementById('video-form');
const promptTextarea = document.getElementById('prompt');
const charCount = document.getElementById('char-count');
const exampleBtn = document.getElementById('example-btn');
const formMessage = document.getElementById('form-message');
const resultSection = document.getElementById('result-section');
const resultStatus = document.getElementById('result-status');
const resultContent = document.getElementById('result-content');

// Character counter
promptTextarea.addEventListener('input', () => {
  const length = promptTextarea.value.length;
  charCount.textContent = `${length}/500`;
  charCount.style.color = length > 450 ? '#ef4444' : '#9ca3af';
});

// Random example button
exampleBtn.addEventListener('click', () => {
  const random = examplePrompts[Math.floor(Math.random() * examplePrompts.length)];
  promptTextarea.value = random;
  charCount.textContent = `${random.length}/500`;
});

// Example cards - click to fill
document.querySelectorAll('.example-card').forEach(card => {
  card.addEventListener('click', () => {
    const prompt = card.dataset.prompt;
    promptTextarea.value = prompt;
    charCount.textContent = `${prompt.length}/500`;
    document.getElementById('generator').scrollIntoView({ behavior: 'smooth' });
  });
});

// Form submission
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const prompt = promptTextarea.value.trim();
  const duration = document.getElementById('duration').value;
  const resolution = document.getElementById('resolution').value;
  const style = document.getElementById('style').value;
  
  if (!prompt) {
    formMessage.textContent = '请输入视频描述内容';
    formMessage.className = 'form-message error';
    return;
  }
  
  if (prompt.length > 500) {
    formMessage.textContent = '描述内容不能超过500字';
    formMessage.className = 'form-message error';
    return;
  }
  
  // Show result section
  resultSection.hidden = false;
  resultStatus.textContent = '生成中...';
  resultStatus.className = 'result-status processing';
  resultContent.innerHTML = `
    <div class="generating-animation">
      <div class="spinner"></div>
      <p style="color: #6b7280; margin-top: 16px;">AI 正在创作您的视频，请稍候...</p>
      <p style="color: #9ca3af; font-size: 13px; margin-top: 8px;">预计等待时间：2-5 分钟</p>
    </div>
  `;
  
  // Add spinner styles dynamically
  if (!document.getElementById('spinner-style')) {
    const style = document.createElement('style');
    style.id = 'spinner-style';
    style.textContent = `
      .spinner {
        width: 48px;
        height: 48px;
        border: 4px solid #e5e7eb;
        border-top-color: #f97316;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      .generating-animation {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 40px;
      }
      .result-video {
        width: 100%;
        max-width: 640px;
        aspect-ratio: 16/9;
        background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: 12px;
      }
      .result-video-icon {
        font-size: 48px;
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
      }
      .result-btn {
        padding: 10px 20px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
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
    `;
    document.head.appendChild(style);
  }
  
  // Simulate video generation (in real app, this would call an API)
  const generateTime = 3000 + Math.random() * 2000;
  
  setTimeout(() => {
    // Simulate success (90%) or failure (10%)
    const isSuccess = Math.random() > 0.1;
    
    if (isSuccess) {
      resultStatus.textContent = '生成成功';
      resultStatus.className = 'result-status success';
      
      resultContent.innerHTML = `
        <div class="result-video">
          <div class="result-video-icon">🎬</div>
          <p style="color: #6b7280;">视频生成完成</p>
        </div>
        <div class="result-prompt">
          <div class="result-prompt-label">提示词</div>
          <div class="result-prompt-text">${prompt}</div>
        </div>
        <div class="result-prompt" style="margin-top: 12px;">
          <div class="result-prompt-label">生成参数</div>
          <div class="result-prompt-text">时长: ${duration}秒 | 分辨率: ${resolution} | 风格: ${getStyleName(style)}</div>
        </div>
        <div class="result-actions">
          <button class="result-btn result-btn-primary">下载视频</button>
          <button class="result-btn result-btn-secondary">复制链接</button>
          <button class="result-btn result-btn-secondary">再次生成</button>
        </div>
      `;
      
      formMessage.textContent = '视频生成成功！';
      formMessage.className = 'form-message success';
    } else {
      resultStatus.textContent = '生成失败';
      resultStatus.className = 'result-status error';
      
      resultContent.innerHTML = `
        <div style="text-align: center; padding: 40px;">
          <p style="color: #ef4444; margin-bottom: 16px;">抱歉，视频生成失败</p>
          <p style="color: #6b7280; font-size: 14px;">可能原因：提示词描述不清晰或服务器负载过高</p>
          <p style="color: #9ca3af; font-size: 13px; margin-top: 8px;">建议：请尝试简化提示词或稍后重试</p>
        </div>
      `;
      
      formMessage.textContent = '生成失败，请重试';
      formMessage.className = 'form-message error';
    }
  }, generateTime);
});

// Helper function to get style display name
function getStyleName(style) {
  const styleMap = {
    'realistic': '真实写实',
    'cinematic': '电影质感',
    'anime': '二次元动画',
    'cyberpunk': '赛博朋克'
  };
  return styleMap[style] || style;
}

// Smooth scroll for navigation
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href').slice(1);
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Update active state
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    link.classList.add('active');
  });
});

// Update active nav on scroll
window.addEventListener('scroll', () => {
  const sections = ['generator', 'examples', 'features'];
  const scrollPos = window.scrollY + 100;
  
  for (const section of sections) {
    const el = document.getElementById(section);
    if (el) {
      const top = el.offsetTop;
      const height = el.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        document.querySelectorAll('.nav-link').forEach(l => {
          l.classList.remove('active');
          if (l.getAttribute('href') === `#${section}`) {
            l.classList.add('active');
          }
        });
      }
    }
  }
});
