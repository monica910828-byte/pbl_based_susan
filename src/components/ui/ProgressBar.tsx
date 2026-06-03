
interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm font-medium text-text-muted mb-2">
        <span>진행률</span>
        <span>{current} / {total}</span>
      </div>
      <div className="h-3 w-full bg-sea-100 rounded-full overflow-hidden relative">
        <div
          className="h-full bg-sea-400 transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
        {/* Subtle wave effect on the progress bar could be added here if desired */}
      </div>
    </div>
  );
}
