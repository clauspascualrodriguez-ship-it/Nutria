import React, { useState, useEffect } from 'react';
import { X, Sparkles, ChefHat, Clock, Euro, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Recipe, PantryItem } from '../../types';
import { NutriaMascot } from '../NutriaMascot';

interface AIRecipeGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedIngredients?: string[];
  onRecipeGenerated?: (recipe: Recipe) => void;
}

export const AIRecipeGeneratorModal: React.FC<AIRecipeGeneratorModalProps> = ({
  isOpen,
  onClose,
  preSelectedIngredients = [],
  onRecipeGenerated,
}) => {
  const {
    t,
    language,
    pantryItems,
    expiringPantryItems,
    profile,
    addCustomRecipe,
    addIngredientsToShoppingList,
    setMealSlot,
  } = useApp();

  const isEs = language === 'es';

  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [mealType, setMealType] = useState<'lunch' | 'dinner'>('dinner');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null);

  // Auto-select expiring items when opening
  useEffect(() => {
    if (isOpen) {
      if (preSelectedIngredients.length > 0) {
        setSelectedIngredients(preSelectedIngredients);
      } else if (expiringPantryItems.length > 0) {
        setSelectedIngredients(expiringPantryItems.slice(0, 4).map((i) => i.name));
      } else {
        setSelectedIngredients(pantryItems.slice(0, 3).map((i) => i.name));
      }
      setGeneratedRecipe(null);
    }
  }, [isOpen, preSelectedIngredients, expiringPantryItems, pantryItems]);

  const toggleIngredient = (name: string) => {
    setSelectedIngredients((prev) =>
      prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name]
    );
  };

  const handleGenerate = async () => {
    if (selectedIngredients.length === 0) return;
    setIsGenerating(true);

    try {
      const res = await fetch('/api/generate-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingredients: selectedIngredients,
          mealType,
          language,
          preferences: {
            diet: profile.dietaryPreferences,
            allergies: profile.allergies,
            servings: profile.householdSize || 2,
          },
        }),
      });

      const data = await res.json();
      if (data.recipe) {
        const fullRecipe: Recipe = {
          id: `ai_rec_${Date.now()}`,
          title: data.recipe.title,
          description: data.recipe.description,
          prepTimeMinutes: data.recipe.prepTimeMinutes || 20,
          servings: data.recipe.servings || profile.householdSize || 2,
          costPerServing: data.recipe.costPerServing || 1.25,
          totalCost: data.recipe.totalCost || 2.5,
          category: mealType,
          difficulty: data.recipe.difficulty || (isEs ? 'Fácil' : 'Easy'),
          ingredients: (data.recipe.ingredients || []).map((ing: any) => ({
            name: ing.name,
            amount: ing.amount || '1',
            unit: ing.unit || 'ud',
            inPantry: ing.isFromPantry !== false,
          })),
          instructions: data.recipe.instructions || [],
          tags: ['Antidesperdicio', 'Receta IA', isEs ? 'Económica' : 'Budget'],
          savingsTip: data.recipe.savingsTip,
          pantryMatchPercentage: 85,
        };

        setGeneratedRecipe(fullRecipe);
        addCustomRecipe(fullRecipe);
        if (onRecipeGenerated) {
          onRecipeGenerated(fullRecipe);
        }
      }
    } catch (err) {
      console.error('Failed to generate recipe:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddMissingToShop = () => {
    if (!generatedRecipe) return;
    const missing = generatedRecipe.ingredients.filter((i) => !i.inPantry);
    if (missing.length > 0) {
      addIngredientsToShoppingList(missing);
    }
  };

  const handleAssignToMealPlan = () => {
    if (!generatedRecipe) return;
    // Assign to today or upcoming slot
    setMealSlot(0, generatedRecipe.category as any, generatedRecipe);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-[#FFFEFC] w-full max-w-xl rounded-3xl shadow-2xl border border-[#F2E8D9] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-[#F2E8D9] bg-[#FFF9F0]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#F4E3A5] text-[#654735] flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5 text-[#8C6D1F]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#654735]">
                {t.recipes.aiModal.title}
              </h2>
              <p className="text-xs text-[#9A765B]">{t.recipes.aiModal.subtitle}</p>
            </div>
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
          {!generatedRecipe ? (
            <>
              {/* Ingredient Selector from Pantry */}
              <div>
                <label className="text-xs font-bold text-[#654735] block mb-2">
                  {t.recipes.aiModal.selectExpiringPrompt}
                </label>
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
                  {pantryItems.map((item) => {
                    const isSelected = selectedIngredients.includes(item.name);
                    const isExp = expiringPantryItems.some((e) => e.id === item.id);

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleIngredient(item.name)}
                        className={`text-xs px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                          isSelected
                            ? 'bg-[#654735] text-[#FFF9F0] shadow-xs'
                            : isExp
                            ? 'bg-amber-50 text-amber-900 border border-amber-300'
                            : 'bg-[#FFF9F0] text-[#654735] border border-[#E5D5C5] hover:bg-[#F2E8D9]'
                        }`}
                      >
                        {isExp && <AlertTriangle className="w-3 h-3 text-amber-600" />}
                        <span>{item.name}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#A8B89A]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Meal Type */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-[#654735]">
                  {isEs ? 'Tipo de comida:' : 'Meal type:'}
                </span>
                <div className="flex gap-1.5 bg-[#FFF9F0] p-1 rounded-xl border border-[#E5D5C5]">
                  <button
                    type="button"
                    onClick={() => setMealType('lunch')}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                      mealType === 'lunch'
                        ? 'bg-[#654735] text-[#FFF9F0]'
                        : 'text-[#9A765B] hover:text-[#654735]'
                    }`}
                  >
                    {isEs ? 'Almuerzo / Comida' : 'Lunch'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setMealType('dinner')}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                      mealType === 'dinner'
                        ? 'bg-[#654735] text-[#FFF9F0]'
                        : 'text-[#9A765B] hover:text-[#654735]'
                    }`}
                  >
                    {isEs ? 'Cena Ligera' : 'Dinner'}
                  </button>
                </div>
              </div>

              {/* Mascot note */}
              <div className="p-4 rounded-2xl bg-[#FFF9F0] border border-[#E8C8A0] flex items-center gap-3">
                <NutriaMascot mood="chef" size="xs" />
                <p className="text-xs text-[#654735] font-medium leading-relaxed">
                  {isEs
                    ? '¡Cocinaré una receta diseñada al milímetro para aprovechar estos ingredientes antes de que se echen a perder y sin complicarte la vida!'
                    : 'I will design a tailored recipe to rescue these ingredients before they spoil, keeping it quick and delicious!'}
                </p>
              </div>

              {/* Generate button */}
              <button
                type="button"
                disabled={selectedIngredients.length === 0 || isGenerating}
                onClick={handleGenerate}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#654735] text-[#FFF9F0] font-bold text-sm hover:bg-[#533726] shadow-md transition-all active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#F4E3A5]" />
                <span>{isGenerating ? t.recipes.aiModal.generating : t.recipes.aiModal.generateBtn}</span>
              </button>
            </>
          ) : (
            /* Generated Recipe Display */
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-2xl bg-[#FFF9F0] border-2 border-[#A8B89A] space-y-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-[#3D5A2B] bg-[#EAF2E8] px-2.5 py-0.5 rounded-full">
                  <Sparkles className="w-3 h-3 text-[#6C8B56]" />
                  {isEs ? 'Receta Antidesperdicio Creada' : 'Anti-Waste Recipe Created'}
                </span>
                <h3 className="text-lg font-bold text-[#654735]">
                  {generatedRecipe.title}
                </h3>
                <p className="text-xs text-[#9A765B] leading-relaxed">
                  {generatedRecipe.description}
                </p>

                {/* Metrics */}
                <div className="flex items-center gap-4 pt-2 text-xs font-bold text-[#654735]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#9A765B]" />
                    {generatedRecipe.prepTimeMinutes} min
                  </span>
                  <span className="flex items-center gap-1">
                    <Euro className="w-3.5 h-3.5 text-[#9A765B]" />
                    {generatedRecipe.costPerServing.toFixed(2)} € / ración
                  </span>
                  <span className="text-[#3D5A2B]">
                    {generatedRecipe.servings} raciones
                  </span>
                </div>
              </div>

              {/* Ingredients */}
              <div>
                <h4 className="text-xs font-bold text-[#654735] uppercase tracking-wider mb-2">
                  {t.recipes.ingredientsTitle}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {generatedRecipe.ingredients.map((ing, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-xl bg-[#FFF9F0] border border-[#F2E8D9] flex items-center justify-between text-xs"
                    >
                      <span className="font-semibold text-[#654735]">{ing.name}</span>
                      <span className="text-[11px] text-[#9A765B]">
                        {ing.amount} {ing.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cooking Steps */}
              <div>
                <h4 className="text-xs font-bold text-[#654735] uppercase tracking-wider mb-2">
                  {t.recipes.instructionsTitle}
                </h4>
                <ol className="space-y-2">
                  {generatedRecipe.instructions.map((step, idx) => (
                    <li
                      key={idx}
                      className="p-2.5 rounded-xl bg-[#FFFEFC] border border-[#F2E8D9] flex items-start gap-2.5 text-xs text-[#654735] leading-relaxed"
                    >
                      <span className="w-5 h-5 rounded-full bg-[#654735] text-[#FFF9F0] font-bold text-[10px] flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Savings Tip */}
              {generatedRecipe.savingsTip && (
                <div className="p-3.5 rounded-2xl bg-[#FDF8EE] border border-[#F4E3A5] flex items-start gap-2.5 text-xs text-[#654735]">
                  <Sparkles className="w-4 h-4 text-[#8C6D1F] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-[#8C6D1F] mb-0.5">
                      {t.recipes.savingsTipTitle}
                    </span>
                    <span>{generatedRecipe.savingsTip}</span>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleAssignToMealPlan}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#654735] text-[#FFF9F0] font-bold text-xs hover:bg-[#533726] shadow-md transition-all active:scale-98 flex items-center justify-center gap-1.5"
                >
                  <ChefHat className="w-4 h-4 text-[#A8B89A]" />
                  <span>{t.recipes.addToMealPlanBtn}</span>
                </button>
                <button
                  type="button"
                  onClick={handleAddMissingToShop}
                  className="py-3 px-4 rounded-xl bg-[#FFF9F0] border border-[#E5D5C5] text-[#654735] font-bold text-xs hover:bg-[#F2E8D9]"
                >
                  {t.recipes.addMissingToListBtn}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
