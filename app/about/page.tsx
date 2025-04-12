export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">About Game Platform</h1>
      
      <div className="prose dark:prose-invert lg:prose-lg mx-auto">
        <p>
          Game Platform is a modern web application designed to host and showcase a variety of games, 
          from simple 2D experiences to immersive 3D adventures. Our platform is built with 
          expandability in mind, allowing new games to be easily added and integrated.
        </p>
        
        <h2>Technical Stack</h2>
        <p>
          This platform is built using:
        </p>
        <ul>
          <li><strong>Next.js</strong> - For server-side rendering and routing</li>
          <li><strong>React</strong> - For building user interfaces</li>
          <li><strong>TypeScript</strong> - For type safety and developer experience</li>
          <li><strong>Three.js</strong> - For 3D rendering</li>
          <li><strong>React Three Fiber</strong> - React renderer for Three.js</li>
          <li><strong>Tailwind CSS</strong> - For styling</li>
          <li><strong>Zustand</strong> - For state management</li>
        </ul>
        
        <h2>Adding New Games</h2>
        <p>
          The platform is designed to be easily expandable. New games can be added by:
        </p>
        <ol>
          <li>Creating a new game component in the games directory</li>
          <li>Implementing game logic using appropriate libraries (Three.js for 3D, Canvas API for 2D)</li>
          <li>Adding game metadata to the game store</li>
        </ol>
        
        <h2>Contact</h2>
        <p>
          For more information about this platform or to contribute, please contact the development team.
        </p>
      </div>
    </div>
  );
} 