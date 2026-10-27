import React, { useState } from 'react';
import { Sparkles, Users, Euro, Store, Heart, CheckCircle2, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NutriaMascot } from '../NutriaMascot';
import { Language } from '../../types';

interface OnboardingWizardProps {
  onComplete: () => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete }) => {
  const { t, language, setLanguage, updateProfile } = useApp();
  const isEs = language === 'es';

  const [step, setStep] = useState(1);
  const [householdSize, setHouseholdSize] = useState(2);
  const [budgetTarget, setBudgetTarget] = useState(220);
  const [budgetFreq, setBudgetFreq] = useState<'weekly' | 'monthly'>('monthly');
  const [selectedSupermarkets, setSelectedSupermarkets] = useState<string[]>(['Mercadona', 'Lidl']);
  const [selectedDiets, setSelectedDiets] = useState<string[]>(['Mediterránea', 'Económica']);
  const [mainGoal, setMainGoal] = useState('Ahorrar dinero y no tirar comida');

  const supermarketsList = ['Mercadona', 'Lidl', 'Carrefour', 'Dia', 'Alcampo', 'Eroski', 'Consum'];
  const dietsList = isEs
    ? ['Mediterránea', 'Económica', 'Vegetariana', 'Baja en carbohidratos', 'Sin lactosa', 'Sin gluten']
    : ['Mediterranean', 'Budget-friendly', 'Vegetarian', 'Low carb', 'Lactose-free', 'Gluten-free'];

  const goalsList = isEs
    ? [
        'Ahorrar dinero en la compra semanal',
        'No tirar comida ni dejar que caduquen alimentos',
        'Comer más variado sin gastar de más',
        'Ahorrar tiempo planificando menús',
      ]
    : [
        'Save money on weekly groceries',
        'Reduce food waste and prevent spoilage',
        'Eat a wider variety of affordable meals',
        'Save time planning and shopping',
      ];

  const toggleSupermarket = (s: string) => {
    setSelectedSupermarkets((prev) =>
      prev.includes(s) ? prev.filter((item) => item !== s) : [...prev, s]
    );
  };

  const toggleDiet = (d: string) => {
    setSelectedDiets((prev) =>
      prev.includes(d) ? prev.filter((item) => item !== d) : [...prev, d]
    );
  };

  const handleFinish = () => {
    updateProfile({
      householdSize,
      budgetTarget,
      budgetFrequency: budgetFreq,
      supermarkets: selectedSupermarkets,
      dietaryPreferences: selectedDiets,
      mainGoal,
      hasCompletedOnboarding: true,
    });
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#FFF9F0] overflow-y-auto">
      <div className="bg-[#FFFEFC] w-full max-w-lg rounded-3xl shadow-xl border border-[#F2E8D9] p-6 sm:p-8 space-y-6">
        {/* Step Indicator & Language Switcher */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <span
                key={i}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  step === i ? 'w-6 bg-[#654735]' : step > i ? 'bg-[#A8B89A]' : 'bg-[#E5D5C5]'
                }`}
              />
            ))}
          </div>

          {/* Quick Language Toggle on Welcome */}
          <div className="flex items-center gap-1 p-1 bg-[#FFF9F0] rounded-xl border border-[#E5D5C5]">
            <button
              type="button"
              onClick={() => setLanguage('es')}
              className={`px-2 py-0.5 text-xs font-bold rounded-lg ${
                language === 'es' ? 'bg-[#654735] text-[#FFF9F0]' : 'text-[#9A765B]'
              }`}
            >
              🇪🇸 ES
            </button>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2 py-0.5 text-xs font-bold rounded-lg ${
                language === 'en' ? 'bg-[#654735] text-[#FFF9F0]' : 'text-[#9A765B]'
              }`}
            >
              🇬🇧 EN
            </button>
          </div>
        </div>

        {/* Step 1: Welcome & Household */}
        {step === 1 && (
          <div className="text-center space-y-4 animate-in fade-in">
            <NutriaMascot mood="waving" size="lg" className="mx-auto animate-float" />
            <h2 className="text-2xl font-extrabold text-[#654735]">
              {t.onboarding.welcomeTitle}
            </h2>
            <p className="text-xs sm:text-sm text-[#9A765B] max-w-sm mx-auto">
              {t.onboarding.welcomeSub}
            </p>

            <div className="pt-4 space-y-2 text-left">
              <label className="text-xs font-bold text-[#654735] block text-center">
                {t.onboarding.step1Sub}
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setHouseholdSize(n)}
                    className={`py-3 rounded-2xl border text-sm font-extrabold transition-all ${
                      householdSize === n
                        ? 'bg-[#654735] text-[#FFF9F0] border-[#654735] shadow-xs'
                        : 'bg-[#FFF9F0] text-[#654735] border-[#E5D5C5] hover:bg-[#F2E8D9]'
                    }`}
                  >
                    {n === 4 ? '4+' : n} {n === 1 ? 'pers.' : 'pers.'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Budget */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="text-center">
              <NutriaMascot mood="thinking" size="md" className="mx-auto" />
              <h2 className="text-xl font-extrabold text-[#654735] mt-2">
                {t.onboarding.step2}
              </h2>
              <p className="text-xs text-[#9A765B]">{t.onboarding.step2Sub}</p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setBudgetFreq('weekly');
                    setBudgetTarget(60);
                  }}
                  className={`py-2.5 rounded-xl border text-xs font-bold transition-all ${
                    budgetFreq === 'weekly'
                      ? 'bg-[#654735] text-[#FFF9F0] border-[#654735]'
                      : 'border-[#E5D5C5] text-[#9A765B]'
                  }`}
                >
                  {t.onboarding.step2Weekly}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBudgetFreq('monthly');
                    setBudgetTarget(240);
                  }}
                  className={`py-2.5 rounded-xl border text-xs font-bold transition-all ${
                    budgetFreq === 'monthly'
                      ? 'bg-[#654735] text-[#FFF9F0] border-[#654735]'
                      : 'border-[#E5D5C5] text-[#9A765B]'
                  }`}
                >
                  {t.onboarding.step2Monthly}
                </button>
              </div>

              <div className="text-center p-4 bg-[#FFF9F0] rounded-2xl border border-[#E5D5C5]">
                <span className="text-3xl font-extrabold text-[#654735]">
                  {budgetTarget} €
                </span>
                <input
                  type="range"
                  min={budgetFreq === 'weekly' ? 20 : 100}
                  max={budgetFreq === 'weekly' ? 200 : 800}
                  step={budgetFreq === 'weekly' ? 5 : 20}
                  value={budgetTarget}
                  onChange={(e) => setBudgetTarget(Number(e.target.value))}
                  className="w-full mt-3 accent-[#654735]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Supermarkets */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="text-center">
              <NutriaMascot mood="shopping" size="md" className="mx-auto" />
              <h2 className="text-xl font-extrabold text-[#654735] mt-2">
                {t.onboarding.step3}
              </h2>
              <p className="text-xs text-[#9A765B]">{t.onboarding.step3Sub}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              {supermarketsList.map((s) => {
                const selected = selectedSupermarkets.includes(s);
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleSupermarket(s)}
                    className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-between transition-all ${
                      selected
                        ? 'bg-[#654735] text-[#FFF9F0] border-[#654735] shadow-xs'
                        : 'bg-[#FFF9F0] text-[#654735] border-[#E5D5C5] hover:bg-[#F2E8D9]'
                    }`}
                  >
                    <span>{s}</span>
                    {selected && <CheckCircle2 className="w-3.5 h-3.5 text-[#A8B89A]" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4: Diets */}
        {step === 4 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="text-center">
              <NutriaMascot mood="chef" size="md" className="mx-auto" />
              <h2 className="text-xl font-extrabold text-[#654735] mt-2">
                {t.onboarding.step4}
              </h2>
              <p className="text-xs text-[#9A765B]">{t.onboarding.step4Sub}</p>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {dietsList.map((d) => {
                const selected = selectedDiets.includes(d);
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => toggleDiet(d)}
                    className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
                      selected
                        ? 'bg-[#654735] text-[#FFF9F0] border-[#654735]'
                        : 'bg-[#FFF9F0] text-[#654735] border-[#E5D5C5] hover:bg-[#F2E8D9]'
                    }`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 5: Main Goal */}
        {step === 5 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="text-center">
              <NutriaMascot mood="celebrating" size="md" className="mx-auto" />
              <h2 className="text-xl font-extrabold text-[#654735] mt-2">
                {t.onboarding.step5}
              </h2>
            </div>

            <div className="space-y-2 pt-2">
              {goalsList.map((g) => {
                const selected = mainGoal === g;
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setMainGoal(g)}
                    className={`w-full p-3.5 rounded-2xl border text-left text-xs font-bold flex items-center justify-between transition-all ${
                      selected
                        ? 'bg-[#654735] text-[#FFF9F0] border-[#654735] shadow-xs'
                        : 'bg-[#FFF9F0] text-[#654735] border-[#E5D5C5] hover:bg-[#F2E8D9]'
                    }`}
                  >
                    <span>{g}</span>
                    {selected && <CheckCircle2 className="w-4 h-4 text-[#A8B89A]" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="pt-2 flex items-center justify-between gap-3 border-t border-[#F2E8D9]">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="text-xs font-bold text-[#9A765B] hover:text-[#654735]"
            >
              {isEs ? 'Atrás' : 'Back'}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="text-xs font-bold text-[#9A765B] hover:text-[#654735]"
            >
              {t.onboarding.skipBtn}
            </button>
          )}

          {step < 5 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className="px-6 py-3 rounded-2xl bg-[#654735] text-[#FFF9F0] font-bold text-xs hover:bg-[#533726] flex items-center gap-1.5 shadow-md active:scale-98"
            >
              <span>{isEs ? 'Siguiente' : 'Next'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="px-6 py-3 rounded-2xl bg-[#654735] text-[#FFF9F0] font-bold text-xs hover:bg-[#533726] flex items-center gap-1.5 shadow-md active:scale-98"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F4E3A5]" />
              <span>{t.onboarding.finishBtn}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
