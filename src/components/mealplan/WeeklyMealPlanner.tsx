import React, { useState } from 'react';
import {
  Sparkles,
  ShoppingCart,
  Calendar,
  ChefHat,
  Plus,
  Trash2,
  CheckCircle2,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Recipe } from '../../types';

export const WeeklyMealPlanner: React.FC = () => {
  const {
    t,
    language,
    mealPlan,
    recipes,
    setMealSlot,
    autoFillMealPlan,
    generateShoppingFromPlan,
    setActiveTab,
  } = useApp();

  const isEs = language === 'es';

  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assigningSlot, setAssigningSlot] = useState<'lunch' | 'dinner'>('lunch');
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const days = isEs
    ? ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
    : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleOpenAssign = (dayIdx: number, slot: 'lunch' | 'dinner') => {
    setActiveDayIndex(dayIdx);
    setAssigningSlot(slot);
    setIsAssignModalOpen(true);
  };

  const handleSelectRecipe = (recipe: Recipe) => {
    setMealSlot(activeDayIndex, assigningSlot, recipe);
    setIsAssignModalOpen(false);
  };

  const handleAutoFill = () => {
    autoFillMealPlan();
    setSuccessNotice(
      isEs
        ? '¡Menú semanal optimizado con Nutria! Prioriza ingredientes de tu nevera.'
        : 'Weekly menu generated with Nutria, prioritizing your fridge ingredients!'
    );
    setTimeout(() => setSuccessNotice(null), 3000);
  };

  const handleGenerateShopping = () => {
    const count = generateShoppingFromPlan();
    setSuccessNotice(
      isEs
        ? `¡${count} ingredientes necesarios añadidos a tu lista de la compra!`
        : `Added ${count} missing ingredients to your grocery list!`
    );
    setTimeout(() => setSuccessNotice(null), 3000);
  };

  // Calculate total weekly meal plan cost
  const totalPlanCost = mealPlan.reduce((sum, d) => {
    return sum + (d.lunch?.costEstimate || 0) + (d.dinner?.costEstimate || 0);
  }, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#654735] tracking-tight">
            {t.mealPlan.title}
          </h1>
          <p className="text-xs sm:text-sm text-[#9A765B] mt-1">
            {t.mealPlan.subtitle}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAutoFill}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-[#654735] text-[#FFF9F0] font-bold text-xs hover:bg-[#533726] shadow-md transition-all active:scale-98"
          >
            <Sparkles className="w-4 h-4 text-[#F4E3A5]" />
            <span>{t.mealPlan.autoFillBtn}</span>
          </button>

          <button
            type="button"
            onClick={handleGenerateShopping}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-[#FFF9F0] border border-[#E5D5C5] text-[#654735] font-bold text-xs hover:bg-[#F2E8D9] transition-all shadow-2xs active:scale-98"
          >
            <ShoppingCart className="w-4 h-4 text-[#654735]" />
            <span className="hidden sm:inline">{t.mealPlan.addIngredientsToListBtn}</span>
            <span className="sm:hidden">{isEs ? 'A la lista' : 'To list'}</span>
          </button>
        </div>
      </div>

      {/* Success banner */}
      {successNotice && (
        <div className="p-3.5 bg-[#EAF2E8] border border-[#A8B89A] text-[#3D5A2B] rounded-2xl flex items-center justify-between gap-2 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#5F8747] shrink-0" />
            <p className="text-xs font-bold">{successNotice}</p>
          </div>
          <button
            onClick={() => setActiveTab('shopping')}
            className="text-xs font-extrabold underline text-[#3D5A2B] shrink-0"
          >
            {isEs ? 'Ver lista' : 'View list'}
          </button>
        </div>
      )}

      {/* Weekly Cost Summary */}
      <div className="p-4 rounded-3xl bg-[#FFF9F0] border border-[#F2E8D9] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#654735] text-[#FFF9F0] flex items-center justify-center">
            <ChefHat className="w-5 h-5 text-[#A8B89A]" />
          </div>
          <div>
            <p className="text-xs text-[#9A765B] font-semibold">
              {isEs ? 'Coste estimado del menú semanal' : 'Estimated weekly menu cost'}
            </p>
            <p className="text-lg font-extrabold text-[#654735]">
              ~{totalPlanCost.toFixed(2)} €{' '}
              <span className="text-xs font-normal text-[#9A765B]">
                (~{(totalPlanCost / 7).toFixed(2)} € / día)
              </span>
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('recipes')}
          className="text-xs font-bold text-[#654735] hover:underline flex items-center gap-1"
        >
          <span>{isEs ? 'Explorar recetas' : 'Explore recipes'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Day Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
        {mealPlan.map((day) => {
          const dayCost = (day.lunch?.costEstimate || 0) + (day.dinner?.costEstimate || 0);

          return (
            <div
              key={day.dayIndex}
              className="rounded-3xl p-4 bg-[#FFFEFC] border border-[#F2E8D9] shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Day Header */}
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#F2E8D9]">
                  <span className="text-sm font-extrabold text-[#654735]">
                    {days[day.dayIndex]}
                  </span>
                  <span className="text-[11px] font-bold text-[#9A765B]">
                    ~{dayCost.toFixed(2)} €
                  </span>
                </div>

                {/* Lunch Slot */}
                <div className="space-y-1 mb-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#9A765B] block">
                    ☀️ {t.mealPlan.meals.lunch}
                  </span>
                  {day.lunch?.customTitle ? (
                    <div className="p-2.5 rounded-xl bg-[#FFF9F0] border border-[#E5D5C5] flex items-center justify-between text-xs">
                      <span className="font-bold text-[#654735] line-clamp-1">
                        {day.lunch.customTitle}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleOpenAssign(day.dayIndex, 'lunch')}
                        className="text-[10px] text-[#9A765B] hover:text-[#654735] font-semibold shrink-0 ml-1"
                      >
                        {isEs ? 'Cambiar' : 'Change'}
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleOpenAssign(day.dayIndex, 'lunch')}
                      className="w-full py-2.5 px-3 rounded-xl border border-dashed border-[#D5C5B5] text-[#9A765B] hover:border-[#654735] hover:text-[#654735] text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{t.dashboard.planMealBtn}</span>
                    </button>
                  )}
                </div>

                {/* Dinner Slot */}
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#9A765B] block">
                    🌙 {t.mealPlan.meals.dinner}
                  </span>
                  {day.dinner?.customTitle ? (
                    <div className="p-2.5 rounded-xl bg-[#FFF9F0] border border-[#E5D5C5] flex items-center justify-between text-xs">
                      <span className="font-bold text-[#654735] line-clamp-1">
                        {day.dinner.customTitle}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleOpenAssign(day.dayIndex, 'dinner')}
                        className="text-[10px] text-[#9A765B] hover:text-[#654735] font-semibold shrink-0 ml-1"
                      >
                        {isEs ? 'Cambiar' : 'Change'}
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleOpenAssign(day.dayIndex, 'dinner')}
                      className="w-full py-2.5 px-3 rounded-xl border border-dashed border-[#D5C5B5] text-[#9A765B] hover:border-[#654735] hover:text-[#654735] text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{t.dashboard.planMealBtn}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Assign Recipe Modal */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[#FFFEFC] w-full max-w-lg rounded-3xl shadow-2xl border border-[#F2E8D9] overflow-hidden flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between p-4 px-6 border-b border-[#F2E8D9] bg-[#FFF9F0]">
              <h3 className="text-base font-bold text-[#654735]">
                {days[activeDayIndex]} - {assigningSlot === 'lunch' ? t.mealPlan.meals.lunch : t.mealPlan.meals.dinner}
              </h3>
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[#9A765B] hover:bg-[#F2E8D9]"
              >
                ✕
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-2">
              {recipes.map((r) => (
                <div
                  key={r.id}
                  onClick={() => handleSelectRecipe(r)}
                  className="p-3 rounded-2xl border border-[#F2E8D9] hover:border-[#654735] bg-[#FFF9F0]/40 hover:bg-[#FFF9F0] cursor-pointer transition-all flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-xs font-bold text-[#654735]">
                      {isEs ? r.title : r.titleEn || r.title}
                    </h4>
                    <span className="text-[11px] text-[#9A765B]">
                      {r.prepTimeMinutes} min • {r.costPerServing.toFixed(2)} €/ración
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#3D5A2B] bg-[#EAF2E8] px-2 py-1 rounded-lg">
                    {t.mealPlan.selectRecipe}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
