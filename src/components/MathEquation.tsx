"use client";

interface MathEquationProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function MathEquation({ children, className = "", size = 'md' }: MathEquationProps) {
  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl',
    xl: 'text-5xl'
  };

  return (
    <div className={`font-serif ${sizeClasses[size]} ${className}`} style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
      {children}
    </div>
  );
}

interface FractionProps {
  numerator: React.ReactNode;
  denominator: React.ReactNode;
  className?: string;
}

export function Fraction({ numerator, denominator, className = "" }: FractionProps) {
  return (
    <span className={`inline-flex flex-col items-center justify-center ${className}`}>
      <span className="border-b-2 border-current pb-1 px-2">{numerator}</span>
      <span className="pt-1 px-2">{denominator}</span>
    </span>
  );
}
