
export function BubbleBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-sea-50">
      {/* CSS-based bubbles can be added here or just static SVGs */}
      <div className="absolute top-10 left-10 w-12 h-12 bg-sea-100 rounded-full opacity-50 animate-float" style={{ animationDelay: '0s' }}></div>
      <div className="absolute top-40 right-20 w-8 h-8 bg-sea-200 rounded-full opacity-40 animate-float" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-sea-100 rounded-full opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 right-1/3 w-10 h-10 bg-coral-100 rounded-full opacity-40 animate-float" style={{ animationDelay: '1.5s' }}></div>
    </div>
  );
}
