import React, { useState, useMemo } from 'react';
import { Sparkles, Clock, Euro, ChefHat, Filter, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Recipe } from '../../types';
import { RecipeDetailModal } from './RecipeDetailModal';
import { AIRecipeGeneratorModal } from './AIRecipeGeneratorModal';

interface RecipeCatalogProps {
  initialFilter?: string;
  initialIngredientsForAI?: string[];
}

export const RecipeCatalog: React.FC<RecipeCatalogProps> = ({
  initialFilter = 'all',
  initialIngredientsForAI = [],
}) => {
  const { t, language, recipes, pantryItems } = useApp();
  const isEs = language === 'es';

  const [activeFilter, setActiveFilter] = useState<'all' | 'pantryMatch' | 'under150' | 'quick'>(
    initialFilter as any
  );
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [aiIngredients, setAiIngredients] = useState<string[]>(initialIngredientsForAI);

  // Compute pantry match for all recipes dynamically
  const recipesWithMatch = useMemo(() => {
    return recipes.map((recipe) => {
      const matchCount = recipe.ingredients.filter((ing) =>
        pantryItems.some(
          (p) =>
            p.name.toLowerCase().includes(ing.name.toLowerCase()) ||
            ing.name.toLowerCase().includes(p.name.toLowerCase())
        )
      ).length;

      const percentage = Math.round((matchCount / (recipe.ingredients.length || 1)) * 100);
      return { ...recipe, pantryMatchPercentage: percentage };
    });
  }, [recipes, pantryItems]);

  // Filter recipes
  const filteredRecipes = useMemo(() => {
    return recipesWithMatch.filter((recipe) => {
      if (activeFilter === 'pantryMatch') {
        return (recipe.pantryMatchPercentage || 0) >= 50;
      }
      if (activeFilter === 'under150') {
        return recipe.costPerServing <= 1.5;
      }
      if (activeFilter === 'quick') {
        return recipe.prepTimeMinutes <= 20;
      }
      return true;
    });
  }, [recipesWithMatch, activeFilter]);

  const handleOpenAIModal = (ingredients: string[] = []) => {
    setAiIngredients(ingredients);
    setIsAIModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#654735] tracking-tight">
            {t.recipes.title}
          </h1>
          <p className="text-xs sm:text-sm text-[#9A765B] mt-1">
            {t.recipes.subtitle}
          </p>
        </div>

        {/* AI Recipe Generator Button */}
        <button
          type="button"
          onClick={() => handleOpenAIModal([])}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-[#654735] text-[#FFF9F0] font-bold text-xs sm:text-sm hover:bg-[#533726] shadow-md transition-all active:scale-98 shrink-0"
        >
          <Sparkles className="w-4 h-4 text-[#F4E3A5]" />
          <span>{t.recipes.generateRecipeBtn}</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setActiveFilter('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeFilter === 'all'
              ? 'bg-[#654735] text-[#FFF9F0] shadow-2xs'
              : 'bg-[#FFFEFC] border border-[#E5D5C5] text-[#9A765B] hover:bg-[#FFF9F0]'
          }`}
        >
          {t.recipes.filterAll}
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('pantryMatch')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeFilter === 'pantryMatch'
              ? 'bg-[#3D5A2B] text-emerald-50 shadow-2xs'
              : 'bg-[#FFFEFC] border border-[#A8B89A] text-[#3D5A2B] hover:bg-[#EAF2E8]'
          }`}
        >
          {t.recipes.filterPantryMatch}
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('under150')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeFilter === 'under150'
              ? 'bg-[#8C6D1F] text-amber-50 shadow-2xs'
              : 'bg-[#FFFEFC] border border-[#E5D5C5] text-[#8C6D1F] hover:bg-[#FFF9F0]'
          }`}
        >
          {t.recipes.filterUnder150}
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('quick')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeFilter === 'quick'
              ? 'bg-[#654735] text-[#FFF9F0] shadow-2xs'
              : 'bg-[#FFFEFC] border border-[#E5D5C5] text-[#9A765B] hover:bg-[#FFF9F0]'
          }`}
        >
          {t.recipes.filterQuick}
        </button>
      </div>

      {/* Recipe Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRecipes.map((recipe) => (
          <div
            key={recipe.id}
            onClick={() => setSelectedRecipe(recipe)}
            className="group cursor-pointer rounded-3xl p-5 bg-[#FFFEFC] border border-[#F2E8D9] hover:border-[#654735]/40 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              {/* Badges */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#EAF2E8] text-[#3D5A2B] border border-[#A8B89A]">
                  {recipe.pantryMatchPercentage}% {isEs ? 'en casa' : 'at home'}
                </span>
                <span className="text-[11px] font-bold text-[#9A765B]">
                  {recipe.difficulty}
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="text-base font-bold text-[#654735] group-hover:text-[#533726] transition-colors leading-snug line-clamp-2">
                {isEs ? recipe.title : recipe.titleEn || recipe.title}
              </h3>
              <p className="text-xs text-[#9A765B] mt-1.5 line-clamp-2 leading-relaxed">
                {isEs ? recipe.description : recipe.descriptionEn || recipe.description}
              </p>
            </div>

            {/* Bottom Row */}
            <div className="pt-4 mt-3 border-t border-[#F2E8D9] flex items-center justify-between text-xs font-bold text-[#654735]">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#9A765B]" />
                {recipe.prepTimeMinutes} min
              </span>

              <span className="text-[#3D5A2B] bg-[#EAF2E8]/60 px-2 py-0.5 rounded-lg">
                {recipe.costPerServing.toFixed(2)} € / ración
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      <RecipeDetailModal
        recipe={selectedRecipe}
        isOpen={!!selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
      />

      <AIRecipeGeneratorModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        preSelectedIngredients={aiIngredients}
        onRecipeGenerated={(rec) => setSelectedRecipe(rec)}
      />
    </div>
  );
};
