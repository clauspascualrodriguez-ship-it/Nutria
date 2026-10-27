import React from 'react';
import { AlertTriangle, Sparkles, MessageCircle, ArrowRight, Clock, ChefHat } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NutriaMascot } from '../NutriaMascot';

interface ExpiringSoonBannerProps {
  onCookClick: () => void;
}

export const ExpiringSoonBanner: React.FC<ExpiringSoonBannerProps> = ({ onCookClick }) => {
  const { t, expiringPantryItems, language, openChatWithIngredients } = useApp();
  const isEs = language === 'es';

  if (expiringPantryItems.length === 0) return null;

  const todayMs = new Date(new Date().toISOString().split('T')[0]).getTime();

  // Calculate items and remaining days
  const itemsWithDays = expiringPantryItems.map((item) => {
    const itemMs = new Date(item.expirationDate).getTime();
    const diffDays = Math.ceil((itemMs - todayMs) / (1000 * 60 * 60 * 24));
    return {
      ...item,
      diffDays,
    };
  });

  // Calculate total money at risk
  const valueAtRisk = expiringPantryItems.reduce((acc, item) => acc + (item.estimatedPrice || 1.5), 0);

  const handleAskChatAll = () => {
    const names = expiringPantryItems.map((i) => i.name);
    openChatWithIngredients(names);
  };

  const handleAskChatSingle = (name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    openChatWithIngredients([name]);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-[#FFF5EA] via-[#FFF9F0] to-[#FDF4E3] border-2 border-amber-300 p-4 sm:p-5 shadow-sm space-y-4">
      {/* Top row: Badge, Mascot, Value at Risk */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <NutriaMascot mood="chef" size="xs" className="shrink-0" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full animate-ping"></span>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-amber-900 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-full shadow-2xs">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                {t.pantry.expiringNotificationTitle}
              </span>
              <span className="text-xs font-bold text-[#654735]">
                ({expiringPantryItems.length} {isEs ? 'artículos' : 'items'})
              </span>
            </div>

            <p className="text-xs text-[#9A765B] mt-0.5">
              {t.pantry.expiringNotificationSub}
            </p>
          </div>
        </div>

        {/* Value at risk counter */}
        <div className="px-3 py-1.5 rounded-xl bg-[#FFFEFC] border border-amber-200 text-right shrink-0">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#9A765B] block">
            {t.pantry.stats.valueAtRisk}
          </span>
          <span className="text-sm font-extrabold text-amber-800">
            ~{valueAtRisk.toFixed(2)} €
          </span>
        </div>
      </div>

      {/* Item Chips with specific expiration countdown */}
      <div className="flex flex-wrap gap-2 pt-1">
        {itemsWithDays.map((item) => {
          let dayBadge = '';
          let badgeColor = 'bg-amber-100 text-amber-900 border-amber-300';

          if (item.diffDays <= 0) {
            dayBadge = isEs ? '¡Hoy!' : 'Today!';
            badgeColor = 'bg-red-100 text-red-800 border-red-300 animate-pulse';
          } else if (item.diffDays === 1) {
            dayBadge = isEs ? 'Mañana' : 'Tomorrow';
            badgeColor = 'bg-amber-200 text-amber-900 border-amber-400';
          } else {
            dayBadge = isEs ? `${item.diffDays} días` : `${item.diffDays} days`;
          }

          return (
            <div
              key={item.id}
              onClick={() => openChatWithIngredients([item.name])}
              title={isEs ? 'Pedir receta con este ingrediente a Nutria en chat' : 'Ask Nutria for a recipe with this in chat'}
              className="cursor-pointer group inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FFFEFC] border border-amber-200 hover:border-[#654735] hover:bg-[#FFF9F0] transition-all shadow-2xs text-xs font-bold text-[#654735]"
            >
              <span>{item.name}</span>
              <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-md border ${badgeColor}`}>
                {dayBadge}
              </span>
              <button
                type="button"
                onClick={(e) => handleAskChatSingle(item.name, e)}
                className="text-[#9A765B] group-hover:text-[#654735] ml-0.5"
              >
                <MessageCircle className="w-3.5 h-3.5 text-amber-700" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Action Buttons: Chat Assistant or Recipe Generator */}
      <div className="pt-2 flex flex-col sm:flex-row items-center gap-2 border-t border-amber-200/80">
        {/* Primary Action: Suggest Recipes via AI Chat Assistant */}
        <button
          type="button"
          onClick={handleAskChatAll}
          className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-[#654735] text-[#FFF9F0] font-bold text-xs sm:text-sm shadow-md hover:bg-[#533726] active:scale-98 transition-all"
        >
          <MessageCircle className="w-4 h-4 text-[#F4E3A5]" />
          <span>{t.pantry.askChatForRecipeBtn}</span>
        </button>

        {/* Secondary Action: AI Recipe Generator Modal */}
        <button
          type="button"
          onClick={onCookClick}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-[#FFFEFC] border border-[#E5D5C5] text-[#654735] font-bold text-xs sm:text-sm hover:bg-[#FFF9F0] transition-all"
        >
          <Sparkles className="w-4 h-4 text-[#8C6D1F]" />
          <span>{t.dashboard.cookExpiringBtn}</span>
          <ArrowRight className="w-3.5 h-3.5 opacity-70" />
        </button>
      </div>
    </div>
  );
};
