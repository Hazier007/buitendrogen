'use client';

export default function AnimatedHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-sky-400 to-blue-600 text-white">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {/* Animated sun */}
        <div className="absolute top-6 right-8 w-16 h-16 bg-yellow-300 rounded-full opacity-80 animate-pulse">
          <div className="absolute inset-0 w-full h-full bg-yellow-200 rounded-full animate-ping opacity-40"></div>
        </div>

        {/* Animated clouds */}
        <div className="absolute top-4 left-0 w-24 h-12 opacity-70">
          <div className="cloud-1 relative">
            <div className="w-8 h-8 bg-white rounded-full absolute top-2 left-0"></div>
            <div className="w-12 h-10 bg-white rounded-full absolute top-0 left-4"></div>
            <div className="w-6 h-6 bg-white rounded-full absolute top-3 left-12"></div>
          </div>
        </div>

        <div className="absolute top-12 left-1/4 w-20 h-10 opacity-60">
          <div className="cloud-2 relative">
            <div className="w-6 h-6 bg-white rounded-full absolute top-2 left-0"></div>
            <div className="w-10 h-8 bg-white rounded-full absolute top-0 left-3"></div>
            <div className="w-4 h-4 bg-white rounded-full absolute top-3 left-9"></div>
          </div>
        </div>

        <div className="absolute top-8 right-1/3 w-16 h-8 opacity-50">
          <div className="cloud-3 relative">
            <div className="w-4 h-4 bg-white rounded-full absolute top-2 left-0"></div>
            <div className="w-8 h-6 bg-white rounded-full absolute top-0 left-2"></div>
            <div className="w-3 h-3 bg-white rounded-full absolute top-2 left-7"></div>
          </div>
        </div>

        {/* Clothesline silhouette (optional) */}
        <div className="absolute bottom-16 left-1/4 right-1/4 h-1 bg-white/40">
          {/* T-shirt */}
          <div className="absolute -top-8 left-8 w-6 h-8 bg-white/30 rounded-sm animate-bounce-slow">
            <div className="absolute -top-1 left-1 w-4 h-2 bg-white/30 rounded-t"></div>
          </div>
          {/* Towel */}
          <div className="absolute -top-10 left-20 w-4 h-10 bg-white/20 rounded-sm animate-sway"></div>
          {/* Socks */}
          <div className="absolute -top-4 left-32 w-2 h-4 bg-white/25 rounded animate-bounce-slow"></div>
          <div className="absolute -top-4 left-36 w-2 h-4 bg-white/25 rounded animate-bounce-slow delay-150"></div>
        </div>
      </div>

      <div className="relative mx-auto max-w-5xl px-4 py-14 text-center z-10">
        <h1 className="text-4xl md:text-5xl font-bold">Buiten Drogen Calculator</h1>
        <p className="mt-4 text-lg opacity-90">
          Bereken hoe lang je was nodig heeft om buiten te drogen op basis van het actuele weer.
        </p>
      </div>

      <style jsx>{`
        .cloud-1 {
          animation: float-right 25s ease-in-out infinite;
        }
        .cloud-2 {
          animation: float-right 30s ease-in-out infinite;
          animation-delay: -5s;
        }
        .cloud-3 {
          animation: float-right 35s ease-in-out infinite;
          animation-delay: -10s;
        }
        
        @keyframes float-right {
          from {
            transform: translateX(-120px);
          }
          to {
            transform: translateX(calc(100vw + 120px));
          }
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }

        .animate-sway {
          animation: sway 4s ease-in-out infinite;
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-4px);
          }
        }

        @keyframes sway {
          0%, 100% {
            transform: rotate(-2deg);
          }
          50% {
            transform: rotate(2deg);
          }
        }

        .delay-150 {
          animation-delay: 0.15s;
        }
      `}</style>
    </section>
  );
}
