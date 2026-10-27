import React, { useState } from 'react';
import { X, Clock, Euro, Users, CheckCircle2, ShoppingCart, Calendar, Sparkles, ChefHat } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Recipe } from '../../types';

interface RecipeDetailModalProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
}

export const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({
  recipe,
  isOpen,
  onClose,
}) => {
  const {
    t,
    language,
    pantryItems,
    addIngredientsToShoppingList,
    setMealSlot,
    setActiveTab,
  } = useApp();

  const isEs = language === 'es';
  const [addedToList, setAddedToList] = useState(false);
  const [assignedToPlan, setAssignedToPlan] = useState(false);

  if (!isOpen || !recipe) return null;

  // Determine which ingredients are in the user's pantry
  const processedIngredients = recipe.ingredients.map((ing) => {
    const hasInPantry = pantryItems.some(
      (p) =>
        p.name.toLowerCase().includes(ing.name.toLowerCase()) ||
        ing.name.toLowerCase().includes(p.name.toLowerCase())
    );
    return { ...ing, inPantry: hasInPantry };
  });

  const missingIngredients = processedIngredients.filter((i) => !i.inPantry);
  const pantryMatch = Math.round(
    ((processedIngredients.length - missingIngredients.length) / processedIngredients.length) * 100
  );

  const handleAddMissing = () => {
    if (missingIngredients.length > 0) {
      addIngredientsToShoppingList(missingIngredients);
      setAddedToList(true);
      setTimeout(() => setAddedToList(false), 2000);
    }
  };

  const handleAssignPlan = () => {
    // Assign to upcoming lunch or dinner
    setMealSlot(0, recipe.category === 'dinner' ? 'dinner' : 'lunch', recipe);
    setAssignedToPlan(true);
    setTimeout(() => {
      setAssignedToPlan(false);
      onClose();
      setActiveTab('mealPlan');
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-[#FFFEFC] w-full max-w-xl rounded-3xl shadow-2xl border border-[#F2E8D9] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between p-4 px-6 border-b border-[#F2E8D9] bg-[#FFF9F0]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#EAF2E8] text-[#3D5A2B] border border-[#A8B89A]">
                {pantryMatch}% {isEs ? 'en tu despensa' : 'in your pantry'}
              </span>
              <span className="text-xs font-semibold text-[#9A765B]">
                {recipe.difficulty}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-[#654735] leading-snug">
              {isEs ? recipe.title : recipe.titleEn || recipe.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#9A765B] hover:text-[#654735] hover:bg-[#F2E8D9] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Metrics bar */}
          <div className="grid grid-cols-3 gap-2 p-3 bg-[#FFF9F0] rounded-2xl border border-[#F2E8D9] text-center">
            <div>
              <p className="text-[10px] font-bold uppercase text-[#9A765B]">{isEs ? 'Tiempo' : 'Time'}</p>
              <p className="text-sm font-extrabold text-[#654735] flex items-center justify-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#9A765B]" />
                {recipe.prepTimeMinutes} min
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-[#9A765B]">{isEs ? 'Coste/Ración' : 'Cost/Serv'}</p>
              <p className="text-sm font-extrabold text-[#3D5A2B] flex items-center justify-center gap-1">
                <Euro className="w-3.5 h-3.5" />
                {recipe.costPerServing.toFixed(2)} €
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-[#9A765B]">{isEs ? 'Raciones' : 'Servings'}</p>
              <p className="text-sm font-extrabold text-[#654735] flex items-center justify-center gap-1">
                <Users className="w-3.5 h-3.5 text-[#9A765B]" />
                {recipe.servings}
              </p>
            </div>
          </div>

          <p className="text-xs text-[#654735] leading-relaxed">
            {isEs ? recipe.description : recipe.descriptionEn || recipe.description}
          </p>

          {/* Ingredients list with in-pantry badges */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#654735]">
                {t.recipes.ingredientsTitle} ({processedIngredients.length})
              </h3>
              {missingIngredients.length > 0 && (
                <button
                  type="button"
                  onClick={handleAddMissing}
                  className="text-xs font-bold text-[#654735] hover:text-[#533726] flex items-center gap-1 bg-[#F4E3A5]/60 hover:bg-[#F4E3A5] px-2.5 py-1 rounded-xl transition-colors"
                >
                  <ShoppingCart className="w-3.5 h-3.5 text-[#8C6D1F]" />
                  <span>
                    {addedToList
                      ? isEs ? '¡Añadidos!' : 'Added!'
                      : isEs ? `Añadir ${missingIngredients.length} a la lista` : `Add ${missingIngredients.length} to list`}
                  </span>
                </button>
              )}
            </div>

            <div className="space-y-1.5">
              {processedIngredients.map((ing, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-[#FFF9F0] border border-[#F2E8D9] flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        ing.inPantry ? 'bg-[#6C8B56]' : 'bg-amber-400'
                      }`}
                    />
                    <span className="font-semibold text-[#654735]">{ing.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#9A765B]">
                      {ing.amount} {ing.unit}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        ing.inPantry
                          ? 'bg-[#EAF2E8] text-[#3D5A2B]'
                          : 'bg-amber-50 text-amber-800'
                      }`}
                    >
                      {ing.inPantry ? t.recipes.inYourPantry : t.recipes.missingItem}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step by step directions */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#654735] mb-2">
              {t.recipes.instructionsTitle}
            </h3>
            <ol className="space-y-2">
              {(isEs ? recipe.instructions : recipe.instructionsEn || recipe.instructions).map(
                (step, idx) => (
                  <li
                    key={idx}
                    className="p-3 rounded-2xl bg-[#FFFEFC] border border-[#F2E8D9] flex items-start gap-3 text-xs text-[#654735] leading-relaxed"
                  >
                    <span className="w-5 h-5 rounded-full bg-[#654735] text-[#FFF9F0] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                )
              )}
            </ol>
          </div>

          {/* Why you save money */}
          {(recipe.savingsTip || recipe.savingsTipEn) && (
            <div className="p-3.5 rounded-2xl bg-[#FDF8EE] border border-[#F4E3A5] flex items-start gap-2.5 text-xs text-[#654735]">
              <Sparkles className="w-4 h-4 text-[#8C6D1F] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-[#8C6D1F] mb-0.5">
                  {t.recipes.savingsTipTitle}
                </span>
                <span>{isEs ? recipe.savingsTip : recipe.savingsTipEn || recipe.savingsTip}</span>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-2 pt-2 border-t border-[#F2E8D9]">
            <button
              type="button"
              onClick={handleAssignPlan}
              className="flex-1 py-3 px-4 rounded-xl bg-[#654735] text-[#FFF9F0] font-bold text-xs hover:bg-[#533726] shadow-md transition-all active:scale-98 flex items-center justify-center gap-2"
            >
              <ChefHat className="w-4 h-4 text-[#A8B89A]" />
              <span>
                {assignedToPlan
                  ? isEs ? '¡Asignado al menú!' : 'Assigned to plan!'
                  : t.recipes.addToMealPlanBtn}
              </span>
            </button>
            <button
              type="button"
              onClick={handleAddMissing}
              className="px-4 py-3 rounded-xl bg-[#FFF9F0] border border-[#E5D5C5] text-[#654735] font-bold text-xs hover:bg-[#F2E8D9] transition-colors"
            >
              {t.recipes.addMissingToListBtn}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
