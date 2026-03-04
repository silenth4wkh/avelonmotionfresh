interface SectionTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionTitle({ children, className = '' }: SectionTitleProps) {
  return (
    <h2 className={`text-sm font-semibold tracking-[0.2em] uppercase text-secondary-400 mb-3 ${className}`}>
      {children}
    </h2>
  );
}

interface SectionSubtitleProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionSubtitle({ children, className = '' }: SectionSubtitleProps) {
  return (
    <p className={`text-neutral-400 text-lg leading-relaxed ${className}`}>
      {children}
    </p>
  );
}
