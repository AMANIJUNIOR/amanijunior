import React from 'react';

interface SchoolLogoBadgeProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textColor?: 'dark' | 'light';
  className?: string;
  onClick?: () => void;
}

export const SchoolLogoBadge: React.FC<SchoolLogoBadgeProps> = ({
  size = 'md',
  showText = true,
  textColor = 'dark',
  className = '',
  onClick,
}) => {
  const sizeMap = {
    xs: 'w-8 h-8',
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
    xl: 'w-28 h-28',
  };

  const titleSizeMap = {
    xs: 'text-xs',
    sm: 'text-sm font-bold',
    md: 'text-base font-extrabold',
    lg: 'text-xl font-black tracking-tight',
    xl: 'text-2xl font-black tracking-tight',
  };

  const mottoSizeMap = {
    xs: 'text-[9px]',
    sm: 'text-[10px]',
    md: 'text-xs',
    lg: 'text-xs tracking-wider',
    xl: 'text-sm tracking-widest',
  };

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-3 select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Official School Crest Logo */}
      <div className="relative shrink-0 group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-emerald-600 rounded-full blur-[2px] opacity-70 group-hover:opacity-100 transition duration-300" />
        <div className={`relative ${sizeMap[size]} rounded-full overflow-hidden border-2 border-amber-400/90 shadow-md bg-[#0F1E36] flex items-center justify-center`}>
          <img
            src="/amani_logo.jpg"
            alt="AMANI JUNIOR ACADEMY AND JSS - Strive to Achieve"
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              // Fallback if image path has issue
              const target = e.currentTarget;
              target.onerror = null;
              target.src = '/amani_hero.jpg';
            }}
          />
        </div>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span
            className={`font-['Cinzel',serif] uppercase tracking-wide leading-tight ${titleSizeMap[size]} ${
              textColor === 'light' ? 'text-white' : 'text-[#0F1E36]'
            }`}
          >
            Amani Junior Academy
          </span>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="inline-block px-1.5 py-0.5 bg-amber-500/20 text-amber-500 border border-amber-500/40 rounded text-[10px] font-bold tracking-wider uppercase">
              & JSS
            </span>
            <span
              className={`font-semibold uppercase tracking-wider ${mottoSizeMap[size]} ${
                textColor === 'light' ? 'text-amber-400' : 'text-amber-700'
              }`}
            >
              "STRIVE TO ACHIEVE"
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
