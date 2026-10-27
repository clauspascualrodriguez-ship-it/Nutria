import React, { useState, useMemo } from 'react';
import {
  Plus,
  Check,
  Trash2,
  Share2,
  PackageCheck,
  ShoppingBag,
  Sparkles,
  Store,
  DollarSign,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ShoppingItem, FoodCategory } from '../../types';
import { NutriaMascot } from '../NutriaMascot';

const CATEGORIES: FoodCategory[] = [
  'Verduras',
  'Frutas',
  'Lácteos y Huevos',
  'Carnicería',
  'Pescadería',
  'Cereales y Pasta',
  'Legumbres',
  'Conservas',
  'Panadería',
  'Bebidas',
  'Congelados',
  'Aceites y Condimentos',
  'Hogar y Limpieza',
  'Otros',
];

export const ShoppingList: React.FC = () => {
  const {
    t,
    language,
    shoppingList,
    addShoppingItem,
    toggleShoppingItem,
    removeShoppingItem,
    clearCheckedShoppingItems,
    moveCheckedToPantry,
  } = useApp();

  const isEs = language === 'es';

  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<FoodCategory>('Verduras');
  const [newItemPrice, setNewItemPrice] = useState(1.5);
  const [newItemStore, setNewItemStore] = useState('Mercadona');
  const [copiedNotice, setCopiedNotice] = useState(false);
  const [pantryMovedNotice, setPantryMovedNotice] = useState<number | null>(null);

  // Group items by category (aisle)
  const groupedItems = useMemo(() => {
    const groups: Record<string, ShoppingItem[]> = {};

    shoppingList.forEach((item) => {
      const cat = item.category || 'Otros';
      if (!groups[cat]) {
        groups[cat] = [];
      }
      groups[cat].push(item);
    });

    return groups;
  }, [shoppingList]);

  // Total estimated price
  const totalEstimated = useMemo(() => {
    return shoppingList.reduce((sum, item) => sum + (item.estimatedPrice || 0), 0);
  }, [shoppingList]);

  const checkedCount = shoppingList.filter((i) => i.checked).length;

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    addShoppingItem({
      name: newItemName.trim(),
      category: newItemCategory,
      quantity: 1,
      unit: 'ud',
      estimatedPrice: Number(newItemPrice) || 1.5,
      store: newItemStore,
    });

    setNewItemName('');
  };

  const handleShareList = () => {
    const lines = [
      `🛒 *${isEs ? 'Lista de la compra Nutria' : 'Nutria Grocery List'}*`,
      ...shoppingList.map(
        (i) => `${i.checked ? '✅' : '⬜'} ${i.name} (~${i.estimatedPrice.toFixed(2)} €)`
      ),
      `\n💰 *Total est.: ~${totalEstimated.toFixed(2)} €*`,
    ];

    navigator.clipboard.writeText(lines.join('\n'));
    setCopiedNotice(true);
    setTimeout(() => setCopiedNotice(false), 2500);
  };

  const handleMoveToPantry = () => {
    const res = moveCheckedToPantry();
    setPantryMovedNotice(res.movedCount);
    setTimeout(() => setPantryMovedNotice(null), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#654735] tracking-tight">
            {t.shopping.title}
          </h1>
          <p className="text-xs sm:text-sm text-[#9A765B] mt-1">
            {t.shopping.subtitle}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {checkedCount > 0 && (
            <button
              type="button"
              onClick={handleMoveToPantry}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-[#EAF2E8] border border-[#A8B89A] text-[#3D5A2B] font-bold text-xs hover:bg-[#D5E6D1] transition-all shadow-2xs active:scale-98"
            >
              <PackageCheck className="w-4 h-4 text-[#5F8747]" />
              <span>{t.shopping.moveToPantryBtn}</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleShareList}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-[#FFF9F0] border border-[#E5D5C5] text-[#654735] font-bold text-xs hover:bg-[#F2E8D9] transition-all shadow-2xs active:scale-98"
          >
            <Share2 className="w-4 h-4" />
            <span>{copiedNotice ? t.shopping.copiedToClipboard : t.shopping.shareBtn}</span>
          </button>
        </div>
      </div>

      {/* Moved to pantry alert */}
      {pantryMovedNotice !== null && (
        <div className="p-3.5 bg-[#EAF2E8] border border-[#A8B89A] text-[#3D5A2B] rounded-2xl flex items-center gap-2.5 animate-in fade-in">
          <PackageCheck className="w-5 h-5 text-[#5F8747] shrink-0" />
          <p className="text-xs font-bold">
            {isEs
              ? `¡${pantryMovedNotice} artículo(s) comprados movidos directamente a tu Despensa con fecha de caducidad óptima!`
              : `Moved ${pantryMovedNotice} bought item(s) directly to your Pantry with fresh expiration dates!`}
          </p>
        </div>
      )}

      {/* Add Item Form */}
      <form
        onSubmit={handleAddItem}
        className="p-4 rounded-3xl bg-[#FFFEFC] border border-[#F2E8D9] shadow-xs space-y-3"
      >
        <div className="flex gap-2">
          <input
            type="text"
            required
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder={t.shopping.addItemPlaceholder}
            className="flex-1 px-4 py-2.5 rounded-2xl border border-[#E5D5C5] bg-[#FFF9F0]/60 text-sm text-[#654735] focus:outline-none focus:ring-2 focus:ring-[#A8B89A]"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-2xl bg-[#654735] text-[#FFF9F0] text-xs font-bold hover:bg-[#533726] shadow-md transition-all active:scale-98 shrink-0 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 text-[#A8B89A]" />
            <span>{t.shopping.addBtn}</span>
          </button>
        </div>

        {/* Category & Store Pickers */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <div className="flex items-center gap-1 text-[#9A765B]">
            <span>Pasillo:</span>
            <select
              value={newItemCategory}
              onChange={(e) => setNewItemCategory(e.target.value as FoodCategory)}
              className="px-2 py-1 rounded-xl border border-[#E5D5C5] bg-[#FFF9F0] text-xs font-medium text-[#654735]"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1 text-[#9A765B]">
            <span>Súper:</span>
            <select
              value={newItemStore}
              onChange={(e) => setNewItemStore(e.target.value)}
              className="px-2 py-1 rounded-xl border border-[#E5D5C5] bg-[#FFF9F0] text-xs font-medium text-[#654735]"
            >
              <option value="Mercadona">Mercadona</option>
              <option value="Lidl">Lidl</option>
              <option value="Carrefour">Carrefour</option>
              <option value="Dia">Dia</option>
              <option value="Alcampo">Alcampo</option>
            </select>
          </div>

          <div className="flex items-center gap-1 text-[#9A765B]">
            <span>Precio est. (€):</span>
            <input
              type="number"
              step="0.05"
              min="0.1"
              value={newItemPrice}
              onChange={(e) => setNewItemPrice(parseFloat(e.target.value) || 1.5)}
              className="w-16 px-2 py-1 rounded-xl border border-[#E5D5C5] bg-[#FFF9F0] text-xs font-medium text-[#654735]"
            />
          </div>
        </div>
      </form>

      {/* Total & Clear Bar */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FFF9F0] border border-[#F2E8D9]">
        <div>
          <span className="text-xs text-[#9A765B] block">{t.shopping.totalEstimated}</span>
          <span className="text-xl font-extrabold text-[#654735]">
            ~{totalEstimated.toFixed(2)} €
          </span>
        </div>

        {checkedCount > 0 && (
          <button
            type="button"
            onClick={clearCheckedShoppingItems}
            className="text-xs font-bold text-[#9A765B] hover:text-[#654735] underline"
          >
            {t.shopping.clearCheckedBtn} ({checkedCount})
          </button>
        )}
      </div>

      {/* Grouped Shopping Items by Aisle */}
      {shoppingList.length > 0 ? (
        <div className="space-y-5">
          {Object.entries(groupedItems).map(([category, items]) => (
            <div key={category} className="space-y-2">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#9A765B] flex items-center gap-1.5 px-1">
                <span>📦</span>
                <span>{category}</span>
                <span className="text-[10px] text-[#B59C88]">({items.length})</span>
              </h3>

              <div className="space-y-1.5">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      item.checked
                        ? 'bg-[#F2E8D9]/40 border-[#E5D5C5] opacity-60'
                        : 'bg-[#FFFEFC] border-[#F2E8D9] shadow-2xs hover:border-[#9A765B]/40'
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <button
                        type="button"
                        onClick={() => toggleShoppingItem(item.id)}
                        className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
                          item.checked
                            ? 'bg-[#6C8B56] border-[#6C8B56] text-white'
                            : 'border-[#C5B5A5] bg-[#FFF9F0] hover:border-[#654735]'
                        }`}
                      >
                        {item.checked && <Check className="w-4 h-4 stroke-[3]" />}
                      </button>

                      <div className="flex-1">
                        <span
                          className={`text-sm font-bold block ${
                            item.checked
                              ? 'line-through text-[#9A765B]'
                              : 'text-[#654735]'
                          }`}
                        >
                          {item.name}
                        </span>

                        <div className="flex items-center gap-2 text-[11px] text-[#9A765B]">
                          {item.store && (
                            <span className="inline-flex items-center gap-0.5">
                              <Store className="w-3 h-3" />
                              {item.store}
                            </span>
                          )}
                          {item.recipeTitle && (
                            <span className="text-[#B59C88]">
                              ({item.recipeTitle})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-extrabold text-[#654735]">
                        ~{item.estimatedPrice ? item.estimatedPrice.toFixed(2) : '1.50'} €
                      </span>

                      <button
                        type="button"
                        onClick={() => removeShoppingItem(item.id)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9A765B] hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-12 px-6 rounded-3xl bg-[#FFFEFC] border border-[#F2E8D9] text-center space-y-4">
          <NutriaMascot mood="shopping" size="md" className="mx-auto" />
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-bold text-[#654735]">
              {t.shopping.emptyListTitle}
            </h3>
            <p className="text-xs text-[#9A765B] mt-1">
              {t.shopping.emptyListSub}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
