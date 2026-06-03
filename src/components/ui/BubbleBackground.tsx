
export function BubbleBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-[#FFFDF9]">
      <div className="absolute top-10 left-10 text-3xl opacity-50 animate-float" style={{ animationDelay: '0s' }}>☁️</div>
      <div className="absolute top-40 right-20 text-4xl opacity-40 animate-float" style={{ animationDelay: '1s' }}>✨</div>
      <div className="absolute bottom-20 left-1/4 text-5xl opacity-30 animate-float" style={{ animationDelay: '2s' }}>💖</div>
      <div className="absolute top-1/2 right-1/3 text-4xl opacity-40 animate-float" style={{ animationDelay: '1.5s' }}>⭐</div>
      <div className="absolute bottom-1/3 right-10 text-3xl opacity-50 animate-float" style={{ animationDelay: '0.5s' }}>🌸</div>
      <div className="absolute top-20 left-1/2 w-16 h-16 bg-coral-100 rounded-full opacity-30 animate-float" style={{ animationDelay: '2.5s' }}></div>
      <div className="absolute bottom-10 right-1/2 w-24 h-24 bg-sand-300 rounded-full opacity-20 animate-float" style={{ animationDelay: '0.8s' }}></div>
    </div>
  );
}
