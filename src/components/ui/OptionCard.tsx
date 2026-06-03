import clsx from 'clsx';

interface OptionCardProps {
  label?: string;
  text: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export function OptionCard({ label, text, selected, onClick, disabled = false }: OptionCardProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'w-full text-left p-4 rounded-3xl transition-all duration-200 border-2',
        'focus:outline-none focus:ring-4 focus:ring-sea-200',
        selected
          ? 'bg-coral-100 border-coral-400 shadow-soft transform -translate-y-1'
          : 'bg-sea-50 border-transparent hover:bg-sea-100 hover:border-sea-200 text-text-base',
        disabled && !selected ? 'opacity-50 cursor-not-allowed hover:transform-none hover:bg-sea-50 hover:border-transparent' : 'cursor-pointer'
      )}
    >
      <div className="flex items-start">
        {label && (
          <span className={clsx(
            'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3 mt-0.5',
            selected ? 'bg-coral-400 text-white' : 'bg-white text-sea-600'
          )}>
            {label}
          </span>
        )}
        <span className="text-lg leading-relaxed">{text}</span>
      </div>
    </button>
  );
}
