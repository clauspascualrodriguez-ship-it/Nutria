import React from 'react';
import {
  Calendar,
  Sparkles,
  ShoppingCart,
  ChefHat,
  Package,
  TrendingUp,
  ArrowRight,
  MessageCircle,
  Plus,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NutriaMascot } from '../NutriaMascot';
import { ExpiringSoonBanner } from '../pantry/ExpiringSoonBanner';
import { PWAInstallButton } from '../pwa/PWAInstallButton';

export const HomeDashboard: React.FC = () => {
  const {
    t,
    language,
    profile,
    budgetMetrics,
    expiringPantryItems,
    shoppingList,
    mealPlan,
    setActiveTab,
    setIsChatOpen,
    mascotMood,
    mascotMessage,
  } = useApp();

  const isEs = language === 'es';

  // Greeting by time of day
  const hour = new Date().getHours();
  let greeting = t.mascot.greetingMorning;
  if (hour >= 13 && hour < 20) {
    greeting = t.mascot.greetingAfternoon;
  } else if (hour >= 20 || hour < 6) {
    greeting = t.mascot.greetingEvening;
  }

  // Today's meal plan (day 0)
  const todayMeals = mealPlan[0] || {};
  const uncheckedShopping = shoppingList.filter((i) => !i.checked);

  return (
    <div className="space-y-6 pb-12">
      {/* Mascot Hero Greeting Card */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#FFF9F0] via-[#FFFEFC] to-[#F2E8D9] border border-[#F2E8D9] p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5">
          <div className="text-center sm:text-left space-y-1.5 flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#9A765B] bg-[#FFF9F0] px-3 py-1 rounded-full border border-[#E5D5C5]">
                🦦 {t.appName}
              </span>
              <PWAInstallButton variant="compact" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#654735] tracking-tight">
              {greeting}
            </h1>
            <p className="text-xs sm:text-sm text-[#9A765B] font-medium leading-relaxed max-w-lg">
              {mascotMessage}
            </p>
          </div>

          <NutriaMascot
            mood={mascotMood}
            size="md"
            className="shrink-0"
            interactive
            onBubbleClick={() => setIsChatOpen(true)}
          />
        </div>
      </div>

      {/* Expiring Soon Banner (If any) */}
      <ExpiringSoonBanner onCookClick={() => setActiveTab('recipes')} />

      {/* Main Budget Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#FFFEFC] border border-[#F2E8D9] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#9A765B]">
              {t.dashboard.budgetTitle}
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#654735]">
                {budgetMetrics.remaining.toFixed(2)} €
              </span>
              <span className="text-xs font-semibold text-[#9A765B]">
                {t.dashboard.remaining} ({budgetMetrics.total} € meta)
              </span>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('budget')}
            className="text-xs font-bold text-[#654735] hover:underline flex items-center gap-1"
          >
            <span>{t.dashboard.viewAll}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-[#654735]">
              {t.dashboard.spent}: {budgetMetrics.spent.toFixed(2)} € ({budgetMetrics.percentageUsed}%)
            </span>
            <span
              className={budgetMetrics.isPaceSafe ? 'text-[#3D5A2B]' : 'text-amber-700'}
            >
              {budgetMetrics.isPaceSafe
                ? t.dashboard.dailyPaceSafe.replace('{daily}', String(budgetMetrics.averageDailySpend))
                : t.dashboard.dailyPaceHigh.replace('{daily}', String(budgetMetrics.averageDailySpend))}
            </span>
          </div>

          <div className="w-full h-3 bg-[#F2E8D9] rounded-full overflow-hidden p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                budgetMetrics.percentageUsed > 85 ? 'bg-amber-600' : 'bg-[#6C8B56]'
              }`}
              style={{ width: `${Math.min(100, budgetMetrics.percentageUsed)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-[#9A765B] block px-1">
          {t.dashboard.quickActions}
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          <button
            type="button"
            onClick={() => setActiveTab('pantry')}
            className="p-3.5 rounded-2xl bg-[#FFFEFC] border border-[#F2E8D9] hover:border-[#654735] hover:bg-[#FFF9F0] transition-all flex items-center gap-3 text-left shadow-2xs group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#FFF9F0] text-[#654735] group-hover:bg-[#654735] group-hover:text-[#FFF9F0] transition-colors flex items-center justify-center shrink-0">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#654735] block">
                {t.nav.pantry}
              </span>
              <span className="text-[11px] text-[#9A765B]">
                {expiringPantryItems.length > 0
                  ? `⚠️ ${expiringPantryItems.length} urgentes`
                  : 'Inventario'}
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('shopping')}
            className="p-3.5 rounded-2xl bg-[#FFFEFC] border border-[#F2E8D9] hover:border-[#654735] hover:bg-[#FFF9F0] transition-all flex items-center gap-3 text-left shadow-2xs group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#FFF9F0] text-[#654735] group-hover:bg-[#654735] group-hover:text-[#FFF9F0] transition-colors flex items-center justify-center shrink-0">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#654735] block">
                {t.nav.shopping}
              </span>
              <span className="text-[11px] text-[#9A765B]">
                {uncheckedShopping.length} pendientes
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('mealPlan')}
            className="p-3.5 rounded-2xl bg-[#FFFEFC] border border-[#F2E8D9] hover:border-[#654735] hover:bg-[#FFF9F0] transition-all flex items-center gap-3 text-left shadow-2xs group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#FFF9F0] text-[#654735] group-hover:bg-[#654735] group-hover:text-[#FFF9F0] transition-colors flex items-center justify-center shrink-0">
              <ChefHat className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#654735] block">
                {t.nav.mealPlan}
              </span>
              <span className="text-[11px] text-[#9A765B]">7 días</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('recipes')}
            className="p-3.5 rounded-2xl bg-[#FFFEFC] border border-[#F2E8D9] hover:border-[#654735] hover:bg-[#FFF9F0] transition-all flex items-center gap-3 text-left shadow-2xs group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#FFF9F0] text-[#654735] group-hover:bg-[#654735] group-hover:text-[#FFF9F0] transition-colors flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-[#8C6D1F]" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#654735] block">
                {t.nav.recipes}
              </span>
              <span className="text-[11px] text-[#9A765B]">Económicas</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('budget')}
            className="p-3.5 rounded-2xl bg-[#FFFEFC] border border-[#F2E8D9] hover:border-[#654735] hover:bg-[#FFF9F0] transition-all flex items-center gap-3 text-left shadow-2xs group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#FFF9F0] text-[#654735] group-hover:bg-[#654735] group-hover:text-[#FFF9F0] transition-colors flex items-center justify-center shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#654735] block">
                {t.nav.budget}
              </span>
              <span className="text-[11px] text-[#9A765B]">Gastos súper</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setIsChatOpen(true)}
            className="p-3.5 rounded-2xl bg-[#F4E3A5]/40 border border-[#F4E3A5] hover:bg-[#F4E3A5] transition-all flex items-center gap-3 text-left shadow-2xs group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#654735] text-[#FFF9F0] flex items-center justify-center shrink-0">
              <MessageCircle className="w-4 h-4 text-[#F4E3A5]" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#654735] block">
                {t.dashboard.openAssistant}
              </span>
              <span className="text-[11px] text-[#8C6D1F]">Pregúntale a Nutria</span>
            </div>
          </button>
        </div>
      </div>

      {/* Two Column Section: Today's Meals & Quick Shopping List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Today's Meals */}
        <div className="p-5 rounded-3xl bg-[#FFFEFC] border border-[#F2E8D9] shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#9A765B] flex items-center gap-1.5">
              <ChefHat className="w-4 h-4" />
              <span>{t.dashboard.todayMeals}</span>
            </h3>
            <button
              onClick={() => setActiveTab('mealPlan')}
              className="text-xs font-bold text-[#654735] hover:underline"
            >
              {isEs ? 'Ver semana' : 'View week'}
            </button>
          </div>

          <div className="space-y-2">
            <div className="p-3 rounded-2xl bg-[#FFF9F0] border border-[#F2E8D9] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#9A765B] block uppercase">
                  ☀️ {t.mealPlan.meals.lunch}
                </span>
                <span className="text-xs font-bold text-[#654735]">
                  {todayMeals.lunch?.customTitle || t.dashboard.noMealPlanned}
                </span>
              </div>
              <span className="text-xs font-extrabold text-[#3D5A2B]">
                {todayMeals.lunch?.costEstimate ? `~${todayMeals.lunch.costEstimate.toFixed(2)} €` : ''}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-[#FFF9F0] border border-[#F2E8D9] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#9A765B] block uppercase">
                  🌙 {t.mealPlan.meals.dinner}
                </span>
                <span className="text-xs font-bold text-[#654735]">
                  {todayMeals.dinner?.customTitle || t.dashboard.noMealPlanned}
                </span>
              </div>
              <span className="text-xs font-extrabold text-[#3D5A2B]">
                {todayMeals.dinner?.costEstimate ? `~${todayMeals.dinner.costEstimate.toFixed(2)} €` : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Shopping Snippet */}
        <div className="p-5 rounded-3xl bg-[#FFFEFC] border border-[#F2E8D9] shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#9A765B] flex items-center gap-1.5">
              <ShoppingCart className="w-4 h-4" />
              <span>{t.dashboard.shoppingSnippetTitle}</span>
            </h3>
            <button
              onClick={() => setActiveTab('shopping')}
              className="text-xs font-bold text-[#654735] hover:underline"
            >
              {t.dashboard.viewAll}
            </button>
          </div>

          <div className="space-y-1.5">
            {uncheckedShopping.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="p-2.5 rounded-xl bg-[#FFF9F0] border border-[#F2E8D9] flex items-center justify-between text-xs"
              >
                <span className="font-semibold text-[#654735]">{item.name}</span>
                <span className="text-xs font-bold text-[#9A765B]">
                  ~{item.estimatedPrice.toFixed(2)} €
                </span>
              </div>
            ))}

            {uncheckedShopping.length === 0 && (
              <div className="py-4 text-center text-xs text-[#9A765B]">
                {isEs ? '¡Lista al día sin compras pendientes!' : 'All items checked!'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
