
export function LoadingSpinner({ message = '잠시만 기다려주세요...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-12">
      <div className="relative w-20 h-20 mb-6">
        <div className="absolute inset-0 bg-sea-200 rounded-full animate-ping opacity-75"></div>
        <div className="absolute inset-2 bg-sea-400 rounded-full flex items-center justify-center animate-float">
          <span className="text-2xl">🫧</span>
        </div>
      </div>
      <p className="text-text-muted font-medium animate-pulse">{message}</p>
    </div>
  );
}
