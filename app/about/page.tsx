export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">关于恬牛游戏平台</h1>
      
      <div className="prose dark:prose-invert lg:prose-lg mx-auto">
        <p>
          恬牛游戏平台是一个现代化的网络应用程序，专为托管和展示各种游戏而设计，从简单的2D体验到沉浸式的3D冒险。
          我们的平台设计注重可扩展性，使新游戏能够轻松添加和集成。
        </p>
        
        <h2>技术栈</h2>
        <p>
          此平台使用以下技术构建：
        </p>
        <ul>
          <li><strong>Next.js</strong> - 用于服务端渲染和路由</li>
          <li><strong>React</strong> - 用于构建用户界面</li>
          <li><strong>TypeScript</strong> - 用于类型安全和开发体验</li>
          <li><strong>Three.js</strong> - 用于3D渲染</li>
          <li><strong>React Three Fiber</strong> - Three.js的React渲染器</li>
          <li><strong>Tailwind CSS</strong> - 用于样式设计</li>
          <li><strong>Zustand</strong> - 用于状态管理</li>
        </ul>
        
        <h2>添加新游戏</h2>
        <p>
          平台设计为易于扩展。可以通过以下方式添加新游戏：
        </p>
        <ol>
          <li>在games目录中创建新的游戏组件</li>
          <li>使用适当的库实现游戏逻辑（3D游戏使用Three.js，2D游戏使用Canvas API）</li>
          <li>将游戏元数据添加到游戏商店</li>
        </ol>
        
        <h2>关于恬牛</h2>
        <p>
          "恬牛"名称的灵感来源于恬静悠闲的牛，象征着我们希望玩家能在游戏中找到轻松愉快的体验。同时，牛也代表着坚韧和力量，我们希望能够不断提供高质量的游戏体验。
        </p>
        
        <h2>联系我们</h2>
        <p>
          有关此平台的更多信息或贡献内容，请联系开发团队。
        </p>
      </div>
    </div>
  );
} 