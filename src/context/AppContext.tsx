import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  Language,
  PantryItem,
  ShoppingItem,
  Recipe,
  DayMealPlan,
  Expense,
  UserProfile,
  MascotMood,
  ChatMessage,
  FoodCategory,
} from '../types';
import { translations } from '../i18n/translations';
import {
  INITIAL_USER_PROFILE,
  INITIAL_PANTRY_ITEMS,
  INITIAL_RECIPES,
  INITIAL_SHOPPING_ITEMS,
  INITIAL_MEAL_PLAN,
  INITIAL_EXPENSES,
} from '../data/mockData';

interface BudgetMetrics {
  total: number;
  spent: number;
  remaining: number;
  percentageUsed: number;
  daysRemaining: number;
  averageDailySpend: number;
  projectedSpend: number;
  isPaceSafe: boolean;
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.es;
  profile: UserProfile;
  updateProfile: (profile: Partial<UserProfile>) => void;
  pantryItems: PantryItem[];
  expiringPantryItems: PantryItem[];
  expiredPantryItems: PantryItem[];
  shoppingList: ShoppingItem[];
  recipes: Recipe[];
  mealPlan: DayMealPlan[];
  expenses: Expense[];
  budgetMetrics: BudgetMetrics;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  chatMessages: ChatMessage[];
  mascotMood: MascotMood;
  mascotMessage: string;
  setMascotMood: (mood: MascotMood) => void;
  // Pantry methods
  addPantryItem: (item: Omit<PantryItem, 'id'>) => void;
  editPantryItem: (item: PantryItem) => void;
  removePantryItem: (id: string) => void;
  consumePantryItem: (id: string) => void;
  updatePantryQuantity: (id: string, delta: number) => void;
  addPantryItemToShopping: (item: PantryItem) => void;
  // Shopping methods
  addShoppingItem: (item: Omit<ShoppingItem, 'id' | 'checked'>) => void;
  toggleShoppingItem: (id: string) => void;
  removeShoppingItem: (id: string) => void;
  clearCheckedShoppingItems: () => void;
  moveCheckedToPantry: () => { movedCount: number };
  addIngredientsToShoppingList: (ingredients: { name: string; amount?: string; unit?: string }[]) => void;
  // Meal plan methods
  setMealSlot: (dayIndex: number, slot: 'lunch' | 'dinner' | 'breakfast', recipe?: Recipe, customTitle?: string) => void;
  autoFillMealPlan: () => void;
  generateShoppingFromPlan: () => number;
  // Recipes
  addCustomRecipe: (recipe: Recipe) => void;
  // Expenses
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  removeExpense: (id: string) => void;
  // Chat
  sendMessage: (text: string) => Promise<void>;
  openChatWithIngredients: (ingredients: string[]) => void;
  // Reset
  resetToDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'nutria_app_state_v2';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load saved state or default
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_profile`);
      return saved ? JSON.parse(saved) : INITIAL_USER_PROFILE;
    } catch {
      return INITIAL_USER_PROFILE;
    }
  });

  const [language, setLanguageState] = useState<Language>(() => {
    return profile.language || 'es';
  });

  const [pantryItems, setPantryItems] = useState<PantryItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_pantry`);
      return saved ? JSON.parse(saved) : INITIAL_PANTRY_ITEMS;
    } catch {
      return INITIAL_PANTRY_ITEMS;
    }
  });

  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_shopping`);
      return saved ? JSON.parse(saved) : INITIAL_SHOPPING_ITEMS;
    } catch {
      return INITIAL_SHOPPING_ITEMS;
    }
  });

  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_recipes`);
      return saved ? JSON.parse(saved) : INITIAL_RECIPES;
    } catch {
      return INITIAL_RECIPES;
    }
  });

  const [mealPlan, setMealPlan] = useState<DayMealPlan[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_mealplan`);
      return saved ? JSON.parse(saved) : INITIAL_MEAL_PLAN;
    } catch {
      return INITIAL_MEAL_PLAN;
    }
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_expenses`);
      return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
    } catch {
      return INITIAL_EXPENSES;
    }
  });

  const [activeTab, setActiveTab] = useState<string>('home');
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [mascotMood, setMascotMood] = useState<MascotMood>('waving');

  // Chat message history
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'm0',
      sender: 'nutria',
      text:
        language === 'es'
          ? '¡Holaaa! 🦦 Soy Nutria, tu compañera de compras y despensa. Puedo recomendarte qué cocinar con lo que tienes en la nevera, armarte menús semanales de bajo coste o darte trucos para ahorrar. ¿En qué te ayudo?'
          : 'Hellooo! 🦦 I am Nutria, your grocery and pantry companion. I can suggest what to cook with your fridge items, build low-cost weekly menus, or share money-saving tips. How can I help you today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mood: 'waving',
    },
  ]);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_profile`, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_pantry`, JSON.stringify(pantryItems));
  }, [pantryItems]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_shopping`, JSON.stringify(shoppingList));
  }, [shoppingList]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_recipes`, JSON.stringify(recipes));
  }, [recipes]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_mealplan`, JSON.stringify(mealPlan));
  }, [mealPlan]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_expenses`, JSON.stringify(expenses));
  }, [expenses]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    setProfile((prev) => ({ ...prev, language: lang }));
  };

  const t = translations[language] || translations.es;

  // Compute Pantry Expiration Statuses
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  const { expiringPantryItems, expiredPantryItems } = useMemo(() => {
    const todayMs = new Date(todayStr).getTime();
    const dayMs = 24 * 60 * 60 * 1000;

    const expiring: PantryItem[] = [];
    const expired: PantryItem[] = [];

    pantryItems.forEach((item) => {
      const itemMs = new Date(item.expirationDate).getTime();
      const diffDays = Math.ceil((itemMs - todayMs) / dayMs);

      if (diffDays < 0) {
        expired.push(item);
      } else if (diffDays <= 3) {
        expiring.push(item);
      }
    });

    return { expiringPantryItems: expiring, expiredPantryItems: expired };
  }, [pantryItems, todayStr]);

  // Compute Budget Metrics
  const budgetMetrics = useMemo<BudgetMetrics>(() => {
    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
    const target = profile.budgetTarget || 200;
    const remaining = Math.max(0, target - totalSpent);
    const percentageUsed = Math.min(100, Math.round((totalSpent / target) * 100));

    // Approximate days in period
    const daysInPeriod = profile.budgetFrequency === 'weekly' ? 7 : 30;
    const daysRemaining = Math.max(1, Math.round(daysInPeriod * (1 - totalSpent / target)));
    const averageDailySpend = Number((totalSpent / (daysInPeriod - daysRemaining || 1)).toFixed(2));
    const projectedSpend = Number((totalSpent + (remaining / daysRemaining) * daysRemaining).toFixed(2));
    const isPaceSafe = percentageUsed <= 75;

    return {
      total: target,
      spent: Number(totalSpent.toFixed(2)),
      remaining: Number(remaining.toFixed(2)),
      percentageUsed,
      daysRemaining,
      averageDailySpend,
      projectedSpend,
      isPaceSafe,
    };
  }, [expenses, profile.budgetTarget, profile.budgetFrequency]);

  // Dynamic Contextual Mascot Message based on real data
  const mascotMessage = useMemo(() => {
    if (expiringPantryItems.length > 0) {
      return language === 'es'
        ? `¡Atención! 🦦 Tienes ${expiringPantryItems.length} ingrediente(s) en la nevera a punto de caducar. ¡Aprovéchalos hoy!`
        : `Heads up! 🦦 You have ${expiringPantryItems.length} item(s) in your fridge expiring soon. Let's cook them today!`;
    }
    if (budgetMetrics.remaining < 25) {
      return language === 'es'
        ? `Nos quedan ${budgetMetrics.remaining} € para terminar. ¡Vamos a cocinar con básicos de la despensa!`
        : `We have €${budgetMetrics.remaining} left. Let's lean on our pantry staples!`;
    }
    if (budgetMetrics.isPaceSafe) {
      return language === 'es'
        ? '¡Lo estás haciendo genial! Sigues dentro del presupuesto y cuidando tu comida.'
        : 'You are doing great! You are well within budget and keeping food organized.';
    }
    return language === 'es'
      ? '¡Come rico, gasta mejor y deja que me encargue del resto! 🦦'
      : 'Eat well, spend smarter, and let me take care of the rest! 🦦';
  }, [expiringPantryItems.length, budgetMetrics, language]);

  // Set Mascot Mood reactively
  useEffect(() => {
    if (expiringPantryItems.length > 0) {
      setMascotMood('warning');
    } else if (budgetMetrics.remaining < 25) {
      setMascotMood('thinking');
    } else if (profile.totalMoneySaved > 20) {
      setMascotMood('celebrating');
    } else {
      setMascotMood('waving');
    }
  }, [expiringPantryItems.length, budgetMetrics.remaining, profile.totalMoneySaved]);

  // --- Pantry Actions ---
  const addPantryItem = (itemData: Omit<PantryItem, 'id'>) => {
    const newItem: PantryItem = {
      ...itemData,
      id: `p_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };
    setPantryItems((prev) => [newItem, ...prev]);
  };

  const editPantryItem = (updated: PantryItem) => {
    setPantryItems((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
  };

  const removePantryItem = (id: string) => {
    setPantryItems((prev) => prev.filter((item) => item.id !== id));
  };

  const consumePantryItem = (id: string) => {
    const target = pantryItems.find((i) => i.id === id);
    if (!target) return;

    // Award savings to profile (e.g. food rescued before spoiling)
    const savedAmount = target.estimatedPrice || 1.5;
    setProfile((prev) => ({
      ...prev,
      totalMoneySaved: Number((prev.totalMoneySaved + savedAmount).toFixed(2)),
    }));

    // Remove from pantry
    setPantryItems((prev) => prev.filter((item) => item.id !== id));
    setMascotMood('celebrating');
  };

  const updatePantryQuantity = (id: string, delta: number) => {
    setPantryItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = Math.max(0, item.quantity + delta);
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const addPantryItemToShopping = (pantryItem: PantryItem) => {
    const exists = shoppingList.some((s) => s.name.toLowerCase() === pantryItem.name.toLowerCase());
    if (exists) return;

    const newShopItem: ShoppingItem = {
      id: `s_${Date.now()}`,
      name: pantryItem.name,
      category: pantryItem.category,
      quantity: 1,
      unit: pantryItem.unit,
      estimatedPrice: pantryItem.estimatedPrice || 1.5,
      checked: false,
      fromPantryAlert: true,
    };
    setShoppingList((prev) => [newShopItem, ...prev]);
  };

  // --- Shopping List Actions ---
  const addShoppingItem = (itemData: Omit<ShoppingItem, 'id' | 'checked'>) => {
    const newItem: ShoppingItem = {
      ...itemData,
      id: `s_${Date.now()}`,
      checked: false,
    };
    setShoppingList((prev) => [newItem, ...prev]);
  };

  const toggleShoppingItem = (id: string) => {
    setShoppingList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const removeShoppingItem = (id: string) => {
    setShoppingList((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCheckedShoppingItems = () => {
    setShoppingList((prev) => prev.filter((item) => !item.checked));
  };

  // Move Checked items from Shopping List straight into Pantry!
  const moveCheckedToPantry = () => {
    const checkedItems = shoppingList.filter((item) => item.checked);
    if (checkedItems.length === 0) return { movedCount: 0 };

    // Shelf life heuristics based on category
    const defaultShelfLifeDays: Record<string, number> = {
      Verduras: 6,
      Frutas: 7,
      'Lácteos y Huevos': 14,
      Carnicería: 4,
      Pescadería: 3,
      'Cereales y Pasta': 365,
      Legumbres: 365,
      Conservas: 500,
      Panadería: 5,
      Congelados: 180,
    };

    const newPantryEntries: PantryItem[] = checkedItems.map((sItem) => {
      const shelfDays = defaultShelfLifeDays[sItem.category] || 14;
      const expDate = new Date();
      expDate.setDate(expDate.getDate() + shelfDays);

      let loc: 'fridge' | 'pantry' | 'freezer' = 'pantry';
      if (['Lácteos y Huevos', 'Carnicería', 'Pescadería', 'Verduras'].includes(sItem.category)) {
        loc = 'fridge';
      } else if (sItem.category === 'Congelados') {
        loc = 'freezer';
      }

      return {
        id: `p_from_shop_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        name: sItem.name,
        category: sItem.category,
        quantity: sItem.quantity || 1,
        unit: (sItem.unit as any) || 'ud',
        location: loc,
        expirationDate: expDate.toISOString().split('T')[0],
        estimatedPrice: sItem.estimatedPrice || 1.5,
        brand: sItem.store,
      };
    });

    setPantryItems((prev) => [...newPantryEntries, ...prev]);
    setShoppingList((prev) => prev.filter((item) => !item.checked));
    setMascotMood('celebrating');

    return { movedCount: checkedItems.length };
  };

  const addIngredientsToShoppingList = (
    ingredients: { name: string; amount?: string; unit?: string }[]
  ) => {
    const newItems: ShoppingItem[] = ingredients.map((ing) => ({
      id: `s_plan_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      name: ing.name,
      category: 'Despensa y Conservas',
      quantity: 1,
      unit: ing.unit || 'ud',
      estimatedPrice: 1.4,
      checked: false,
      recipeTitle: 'Menú semanal',
    }));

    setShoppingList((prev) => [...newItems, ...prev]);
  };

  // --- Meal Plan Actions ---
  const setMealSlot = (
    dayIndex: number,
    slot: 'lunch' | 'dinner' | 'breakfast',
    recipe?: Recipe,
    customTitle?: string
  ) => {
    setMealPlan((prev) =>
      prev.map((day) => {
        if (day.dayIndex === dayIndex) {
          return {
            ...day,
            [slot]: recipe
              ? { recipeId: recipe.id, customTitle: recipe.title, costEstimate: recipe.costPerServing }
              : customTitle
              ? { customTitle, costEstimate: 1.5 }
              : undefined,
          };
        }
        return day;
      })
    );
  };

  // Auto Fill meal plan prioritizing expiring pantry items & cheap recipes
  const autoFillMealPlan = () => {
    const availableRecipes = [...recipes];
    setMealPlan((prev) =>
      prev.map((day, idx) => {
        const lunchRecipe = availableRecipes[(idx * 2) % availableRecipes.length];
        const dinnerRecipe = availableRecipes[(idx * 2 + 1) % availableRecipes.length];

        return {
          ...day,
          lunch: {
            recipeId: lunchRecipe.id,
            customTitle: lunchRecipe.title,
            costEstimate: lunchRecipe.costPerServing,
          },
          dinner: {
            recipeId: dinnerRecipe.id,
            customTitle: dinnerRecipe.title,
            costEstimate: dinnerRecipe.costPerServing,
          },
        };
      })
    );
    setMascotMood('chef');
  };

  const generateShoppingFromPlan = () => {
    // Scan all ingredients needed across the plan that are not in pantry
    const needed: ShoppingItem[] = [];
    mealPlan.forEach((day) => {
      [day.lunch, day.dinner].forEach((slot) => {
        if (slot?.recipeId) {
          const rec = recipes.find((r) => r.id === slot.recipeId);
          if (rec) {
            rec.ingredients.forEach((ing) => {
              const inPantry = pantryItems.some(
                (p) => p.name.toLowerCase().includes(ing.name.toLowerCase()) || ing.name.toLowerCase().includes(p.name.toLowerCase())
              );
              if (!inPantry) {
                needed.push({
                  id: `s_auto_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
                  name: ing.name,
                  category: 'Verduras',
                  quantity: 1,
                  unit: ing.unit || 'ud',
                  estimatedPrice: 1.25,
                  checked: false,
                  recipeTitle: rec.title,
                });
              }
            });
          }
        }
      });
    });

    if (needed.length > 0) {
      setShoppingList((prev) => [...needed, ...prev]);
    }
    return needed.length;
  };

  // --- Recipe Actions ---
  const addCustomRecipe = (recipe: Recipe) => {
    setRecipes((prev) => [recipe, ...prev]);
  };

  // --- Expenses Actions ---
  const addExpense = (expenseData: Omit<Expense, 'id'>) => {
    const newExp: Expense = {
      ...expenseData,
      id: `exp_${Date.now()}`,
    };
    setExpenses((prev) => [newExp, ...prev]);
  };

  const removeExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const updateProfile = (changes: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...changes }));
  };

  // --- Chat with Nutria ---
  const sendMessage = async (userText: string) => {
    const newMsg: ChatMessage = {
      id: `m_${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, newMsg]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history: chatMessages.slice(-6).map((m) => ({ role: m.sender, content: m.text })),
          context: {
            language,
            householdSize: profile.householdSize,
            budgetTarget: profile.budgetTarget,
            budgetFrequency: profile.budgetFrequency,
            budgetRemaining: budgetMetrics.remaining,
            supermarkets: profile.supermarkets,
            dietaryPreferences: profile.dietaryPreferences,
            allergies: profile.allergies,
            expiringItems: expiringPantryItems.map((i) => ({ name: i.name, exp: i.expirationDate })),
            totalPantryItems: pantryItems.length,
          },
        }),
      });

      const data = await response.json();
      const replyText = data.reply || (language === 'es' ? '¡Entendido! 🦦 Cuenta conmigo.' : 'Got it! 🦦 I am right here.');

      setChatMessages((prev) => [
        ...prev,
        {
          id: `m_nutria_${Date.now()}`,
          sender: 'nutria',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          mood: replyText.includes('€') ? 'thinking' : 'waving',
        },
      ]);
    } catch (err) {
      console.error('Chat error:', err);
      setChatMessages((prev) => [
        ...prev,
        {
          id: `m_nutria_err_${Date.now()}`,
          sender: 'nutria',
          text:
            language === 'es'
              ? '¡Aquí estoy! He tenido un pequeño chapuzón, pero te recomiendo aprovechar lo que tienes en la nevera antes de que caduque.'
              : 'Here I am! Had a little splash, but I recommend rescuing your expiring fridge items first.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          mood: 'thinking',
        },
      ]);
    }
  };

  const openChatWithIngredients = (ingredients: string[]) => {
    setIsChatOpen(true);
    if (!ingredients || ingredients.length === 0) return;
    const ingText = ingredients.join(', ');
    const prompt =
      language === 'es'
        ? `Tengo estos ingredientes que caducan en menos de 3 días: ${ingText}. ¿Qué recetas fáciles, deliciosas y económicas me recomiendas cocinar hoy para aprovecharlos al máximo?`
        : `I have these ingredients expiring within 3 days: ${ingText}. What easy, tasty, and affordable recipes do you recommend cooking today to make the most of them?`;
    sendMessage(prompt);
  };

  const resetToDemoData = () => {
    setProfile(INITIAL_USER_PROFILE);
    setPantryItems(INITIAL_PANTRY_ITEMS);
    setShoppingList(INITIAL_SHOPPING_ITEMS);
    setRecipes(INITIAL_RECIPES);
    setMealPlan(INITIAL_MEAL_PLAN);
    setExpenses(INITIAL_EXPENSES);
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        profile,
        updateProfile,
        pantryItems,
        expiringPantryItems,
        expiredPantryItems,
        shoppingList,
        recipes,
        mealPlan,
        expenses,
        budgetMetrics,
        activeTab,
        setActiveTab,
        isChatOpen,
        setIsChatOpen,
        chatMessages,
        mascotMood,
        mascotMessage,
        setMascotMood,
        addPantryItem,
        editPantryItem,
        removePantryItem,
        consumePantryItem,
        updatePantryQuantity,
        addPantryItemToShopping,
        addShoppingItem,
        toggleShoppingItem,
        removeShoppingItem,
        clearCheckedShoppingItems,
        moveCheckedToPantry,
        addIngredientsToShoppingList,
        setMealSlot,
        autoFillMealPlan,
        generateShoppingFromPlan,
        addCustomRecipe,
        addExpense,
        removeExpense,
        sendMessage,
        openChatWithIngredients,
        resetToDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
