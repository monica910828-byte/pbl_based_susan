
interface FeedbackBoxProps {
  title?: string;
  content: string;
}

export function FeedbackBox({ title = '전문가의 조언', content }: FeedbackBoxProps) {
  return (
    <div className="mt-6 bg-sand-100 border-l-4 border-sand-300 rounded-r-2xl p-6 shadow-soft animate-bubble-rise" style={{ animationDuration: '0.5s', animationIterationCount: '1', animationFillMode: 'forwards', transform: 'translateY(0)'}}>
      <h4 className="text-coral-600 font-bold mb-2 flex items-center">
        <span className="mr-2">💡</span> {title}
      </h4>
      <p className="text-text-base leading-relaxed whitespace-pre-wrap">{content}</p>
    </div>
  );
}
