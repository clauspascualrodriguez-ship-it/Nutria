import React, { useState } from 'react';
import {
  Home,
  Package,
  ShoppingCart,
  Calendar,
  ChefHat,
  TrendingUp,
  Settings,
  Sparkles,
  Globe,
  AlertTriangle,
} from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';
import { NutriaMascot } from './components/NutriaMascot';
import { HomeDashboard } from './components/dashboard/HomeDashboard';
import { PantryManager } from './components/pantry/PantryManager';
import { ShoppingList } from './components/shopping/ShoppingList';
import { WeeklyMealPlanner } from './components/mealplan/WeeklyMealPlanner';
import { RecipeCatalog } from './components/recipes/RecipeCatalog';
import { BudgetTracker } from './components/budget/BudgetTracker';
import { SettingsView } from './components/settings/SettingsView';
import { NutriaChatDrawer } from './components/chat/NutriaChatDrawer';
import { OnboardingWizard } from './components/onboarding/OnboardingWizard';
import { PWAInstallButton } from './components/pwa/PWAInstallButton';

function MainApp() {
  const {
    t,
    language,
    setLanguage,
    profile,
    activeTab,
    setActiveTab,
    expiringPantryItems,
    shoppingList,
  } = useApp();

  const isEs = language === 'es';
  const [showOnboarding, setShowOnboarding] = useState(!profile.hasCompletedOnboarding);
  const [recipeAIPreload, setRecipeAIPreload] = useState<string[]>([]);

  const uncheckedCount = shoppingList.filter((i) => !i.checked).length;
  const expiringCount = expiringPantryItems.length;

  const handleTriggerRecipeWithIngredients = (ingredients: string[]) => {
    setRecipeAIPreload(ingredients);
    setActiveTab('recipes');
  };

  const navItems = [
    { id: 'home', label: t.nav.home, icon: Home },
    {
      id: 'pantry',
      label: t.nav.pantry,
      icon: Package,
      badge: expiringCount > 0 ? expiringCount : null,
      badgeColor: 'bg-amber-600',
    },
    {
      id: 'shopping',
      label: t.nav.shopping,
      icon: ShoppingCart,
      badge: uncheckedCount > 0 ? uncheckedCount : null,
      badgeColor: 'bg-[#654735]',
    },
    { id: 'mealPlan', label: t.nav.mealPlan, icon: Calendar },
    { id: 'recipes', label: t.nav.recipes, icon: ChefHat },
    { id: 'budget', label: t.nav.budget, icon: TrendingUp },
    { id: 'settings', label: t.nav.settings, icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#FFF9F0] text-[#654735] flex flex-col font-['Nunito',sans-serif]">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-[#FFFEFC]/95 backdrop-blur-md border-b border-[#F2E8D9]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#654735] text-[#FFF9F0] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <NutriaMascot mood="waving" size="xs" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg text-[#654735] tracking-tight">
                  {t.appName}
                </span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-md bg-[#F4E3A5] text-[#654735]">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-[#9A765B] hidden sm:block truncate max-w-xs">
                {t.shortTagline}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#FFF9F0] p-1 rounded-2xl border border-[#E5D5C5]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all relative flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#654735] text-[#FFF9F0] shadow-2xs'
                      : 'text-[#9A765B] hover:text-[#654735] hover:bg-[#F2E8D9]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full text-white ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right: Install App Button, Language Selector & Saved Savings Badge */}
          <div className="flex items-center gap-2">
            {/* Install App Button */}
            <PWAInstallButton variant="compact" />

            {/* Money Saved pill */}
            <div
              title={isEs ? 'Ahorro conseguido evitando desperdicio' : 'Food waste prevented savings'}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#EAF2E8] border border-[#A8B89A] text-[#3D5A2B] text-xs font-extrabold"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#5F8747]" />
              <span>+{profile.totalMoneySaved.toFixed(2)} €</span>
            </div>

            {/* Language Switcher Button */}
            <div className="flex items-center p-1 bg-[#FFF9F0] rounded-xl border border-[#E5D5C5]">
              <button
                type="button"
                onClick={() => setLanguage('es')}
                className={`px-2 py-1 rounded-lg text-xs font-extrabold transition-colors ${
                  language === 'es'
                    ? 'bg-[#654735] text-[#FFF9F0]'
                    : 'text-[#9A765B] hover:text-[#654735]'
                }`}
              >
                ES
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded-lg text-xs font-extrabold transition-colors ${
                  language === 'en'
                    ? 'bg-[#654735] text-[#FFF9F0]'
                    : 'text-[#9A765B] hover:text-[#654735]'
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main App Body */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'home' && <HomeDashboard />}
        {activeTab === 'pantry' && (
          <PantryManager onTriggerRecipeWithIngredients={handleTriggerRecipeWithIngredients} />
        )}
        {activeTab === 'shopping' && <ShoppingList />}
        {activeTab === 'mealPlan' && <WeeklyMealPlanner />}
        {activeTab === 'recipes' && (
          <RecipeCatalog
            initialIngredientsForAI={recipeAIPreload}
            initialFilter={recipeAIPreload.length > 0 ? 'pantryMatch' : 'all'}
          />
        )}
        {activeTab === 'budget' && <BudgetTracker />}
        {activeTab === 'settings' && <SettingsView />}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <div className="lg:hidden sticky bottom-0 z-30 bg-[#FFFEFC]/95 backdrop-blur-md border-t border-[#F2E8D9] safe-area-bottom">
        <div className="grid grid-cols-6 h-16 items-center px-2">
          {navItems.slice(0, 6).map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center h-full transition-colors relative ${
                  isActive ? 'text-[#654735] font-extrabold' : 'text-[#9A765B]'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
                  {item.badge && (
                    <span
                      className={`absolute -top-1.5 -right-2 text-[9px] font-extrabold px-1 rounded-full text-white ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] mt-0.5 leading-none line-clamp-1">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Floating Nutria Chat Assistant */}
      <NutriaChatDrawer />

      {/* Onboarding Wizard (First time or reset) */}
      {showOnboarding && (
        <OnboardingWizard onComplete={() => setShowOnboarding(false)} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
