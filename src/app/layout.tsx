import '../styles.css';

export const metadata = {
  title: 'Veo 3.1 AI Video Maker - 文本生成视频 | 免费AI视频生成工具',
  description: '使用Google Veo 3.1 AI技术，通过文本提示词轻松生成高质量视频。完全免费，无需注册，立即体验AI视频创作。',
  keywords: 'Veo 3.1, AI视频生成, 文本转视频, AI视频工具, 免费视频生成, Google AI',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
