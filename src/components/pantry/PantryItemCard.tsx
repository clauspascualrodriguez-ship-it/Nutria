import React from 'react';
import {
  Clock,
  Sparkles,
  Plus,
  Minus,
  CheckCircle2,
  ShoppingCart,
  Edit2,
  Trash2,
  AlertTriangle,
  MessageCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PantryItem } from '../../types';

interface PantryItemCardProps {
  item: PantryItem;
  onEdit: (item: PantryItem) => void;
  onCookWithItem: (item: PantryItem) => void;
}

export const PantryItemCard: React.FC<PantryItemCardProps> = ({
  item,
  onEdit,
  onCookWithItem,
}) => {
  const {
    t,
    language,
    consumePantryItem,
    removePantryItem,
    updatePantryQuantity,
    addPantryItemToShopping,
    openChatWithIngredients,
  } = useApp();

  const isEs = language === 'es';

  // Calculate days until expiration
  const todayMs = new Date(new Date().toISOString().split('T')[0]).getTime();
  const expMs = new Date(item.expirationDate).getTime();
  const diffDays = Math.ceil((expMs - todayMs) / (1000 * 60 * 60 * 24));

  // Determine expiration status & badge style
  let badgeStyle = 'bg-[#EAF2E8] text-[#3D5A2B] border-[#A8B89A]';
  let badgeLabel = t.pantry.expiringBadge.fresh.replace('{days}', String(diffDays));
  let isUrgent = false;
  let isExpired = false;

  if (diffDays < 0) {
    isExpired = true;
    badgeStyle = 'bg-red-50 text-red-700 border-red-200';
    badgeLabel = t.pantry.expiringBadge.expired;
  } else if (diffDays === 0) {
    isUrgent = true;
    badgeStyle = 'bg-red-50 text-red-700 border-red-200 animate-pulse';
    badgeLabel = t.pantry.expiringBadge.today;
  } else if (diffDays === 1) {
    isUrgent = true;
    badgeStyle = 'bg-amber-50 text-amber-800 border-amber-300';
    badgeLabel = t.pantry.expiringBadge.tomorrow;
  } else if (diffDays <= 3) {
    isUrgent = true;
    badgeStyle = 'bg-amber-50 text-amber-800 border-amber-200';
    badgeLabel = t.pantry.expiringBadge.daysLeft.replace('{days}', String(diffDays));
  } else if (diffDays <= 7) {
    badgeStyle = 'bg-yellow-50 text-yellow-800 border-yellow-200';
    badgeLabel = t.pantry.expiringBadge.daysLeft.replace('{days}', String(diffDays));
  }

  const locationIcons: Record<string, string> = {
    fridge: '❄️',
    pantry: '🥫',
    freezer: '🧊',
  };

  return (
    <div
      className={`group relative rounded-2xl p-4 bg-[#FFFEFC] border transition-all duration-200 shadow-xs hover:shadow-md ${
        isUrgent
          ? 'border-amber-300 ring-2 ring-amber-100'
          : isExpired
          ? 'border-red-200 opacity-90'
          : 'border-[#F2E8D9] hover:border-[#9A765B]/40'
      }`}
    >
      {/* Top row: Category/Location & Expiration Badge */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#9A765B]">
          <span>{locationIcons[item.location] || '📦'}</span>
          <span>{item.category}</span>
          {item.brand && <span className="text-[#B59C88]">({item.brand})</span>}
        </span>

        <span
          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${badgeStyle}`}
        >
          {isUrgent ? (
            <AlertTriangle className="w-3 h-3 text-amber-600" />
          ) : (
            <Clock className="w-3 h-3" />
          )}
          {badgeLabel}
        </span>
      </div>

      {/* Main Info */}
      <div className="flex items-baseline justify-between gap-2 mb-3">
        <h3 className="text-base font-bold text-[#654735] leading-snug line-clamp-1">
          {item.name}
        </h3>
        <span className="text-xs font-semibold text-[#9A765B] shrink-0">
          {item.estimatedPrice ? `${item.estimatedPrice.toFixed(2)} €` : ''}
        </span>
      </div>

      {/* Quantity & Unit Stepper */}
      <div className="flex items-center justify-between py-1.5 px-3 rounded-xl bg-[#FFF9F0] border border-[#F2E8D9] mb-3">
        <span className="text-xs font-bold text-[#654735]">
          {item.quantity} {item.unit}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => updatePantryQuantity(item.id, -1)}
            title="Reducir"
            className="w-6 h-6 rounded-md bg-[#FFFEFC] border border-[#E5D5C5] text-[#654735] flex items-center justify-center hover:bg-[#F2E8D9] transition-colors"
          >
            <Minus className="w-3 h-3" />
          </button>
          <button
            type="button"
            onClick={() => updatePantryQuantity(item.id, 1)}
            title="Aumentar"
            className="w-6 h-6 rounded-md bg-[#FFFEFC] border border-[#E5D5C5] text-[#654735] flex items-center justify-center hover:bg-[#F2E8D9] transition-colors"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-between gap-1 pt-1 border-t border-[#F2E8D9]/70">
        <div className="flex items-center gap-1">
          {/* Ask Nutria in Chat if expiring soon */}
          {isUrgent && (
            <button
              type="button"
              onClick={() => openChatWithIngredients([item.name])}
              title={t.pantry.askChatSingleBtn}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#654735] hover:bg-[#533726] text-[#FFF9F0] font-bold text-xs transition-colors shadow-2xs"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#F4E3A5]" />
              <span className="hidden sm:inline">{t.pantry.askChatSingleBtn}</span>
              <span className="sm:hidden">{isEs ? 'Chat' : 'Chat'}</span>
            </button>
          )}

          {/* Cook with this (Anti-waste) */}
          <button
            type="button"
            onClick={() => onCookWithItem(item)}
            title={t.pantry.actions.cookWithThis}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#F4E3A5]/60 hover:bg-[#F4E3A5] text-[#654735] font-bold text-xs transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#8C6D1F]" />
            <span className="hidden sm:inline">{t.pantry.actions.cookWithThis}</span>
            <span className="sm:hidden">{isEs ? 'Cocinar' : 'Cook'}</span>
          </button>

          {/* Mark as Consumed / Rescued */}
          <button
            type="button"
            onClick={() => consumePantryItem(item.id)}
            title={t.pantry.actions.markConsumed}
            className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg bg-[#EAF2E8] hover:bg-[#D5E6D1] text-[#3D5A2B] font-bold text-xs transition-colors"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-[#5F8747]" />
            <span className="hidden sm:inline">{isEs ? 'Consumir' : 'Consumed'}</span>
          </button>
        </div>

        <div className="flex items-center gap-1">
          {/* Add to shopping list */}
          <button
            type="button"
            onClick={() => addPantryItemToShopping(item)}
            title={t.pantry.actions.addToList}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9A765B] hover:text-[#654735] hover:bg-[#F2E8D9] transition-colors"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
          </button>

          {/* Edit */}
          <button
            type="button"
            onClick={() => onEdit(item)}
            title={t.pantry.actions.edit}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9A765B] hover:text-[#654735] hover:bg-[#F2E8D9] transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          {/* Delete */}
          <button
            type="button"
            onClick={() => removePantryItem(item.id)}
            title={t.pantry.actions.delete}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9A765B] hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
