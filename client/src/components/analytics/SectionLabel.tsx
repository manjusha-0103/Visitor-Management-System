interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

export default function SectionLabel({ children, className = "" }: SectionLabelProps) {
  return (
    <p className={`text-[10px] uppercase tracking-[0.18em] font-semibold text-muted-foreground mb-3 ${className}`}>
      {children}
    </p>
  );
}