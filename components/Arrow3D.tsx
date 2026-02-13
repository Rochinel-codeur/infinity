interface Arrow3DProps {
  className?: string;
  color?: "white" | "blue";
  direction?: "left" | "right";
}

export function Arrow3D({
  className,
  color = "white",
  direction = "right"
}: Arrow3DProps) {
  const isBlue = color === "blue";
  const isRight = direction === "right";

  return (
    <div
      className={`relative inline-flex items-center justify-center animate-float-arrow ${className ?? ""}`}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-lg"
        style={{ 
          transform: isRight ? "none" : "scaleX(-1)"
        }}
      >
        <defs>
          <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" /> {/* blue-500 */}
            <stop offset="100%" stopColor="#2563eb" /> {/* blue-600 */}
          </linearGradient>
          <linearGradient id="whiteGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#f8fafc" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        {/* Main Arrow Body */}
        <path
          d="M10,50 L60,50 M50,20 L80,50 L50,80"
          stroke={`url(#${isBlue ? "blueGradient" : "whiteGradient"})`}
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glow)"
          className="opacity-90"
        />
        
        {/* Subtle Highlight */}
        <path
          d="M10,50 L60,50 M50,20 L80,50 L50,80"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-40"
          style={{ mixBlendMode: 'overlay' }}
        />
      </svg>
    </div>
  );
}
