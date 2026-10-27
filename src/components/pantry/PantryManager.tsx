import React, { useState, useMemo } from 'react';
import {
  Plus,
  Barcode,
  Search,
  Filter,
  Package,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Leaf,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PantryItem, StorageLocation } from '../../types';
import { PantryItemCard } from './PantryItemCard';
import { AddEditPantryModal } from './AddEditPantryModal';
import { BarcodeScannerModal } from './BarcodeScannerModal';
import { ExpiringSoonBanner } from './ExpiringSoonBanner';
import { NutriaMascot } from '../NutriaMascot';

interface PantryManagerProps {
  onTriggerRecipeWithIngredients?: (ingredients: string[]) => void;
}

export const PantryManager: React.FC<PantryManagerProps> = ({
  onTriggerRecipeWithIngredients,
}) => {
  const {
    t,
    language,
    pantryItems,
    expiringPantryItems,
    expiredPantryItems,
    profile,
    setActiveTab,
    openChatWithIngredients,
  } = useApp();

  const isEs = language === 'es';

  const [activeLocation, setActiveLocation] = useState<StorageLocation | 'all'>('all');
  const [filterType, setFilterType] = useState<'all' | 'expiring' | 'fresh'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isScannerModalOpen, setIsScannerModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PantryItem | null>(null);

  // Filter items
  const filteredItems = useMemo(() => {
    const todayMs = new Date(new Date().toISOString().split('T')[0]).getTime();

    return pantryItems.filter((item) => {
      // Location check
      if (activeLocation !== 'all' && item.location !== activeLocation) {
        return false;
      }

      // Search query check
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesCategory = item.category.toLowerCase().includes(q);
        const matchesBrand = item.brand?.toLowerCase().includes(q);
        if (!matchesName && !matchesCategory && !matchesBrand) return false;
      }

      // Expiration filter
      const itemMs = new Date(item.expirationDate).getTime();
      const diffDays = Math.ceil((itemMs - todayMs) / (1000 * 60 * 60 * 24));

      if (filterType === 'expiring') {
        return diffDays <= 3;
      }
      if (filterType === 'fresh') {
        return diffDays > 3;
      }

      return true;
    });
  }, [pantryItems, activeLocation, searchQuery, filterType]);

  const handleEdit = (item: PantryItem) => {
    setEditingItem(item);
    setIsAddModalOpen(true);
  };

  const handleCookWithItem = (item: PantryItem) => {
    if (onTriggerRecipeWithIngredients) {
      onTriggerRecipeWithIngredients([item.name]);
    } else {
      setActiveTab('recipes');
    }
  };

  const handleCookExpiring = () => {
    const expiringNames = expiringPantryItems.map((i) => i.name);
    if (onTriggerRecipeWithIngredients) {
      onTriggerRecipeWithIngredients(expiringNames);
    } else {
      setActiveTab('recipes');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner / Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#654735] tracking-tight">
            {t.pantry.title}
          </h1>
          <p className="text-xs sm:text-sm text-[#9A765B] mt-1">
            {t.pantry.subtitle}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsScannerModalOpen(true)}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-2xl bg-[#FFF9F0] border border-[#E5D5C5] text-[#654735] font-bold text-xs hover:bg-[#F2E8D9] transition-all shadow-2xs active:scale-98"
          >
            <Barcode className="w-4 h-4 text-[#654735]" />
            <span>{t.pantry.scanBarcodeBtn}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setEditingItem(null);
              setIsAddModalOpen(true);
            }}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-[#654735] text-[#FFF9F0] font-bold text-xs hover:bg-[#533726] shadow-md transition-all active:scale-98"
          >
            <Plus className="w-4 h-4 text-[#A8B89A]" />
            <span>{t.pantry.addItemBtn}</span>
          </button>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-[#FFFEFC] border border-[#F2E8D9] shadow-2xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#FFF9F0] text-[#654735] flex items-center justify-center">
            <Package className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#9A765B]">{t.pantry.stats.totalItems}</p>
            <p className="text-lg font-extrabold text-[#654735]">{pantryItems.length}</p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#FFFEFC] border border-[#F2E8D9] shadow-2xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#9A765B]">{t.pantry.stats.expiringSoon}</p>
            <p className="text-lg font-extrabold text-amber-800">{expiringPantryItems.length}</p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#FFFEFC] border border-[#F2E8D9] shadow-2xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#EAF2E8] text-[#3D5A2B] flex items-center justify-center">
            <Leaf className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#9A765B]">{t.pantry.filterFresh}</p>
            <p className="text-lg font-extrabold text-[#3D5A2B]">
              {pantryItems.length - expiringPantryItems.length - expiredPantryItems.length}
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#FFFEFC] border border-[#F2E8D9] shadow-2xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#F4E3A5]/60 text-[#8C6D1F] flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#9A765B]">{t.pantry.stats.wasteSaved}</p>
            <p className="text-lg font-extrabold text-[#654735]">
              {profile.totalMoneySaved.toFixed(2)} €
            </p>
          </div>
        </div>
      </div>

      {/* Urgent Expiring Soon Alert Banner */}
      <ExpiringSoonBanner onCookClick={handleCookExpiring} />

      {/* Search & Location Bar */}
      <div className="space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#9A765B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.pantry.searchPlaceholder}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#E5D5C5] bg-[#FFFEFC] text-sm text-[#654735] focus:outline-none focus:ring-2 focus:ring-[#A8B89A] shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#9A765B] hover:text-[#654735]"
            >
              ✕
            </button>
          )}
        </div>

        {/* Storage Location Tabs */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex gap-1.5 p-1 bg-[#F2E8D9]/70 rounded-2xl border border-[#E5D5C5] overflow-x-auto">
            {[
              { id: 'all', label: isEs ? '🧺 Todo' : '🧺 All' },
              { id: 'fridge', label: isEs ? '❄️ Nevera' : '❄️ Fridge' },
              { id: 'pantry', label: isEs ? '🥫 Despensa' : '🥫 Pantry' },
              { id: 'freezer', label: isEs ? '🧊 Congelador' : '🧊 Freezer' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveLocation(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeLocation === tab.id
                    ? 'bg-[#FFFEFC] text-[#654735] shadow-xs'
                    : 'text-[#9A765B] hover:text-[#654735]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Quick Filter: All vs Expiring vs Fresh */}
          <div className="flex gap-1.5 overflow-x-auto">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                filterType === 'all'
                  ? 'bg-[#654735] text-[#FFF9F0]'
                  : 'bg-[#FFFEFC] border border-[#E5D5C5] text-[#9A765B] hover:bg-[#FFF9F0]'
              }`}
            >
              {t.pantry.filterAll}
            </button>
            <button
              type="button"
              onClick={() => setFilterType('expiring')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5 ${
                filterType === 'expiring'
                  ? 'bg-amber-700 text-amber-50 shadow-2xs'
                  : 'bg-[#FFFEFC] border border-amber-200 text-amber-800 hover:bg-amber-50'
              }`}
            >
              <span>⚠️ {isEs ? 'Caducan en <= 3 días' : 'Expiring in <= 3 days'}</span>
              {expiringPantryItems.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-amber-500 text-white font-extrabold text-[10px] flex items-center justify-center">
                  {expiringPantryItems.length}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setFilterType('fresh')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                filterType === 'fresh'
                  ? 'bg-[#3D5A2B] text-emerald-50'
                  : 'bg-[#FFFEFC] border border-[#A8B89A] text-[#3D5A2B] hover:bg-[#EAF2E8]'
              }`}
            >
              ✅ {isEs ? 'Frescos' : 'Fresh'}
            </button>
          </div>
        </div>
      </div>

      {/* Active Expiring Filter Notice */}
      {filterType === 'expiring' && (
        <div className="p-3.5 rounded-2xl bg-[#FFF5EA] border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <p className="text-xs text-[#654735] font-semibold">
              {isEs
                ? `Mostrando ${filteredItems.length} alimento(s) que caducan en los próximos 3 días.`
                : `Showing ${filteredItems.length} item(s) expiring within the next 3 days.`}
            </p>
          </div>
          <button
            type="button"
            onClick={() => openChatWithIngredients(filteredItems.map((i) => i.name))}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#654735] text-[#FFF9F0] text-xs font-bold hover:bg-[#533726] shadow-2xs shrink-0 active:scale-95"
          >
            <span>{t.pantry.askChatForRecipeBtn}</span>
          </button>
        </div>
      )}

      {/* Grid of Pantry Items */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredItems.map((item) => (
            <PantryItemCard
              key={item.id}
              item={item}
              onEdit={handleEdit}
              onCookWithItem={handleCookWithItem}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-12 px-6 rounded-3xl bg-[#FFFEFC] border border-[#F2E8D9] text-center space-y-4">
          <NutriaMascot mood="thinking" size="md" className="mx-auto" />
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-bold text-[#654735]">
              {searchQuery
                ? isEs
                  ? 'No hay alimentos que coincidan'
                  : 'No matching items'
                : t.pantry.emptyPantryTitle}
            </h3>
            <p className="text-xs text-[#9A765B] mt-1">
              {searchQuery
                ? isEs
                  ? 'Prueba con otra palabra o añade el producto a tu despensa.'
                  : 'Try another keyword or add this item to your pantry.'
                : t.pantry.emptyPantrySub}
            </p>
          </div>
          <div className="flex justify-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setEditingItem(null);
                setIsAddModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#654735] text-[#FFF9F0] text-xs font-bold hover:bg-[#533726]"
            >
              <Plus className="w-4 h-4" />
              {t.pantry.addItemBtn}
            </button>
            <button
              type="button"
              onClick={() => setIsScannerModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFF9F0] border border-[#E5D5C5] text-[#654735] text-xs font-bold hover:bg-[#F2E8D9]"
            >
              <Barcode className="w-4 h-4" />
              {t.pantry.scanBarcodeBtn}
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <AddEditPantryModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingItem(null);
        }}
        editItem={editingItem}
      />

      <BarcodeScannerModal
        isOpen={isScannerModalOpen}
        onClose={() => setIsScannerModalOpen(false)}
      />
    </div>
  );
};
