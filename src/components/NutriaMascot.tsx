import React from 'react';
import { MascotMood } from '../types';

interface NutriaMascotProps {
  mood?: MascotMood;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'cart' | 'portrait';
  speechBubble?: string;
  speechBubblePosition?: 'top' | 'right' | 'bottom';
  className?: string;
  onBubbleClick?: () => void;
  interactive?: boolean;
}

export const NutriaMascot: React.FC<NutriaMascotProps> = ({
  mood = 'waving',
  size = 'md',
  variant = 'cart',
  speechBubble,
  speechBubblePosition = 'top',
  className = '',
  onBubbleClick,
  interactive = false,
}) => {
  const sizeMap = {
    xs: 'w-10 h-10',
    sm: 'w-16 h-16',
    md: 'w-28 h-28',
    lg: 'w-44 h-44',
    xl: 'w-60 h-60',
  };

  const bubbleTextSize = {
    xs: 'text-xs py-1 px-2.5 max-w-[160px]',
    sm: 'text-xs py-1.5 px-3 max-w-[200px]',
    md: 'text-sm py-2 px-3.5 max-w-[280px]',
    lg: 'text-base py-2.5 px-4 max-w-[340px]',
    xl: 'text-base py-3 px-5 max-w-[380px]',
  };

  const moodBadges: Record<string, string | null> = {
    chef: '👨‍🍳',
    thinking: '💡',
    celebrating: '✨',
    shopping: '🛒',
    warning: '⚠️',
    sleeping: '💤',
    waving: '👋',
    pointing: '👉',
  };

  const imageSrc = variant === 'portrait' ? '/assets/nutria-portrait.jpg' : '/assets/nutria-cart.jpg';

  return (
    <div className={`relative inline-flex flex-col items-center select-none ${className}`}>
      {/* Speech bubble if on top */}
      {speechBubble && speechBubblePosition === 'top' && (
        <div
          onClick={onBubbleClick}
          className={`mb-2 bg-[#FFFEFC] text-[#654735] font-semibold border-2 border-[#E5D5C5] rounded-2xl shadow-sm relative transition-all duration-200 ${
            interactive ? 'cursor-pointer hover:border-[#654735] hover:shadow-md' : ''
          } ${bubbleTextSize[size]}`}
        >
          <p className="leading-tight">{speechBubble}</p>
          {/* Bubble tail pointing down */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[8px] border-t-[#FFFEFC]"></div>
          <div className="absolute -bottom-[9px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[9px] border-t-[#E5D5C5] -z-10"></div>
        </div>
      )}

      {/* Mascot Image Container */}
      <div
        className={`relative ${sizeMap[size]} transition-transform duration-300 ${
          interactive ? 'hover:scale-105 active:scale-95' : ''
        }`}
      >
        {size === 'xs' ? (
          // Circular avatar for small icons (header, chat messages)
          <div className="w-full h-full rounded-full overflow-hidden border-2 border-[#E5D5C5] shadow-xs bg-[#FFF9F0]">
            <img
              src="/assets/nutria-cart.jpg"
              alt="Nutria Mascot"
              className="w-full h-full object-cover object-[55%_18%] scale-150"
            />
          </div>
        ) : (
          // Full illustration for cards, dashboard, onboarding
          <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xs bg-[#FFF9F0] border border-[#F2E8D9]/70 flex items-center justify-center p-0.5">
            <img
              src={imageSrc}
              alt="Nutria Mascot con carrito de la compra"
              className="w-full h-full object-contain"
            />
          </div>
        )}

        {/* Small Mood Indicator Badge */}
        {moodBadges[mood] && size !== 'xs' && (
          <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#FFFEFC] border border-[#E5D5C5] shadow-xs flex items-center justify-center text-xs">
            {moodBadges[mood]}
          </span>
        )}
      </div>

      {/* Speech bubble if on bottom */}
      {speechBubble && speechBubblePosition === 'bottom' && (
        <div
          onClick={onBubbleClick}
          className={`mt-2 bg-[#FFFEFC] text-[#654735] font-semibold border-2 border-[#E5D5C5] rounded-2xl shadow-sm relative transition-all duration-200 ${
            interactive ? 'cursor-pointer hover:border-[#654735] hover:shadow-md' : ''
          } ${bubbleTextSize[size]}`}
        >
          {/* Bubble tail pointing up */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-b-[8px] border-b-[#FFFEFC]"></div>
          <div className="absolute -top-[9px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[9px] border-b-[#E5D5C5] -z-10"></div>
          <p className="leading-tight">{speechBubble}</p>
        </div>
      )}
    </div>
  );
};
