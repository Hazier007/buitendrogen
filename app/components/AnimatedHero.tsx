'use client';

export default function AnimatedHero() {
  return (
    <div className="relative bg-gradient-to-b from-sky-400 via-sky-500 to-blue-600 text-white py-16 px-4 overflow-hidden">
      {/* Animated Clouds */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Cloud 1 */}
        <div className="cloud cloud-1 absolute">
          <svg viewBox="0 0 200 100" className="w-32 h-16 text-white/30">
            <ellipse cx="60" cy="60" rx="50" ry="30" fill="currentColor" />
            <ellipse cx="100" cy="50" rx="60" ry="40" fill="currentColor" />
            <ellipse cx="150" cy="60" rx="45" ry="28" fill="currentColor" />
          </svg>
        </div>
        
        {/* Cloud 2 */}
        <div className="cloud cloud-2 absolute">
          <svg viewBox="0 0 200 100" className="w-40 h-20 text-white/20">
            <ellipse cx="60" cy="60" rx="50" ry="30" fill="currentColor" />
            <ellipse cx="100" cy="50" rx="60" ry="40" fill="currentColor" />
            <ellipse cx="150" cy="60" rx="45" ry="28" fill="currentColor" />
          </svg>
        </div>
        
        {/* Cloud 3 */}
        <div className="cloud cloud-3 absolute">
          <svg viewBox="0 0 200 100" className="w-24 h-12 text-white/25">
            <ellipse cx="60" cy="60" rx="50" ry="30" fill="currentColor" />
            <ellipse cx="100" cy="50" rx="60" ry="40" fill="currentColor" />
            <ellipse cx="150" cy="60" rx="45" ry="28" fill="currentColor" />
          </svg>
        </div>
        
        {/* Cloud 4 */}
        <div className="cloud cloud-4 absolute">
          <svg viewBox="0 0 200 100" className="w-36 h-18 text-white/15">
            <ellipse cx="60" cy="60" rx="50" ry="30" fill="currentColor" />
            <ellipse cx="100" cy="50" rx="60" ry="40" fill="currentColor" />
            <ellipse cx="150" cy="60" rx="45" ry="28" fill="currentColor" />
          </svg>
        </div>

        {/* Cloud 5 */}
        <div className="cloud cloud-5 absolute">
          <svg viewBox="0 0 200 100" className="w-28 h-14 text-white/20">
            <ellipse cx="60" cy="60" rx="50" ry="30" fill="currentColor" />
            <ellipse cx="100" cy="50" rx="60" ry="40" fill="currentColor" />
            <ellipse cx="150" cy="60" rx="45" ry="28" fill="currentColor" />
          </svg>
        </div>

        {/* Sun */}
        <div className="absolute top-8 right-8 md:right-16">
          <div className="w-20 h-20 md:w-28 md:h-28 bg-yellow-300 rounded-full animate-pulse shadow-[0_0_60px_rgba(253,224,71,0.6)]" />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="text-6xl md:text-7xl mb-4 animate-bounce-slow">🧺</div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg">
          Buiten Drogen Calculator
        </h1>
        <p className="text-xl md:text-2xl opacity-90 drop-shadow max-w-2xl mx-auto">
          Bereken hoe lang je was nodig heeft om buiten te drogen op basis van het actuele weer
        </p>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" className="w-full h-12 md:h-16">
          <path
            fill="#f0f9ff"
            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
          />
        </svg>
      </div>

      <style jsx>{`
        @keyframes float-cloud {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(calc(100vw + 100%));
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }

        .cloud {
          animation: float-cloud linear infinite;
        }

        .cloud-1 {
          top: 10%;
          animation-duration: 35s;
          animation-delay: 0s;
        }

        .cloud-2 {
          top: 25%;
          animation-duration: 45s;
          animation-delay: -10s;
        }

        .cloud-3 {
          top: 50%;
          animation-duration: 30s;
          animation-delay: -5s;
        }

        .cloud-4 {
          top: 70%;
          animation-duration: 50s;
          animation-delay: -20s;
        }

        .cloud-5 {
          top: 35%;
          animation-duration: 40s;
          animation-delay: -15s;
        }
      `}</style>
    </div>
  );
}
