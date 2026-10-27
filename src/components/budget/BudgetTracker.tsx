import React, { useState } from 'react';
import {
  Euro,
  TrendingDown,
  TrendingUp,
  Plus,
  Trash2,
  Calendar,
  Store,
  Tag,
  AlertCircle,
  CheckCircle2,
  Edit2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Expense } from '../../types';
import { NutriaMascot } from '../NutriaMascot';

export const BudgetTracker: React.FC = () => {
  const {
    t,
    language,
    profile,
    updateProfile,
    expenses,
    budgetMetrics,
    addExpense,
    removeExpense,
  } = useApp();

  const isEs = language === 'es';

  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
  const [isEditBudgetModalOpen, setIsEditBudgetModalOpen] = useState(false);
  const [newTarget, setNewTarget] = useState(profile.budgetTarget || 220);
  const [newFrequency, setNewFrequency] = useState<'weekly' | 'monthly'>(profile.budgetFrequency || 'monthly');

  // Form states for adding purchase
  const [supermarket, setSupermarket] = useState('Mercadona');
  const [amount, setAmount] = useState<number | ''>('');
  const [category, setCategory] = useState(isEs ? 'Compra semanal básica' : 'Weekly grocery essentials');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      budgetTarget: Number(newTarget),
      budgetFrequency: newFrequency,
    });
    setIsEditBudgetModalOpen(false);
  };

  const handleAddExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;

    addExpense({
      supermarket,
      amount: Number(amount),
      category,
      note,
      date,
    });

    setAmount('');
    setNote('');
    setIsAddExpenseModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#654735] tracking-tight">
            {t.budget.title}
          </h1>
          <p className="text-xs sm:text-sm text-[#9A765B] mt-1">
            {t.budget.subtitle}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsEditBudgetModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-[#FFF9F0] border border-[#E5D5C5] text-[#654735] font-bold text-xs hover:bg-[#F2E8D9] transition-all shadow-2xs active:scale-98"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>{t.budget.editBudgetBtn}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddExpenseModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#654735] text-[#FFF9F0] font-bold text-xs hover:bg-[#533726] shadow-md transition-all active:scale-98"
          >
            <Plus className="w-4 h-4 text-[#A8B89A]" />
            <span>{t.budget.recordPurchaseBtn}</span>
          </button>
        </div>
      </div>

      {/* Main Budget Card */}
      <div className="p-6 rounded-3xl bg-[#FFFEFC] border border-[#F2E8D9] shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#9A765B]">
              {profile.budgetFrequency === 'weekly' ? t.budget.weekly : t.budget.monthly}
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#654735]">
                {budgetMetrics.remaining.toFixed(2)} €
              </span>
              <span className="text-xs font-semibold text-[#9A765B]">
                {t.dashboard.remaining} / {budgetMetrics.total} €
              </span>
            </div>
          </div>

          {/* Days remaining badge */}
          <div className="flex items-center gap-2 text-xs font-bold text-[#654735] bg-[#FFF9F0] border border-[#E5D5C5] px-3.5 py-2 rounded-2xl">
            <Calendar className="w-4 h-4 text-[#9A765B]" />
            <span>{t.dashboard.daysLeft.replace('{days}', String(budgetMetrics.daysRemaining))}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-xs font-bold mb-1.5">
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

          <div className="w-full h-4 bg-[#F2E8D9] rounded-full overflow-hidden p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                budgetMetrics.percentageUsed > 85
                  ? 'bg-amber-600'
                  : 'bg-[#6C8B56]'
              }`}
              style={{ width: `${Math.min(100, budgetMetrics.percentageUsed)}%` }}
            />
          </div>
        </div>

        {/* Contextual Mascot Tip for Budget */}
        <div className="p-4 rounded-2xl bg-[#FFF9F0] border border-[#E8C8A0] flex items-center gap-3.5">
          <NutriaMascot
            mood={budgetMetrics.isPaceSafe ? 'celebrating' : 'thinking'}
            size="xs"
            className="shrink-0"
          />
          <p className="text-xs text-[#654735] font-medium leading-relaxed">
            {budgetMetrics.isPaceSafe
              ? isEs
                ? '¡Vas a un ritmo excelente! Si mantienes este paso, terminarás el periodo ahorrando dinero.'
                : 'At your current spending rate, you could easily finish the period within budget.'
              : isEs
              ? 'Has gastado una parte importante de tu presupuesto. Aprovechemos lo que tienes en la despensa para equilibrar.'
              : 'You have used a significant part of your budget. Let us lean on pantry meals to balance expenses.'}
          </p>
        </div>
      </div>

      {/* Expense History */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-[#654735] uppercase tracking-wider">
          {t.budget.expensesHistory} ({expenses.length})
        </h3>

        {expenses.length > 0 ? (
          <div className="space-y-2">
            {expenses.map((exp) => (
              <div
                key={exp.id}
                className="p-4 rounded-2xl bg-[#FFFEFC] border border-[#F2E8D9] shadow-2xs flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FFF9F0] text-[#654735] flex items-center justify-center font-bold text-xs">
                    <Store className="w-4 h-4 text-[#9A765B]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#654735]">
                      {exp.supermarket}
                    </h4>
                    <p className="text-xs text-[#9A765B]">
                      {exp.category} • {exp.date}
                    </p>
                    {exp.note && (
                      <p className="text-[11px] text-[#B59C88] mt-0.5">{exp.note}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-base font-extrabold text-[#654735]">
                    -{exp.amount.toFixed(2)} €
                  </span>
                  <button
                    type="button"
                    onClick={() => removeExpense(exp.id)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9A765B] hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-[#9A765B]">
            {t.budget.noExpenses}
          </div>
        )}
      </div>

      {/* Record Purchase Modal */}
      {isAddExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[#FFFEFC] w-full max-w-md rounded-3xl shadow-2xl border border-[#F2E8D9] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 px-6 border-b border-[#F2E8D9] bg-[#FFF9F0]">
              <h3 className="text-base font-bold text-[#654735]">
                {t.budget.modalTitle}
              </h3>
              <button
                onClick={() => setIsAddExpenseModalOpen(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[#9A765B] hover:bg-[#F2E8D9]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddExpenseSubmit} className="p-6 space-y-3.5">
              <div>
                <label className="text-xs font-bold text-[#654735] block mb-1">
                  {t.budget.supermarket}
                </label>
                <select
                  value={supermarket}
                  onChange={(e) => setSupermarket(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5D5C5] bg-[#FFFEFC] text-xs font-semibold text-[#654735]"
                >
                  <option value="Mercadona">Mercadona</option>
                  <option value="Lidl">Lidl</option>
                  <option value="Carrefour">Carrefour</option>
                  <option value="Dia">Dia</option>
                  <option value="Alcampo">Alcampo</option>
                  <option value="Eroski">Eroski</option>
                  <option value="Frutería / Carnicería de barrio">Frutería / Carnicería de barrio</option>
                  <option value="Otro supermercado">Otro</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#654735] block mb-1">
                  {t.budget.amount} *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || '')}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5D5C5] text-sm text-[#654735] font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#654735] block mb-1">
                  {t.budget.category}
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Compra semanal básica"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E5D5C5] text-xs text-[#654735]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#654735] block mb-1">
                  {t.budget.date}
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E5D5C5] text-xs text-[#654735]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#654735] block mb-1">
                  {t.budget.notes}
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={isEs ? 'Ej. Pollo, leche, verdura...' : 'e.g. Chicken, milk, greens...'}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E5D5C5] text-xs text-[#654735]"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-xl bg-[#654735] text-[#FFF9F0] font-bold text-xs hover:bg-[#533726] shadow-md"
                >
                  {t.budget.saveExpense}
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddExpenseModalOpen(false)}
                  className="px-4 py-3 rounded-xl border border-[#E5D5C5] text-xs font-semibold text-[#9A765B]"
                >
                  {t.common.cancel}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Budget Modal */}
      {isEditBudgetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[#FFFEFC] w-full max-w-sm rounded-3xl shadow-2xl border border-[#F2E8D9] overflow-hidden flex flex-col">
            <div className="p-4 px-6 border-b border-[#F2E8D9] bg-[#FFF9F0] flex items-center justify-between">
              <h3 className="text-base font-bold text-[#654735]">
                {t.budget.editBudgetBtn}
              </h3>
              <button
                onClick={() => setIsEditBudgetModalOpen(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[#9A765B] hover:bg-[#F2E8D9]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveBudget} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-[#654735] block mb-1">
                  {isEs ? 'Periodo de presupuesto' : 'Budget frequency'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewFrequency('weekly')}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                      newFrequency === 'weekly'
                        ? 'bg-[#654735] text-[#FFF9F0] border-[#654735]'
                        : 'border-[#E5D5C5] text-[#9A765B]'
                    }`}
                  >
                    {t.budget.weekly}
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewFrequency('monthly')}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                      newFrequency === 'monthly'
                        ? 'bg-[#654735] text-[#FFF9F0] border-[#654735]'
                        : 'border-[#E5D5C5] text-[#9A765B]'
                    }`}
                  >
                    {t.budget.monthly}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#654735] block mb-1">
                  {isEs ? 'Meta de gasto (€)' : 'Budget target (€)'}
                </label>
                <input
                  type="number"
                  min="20"
                  step="5"
                  value={newTarget}
                  onChange={(e) => setNewTarget(parseFloat(e.target.value) || 200)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5D5C5] text-sm text-[#654735] font-extrabold"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-xl bg-[#654735] text-[#FFF9F0] font-bold text-xs hover:bg-[#533726] shadow-md"
                >
                  {t.common.save}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditBudgetModalOpen(false)}
                  className="px-4 py-3 rounded-xl border border-[#E5D5C5] text-xs font-semibold text-[#9A765B]"
                >
                  {t.common.cancel}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
