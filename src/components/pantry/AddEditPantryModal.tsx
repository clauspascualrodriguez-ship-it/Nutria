import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, Tag, Plus, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PantryItem, StorageLocation, FoodCategory } from '../../types';

interface AddEditPantryModalProps {
  isOpen: boolean;
  onClose: () => void;
  editItem?: PantryItem | null;
}

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
  'Snacks y Dulces',
  'Hogar y Limpieza',
  'Otros',
];

export const AddEditPantryModal: React.FC<AddEditPantryModalProps> = ({
  isOpen,
  onClose,
  editItem,
}) => {
  const { t, language, addPantryItem, editPantryItem: updateItem } = useApp();
  const isEs = language === 'es';

  const defaultExpDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  };

  const [name, setName] = useState('');
  const [category, setCategory] = useState<FoodCategory>('Verduras');
  const [location, setLocation] = useState<StorageLocation>('fridge');
  const [expirationDate, setExpirationDate] = useState(defaultExpDate());
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState<PantryItem['unit']>('ud');
  const [estimatedPrice, setEstimatedPrice] = useState(1.5);
  const [brand, setBrand] = useState('');

  // Quick suggestions for fast entry
  const quickPills = [
    { name: isEs ? 'Huevos camperos' : 'Free-range eggs', cat: 'Lácteos y Huevos', loc: 'fridge', days: 21, unit: 'ud', qty: 6, price: 1.8 },
    { name: isEs ? 'Leche entera' : 'Whole milk', cat: 'Lácteos y Huevos', loc: 'fridge', days: 7, unit: 'L', qty: 1, price: 0.96 },
    { name: isEs ? 'Calabacines' : 'Zucchini', cat: 'Verduras', loc: 'fridge', days: 5, unit: 'ud', qty: 2, price: 1.2 },
    { name: isEs ? 'Pechuga de pollo' : 'Chicken breast', cat: 'Carnicería', loc: 'fridge', days: 4, unit: 'g', qty: 400, price: 3.5 },
    { name: isEs ? 'Tomates maduros' : 'Ripe tomatoes', cat: 'Verduras', loc: 'fridge', days: 4, unit: 'ud', qty: 4, price: 1.5 },
    { name: isEs ? 'Arroz redondo' : 'Round rice', cat: 'Cereales y Pasta', loc: 'pantry', days: 365, unit: 'kg', qty: 1, price: 1.35 },
    { name: isEs ? 'Lentejas secas' : 'Dried lentils', cat: 'Legumbres', loc: 'pantry', days: 365, unit: 'kg', qty: 1, price: 1.85 },
    { name: isEs ? 'Atún claro en lata' : 'Canned tuna', cat: 'Conservas', loc: 'pantry', days: 700, unit: 'lata', qty: 3, price: 2.75 },
    { name: isEs ? 'Guisantes congelados' : 'Frozen peas', cat: 'Congelados', loc: 'freezer', days: 180, unit: 'kg', qty: 1, price: 1.55 },
  ];

  useEffect(() => {
    if (editItem) {
      setName(editItem.name);
      setCategory(editItem.category as FoodCategory);
      setLocation(editItem.location);
      setExpirationDate(editItem.expirationDate);
      setQuantity(editItem.quantity);
      setUnit(editItem.unit);
      setEstimatedPrice(editItem.estimatedPrice || 1.5);
      setBrand(editItem.brand || '');
    } else {
      setName('');
      setCategory('Verduras');
      setLocation('fridge');
      setExpirationDate(defaultExpDate());
      setQuantity(1);
      setUnit('ud');
      setEstimatedPrice(1.5);
      setBrand('');
    }
  }, [editItem, isOpen]);

  const applyOffsetDays = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    setExpirationDate(d.toISOString().split('T')[0]);
  };

  const handleSelectPill = (pill: typeof quickPills[0]) => {
    setName(pill.name);
    setCategory(pill.cat as FoodCategory);
    setLocation(pill.loc as StorageLocation);
    setUnit(pill.unit as any);
    setQuantity(pill.qty);
    setEstimatedPrice(pill.price);
    applyOffsetDays(pill.days);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editItem) {
      updateItem({
        ...editItem,
        name: name.trim(),
        category,
        location,
        expirationDate,
        quantity: Number(quantity),
        unit,
        estimatedPrice: Number(estimatedPrice),
        brand: brand.trim(),
      });
    } else {
      addPantryItem({
        name: name.trim(),
        category,
        location,
        expirationDate,
        quantity: Number(quantity),
        unit,
        estimatedPrice: Number(estimatedPrice),
        brand: brand.trim(),
      });
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-[#FFFEFC] w-full max-w-lg rounded-3xl shadow-2xl border border-[#F2E8D9] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-[#F2E8D9] bg-[#FFF9F0]">
          <h2 className="text-lg font-bold text-[#654735]">
            {editItem ? t.pantry.modalEditTitle : t.pantry.modalAddTitle}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#9A765B] hover:text-[#654735] hover:bg-[#F2E8D9] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {/* Quick Suggestions for new items */}
          {!editItem && (
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#9A765B]">
                {t.pantry.form.quickPillsTitle}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {quickPills.map((pill) => (
                  <button
                    key={pill.name}
                    type="button"
                    onClick={() => handleSelectPill(pill)}
                    className="text-xs px-2.5 py-1 rounded-full bg-[#FFF9F0] border border-[#E5D5C5] text-[#654735] hover:bg-[#F4E3A5] hover:border-[#D1B85D] transition-colors font-medium active:scale-95"
                  >
                    + {pill.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Name */}
          <div>
            <label className="text-xs font-bold text-[#654735] block mb-1">
              {t.pantry.form.nameLabel} *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.pantry.form.namePlaceholder}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5D5C5] bg-[#FFFEFC] text-sm text-[#654735] focus:outline-none focus:ring-2 focus:ring-[#A8B89A]"
            />
          </div>

          {/* Storage Location & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#654735] block mb-1">
                {t.pantry.form.locationLabel}
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#FFF9F0] rounded-xl border border-[#E5D5C5]">
                {[
                  { id: 'fridge', label: isEs ? '❄️ Nevera' : '❄️ Fridge' },
                  { id: 'pantry', label: isEs ? '🥫 Despensa' : '🥫 Pantry' },
                  { id: 'freezer', label: isEs ? '🧊 Congelador' : '🧊 Freezer' },
                ].map((loc) => (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => setLocation(loc.id as StorageLocation)}
                    className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                      location === loc.id
                        ? 'bg-[#654735] text-[#FFF9F0] shadow-xs'
                        : 'text-[#9A765B] hover:text-[#654735]'
                    }`}
                  >
                    {loc.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#654735] block mb-1">
                {t.pantry.form.categoryLabel}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as FoodCategory)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#E5D5C5] bg-[#FFFEFC] text-xs font-medium text-[#654735] focus:outline-none focus:ring-2 focus:ring-[#A8B89A]"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Expiration Date with Quick Offset Buttons */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-[#654735] flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#9A765B]" />
                {t.pantry.form.expirationLabel} *
              </label>
              <div className="flex gap-1">
                {[
                  { label: '+3d', days: 3 },
                  { label: '+7d', days: 7 },
                  { label: '+14d', days: 14 },
                  { label: '+1m', days: 30 },
                ].map((off) => (
                  <button
                    key={off.label}
                    type="button"
                    onClick={() => applyOffsetDays(off.days)}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-[#F2E8D9] text-[#654735] font-bold hover:bg-[#E5D5C5]"
                  >
                    {off.label}
                  </button>
                ))}
              </div>
            </div>
            <input
              type="date"
              required
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5D5C5] bg-[#FFFEFC] text-sm text-[#654735] focus:outline-none focus:ring-2 focus:ring-[#A8B89A]"
            />
          </div>

          {/* Quantity, Unit & Price */}
          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="text-xs font-bold text-[#654735] block mb-1">
                {t.pantry.form.quantityLabel}
              </label>
              <input
                type="number"
                min="0.1"
                step="any"
                value={quantity}
                onChange={(e) => setQuantity(parseFloat(e.target.value) || 1)}
                className="w-full px-3 py-2 rounded-xl border border-[#E5D5C5] bg-[#FFFEFC] text-sm text-[#654735] focus:outline-none focus:ring-2 focus:ring-[#A8B89A]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#654735] block mb-1">
                {t.pantry.form.unitLabel}
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as any)}
                className="w-full px-2 py-2 rounded-xl border border-[#E5D5C5] bg-[#FFFEFC] text-xs font-medium text-[#654735] focus:outline-none focus:ring-2 focus:ring-[#A8B89A]"
              >
                <option value="ud">{isEs ? 'unidades (ud)' : 'units (pcs)'}</option>
                <option value="g">gramos (g)</option>
                <option value="kg">kilos (kg)</option>
                <option value="L">litros (L)</option>
                <option value="ml">mililitros (ml)</option>
                <option value="pack">pack</option>
                <option value="lata">{isEs ? 'lata' : 'can'}</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-[#654735] block mb-1">
                {t.pantry.form.priceLabel}
              </label>
              <input
                type="number"
                min="0"
                step="0.05"
                value={estimatedPrice}
                onChange={(e) => setEstimatedPrice(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-[#E5D5C5] bg-[#FFFEFC] text-sm text-[#654735] focus:outline-none focus:ring-2 focus:ring-[#A8B89A]"
              />
            </div>
          </div>

          {/* Brand (Optional) */}
          <div>
            <label className="text-xs font-bold text-[#654735] block mb-1">
              {t.pantry.form.brandLabel}
            </label>
            <input
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="e.g. Hacendado, Carrefour, Danone..."
              className="w-full px-3.5 py-2 rounded-xl border border-[#E5D5C5] bg-[#FFFEFC] text-xs text-[#654735] focus:outline-none focus:ring-2 focus:ring-[#A8B89A]"
            />
          </div>

          {/* Submit & Cancel */}
          <div className="pt-3 flex gap-2">
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-xl bg-[#654735] text-[#FFF9F0] font-bold text-sm hover:bg-[#533726] shadow-md transition-all active:scale-98"
            >
              {t.pantry.form.saveBtn}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-xl border border-[#E5D5C5] text-[#9A765B] font-semibold text-xs hover:bg-[#F2E8D9]"
            >
              {t.common.cancel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
