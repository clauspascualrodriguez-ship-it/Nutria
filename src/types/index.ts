export type Language = 'es' | 'en';

export type StorageLocation = 'fridge' | 'pantry' | 'freezer';

export type FoodCategory =
  | 'Verduras'
  | 'Frutas'
  | 'Lácteos y Huevos'
  | 'Carnicería'
  | 'Pescadería'
  | 'Cereales y Pasta'
  | 'Legumbres'
  | 'Conservas'
  | 'Panadería'
  | 'Bebidas'
  | 'Congelados'
  | 'Aceites y Condimentos'
  | 'Snacks y Dulces'
  | 'Hogar y Limpieza'
  | 'Otros';

export interface PantryItem {
  id: string;
  name: string;
  category: FoodCategory | string;
  quantity: number;
  unit: 'g' | 'kg' | 'ml' | 'L' | 'ud' | 'pack' | 'lata' | 'botella';
  location: StorageLocation;
  expirationDate: string; // YYYY-MM-DD
  purchaseDate?: string;
  estimatedPrice: number; // in €
  barcode?: string;
  brand?: string;
  notes?: string;
}

export interface ShoppingItem {
  id: string;
  name: string;
  category: FoodCategory | string;
  quantity: number;
  unit: string;
  estimatedPrice: number; // in €
  checked: boolean;
  store?: string;
  fromPantryAlert?: boolean;
  recipeTitle?: string;
}

export interface RecipeIngredient {
  name: string;
  amount: string;
  unit: string;
  inPantry?: boolean;
}

export interface Recipe {
  id: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  prepTimeMinutes: number;
  servings: number;
  costPerServing: number;
  totalCost: number;
  category: 'lunch' | 'dinner' | 'breakfast' | 'snack';
  difficulty: 'Fácil' | 'Media' | 'Easy' | 'Medium';
  ingredients: RecipeIngredient[];
  instructions: string[];
  instructionsEn?: string[];
  tags: string[];
  savingsTip?: string;
  savingsTipEn?: string;
  pantryMatchPercentage?: number;
}

export interface MealSlot {
  recipeId?: string;
  customTitle?: string;
  costEstimate?: number;
}

export interface DayMealPlan {
  dayIndex: number; // 0 = Mon, 6 = Sun
  dayName: string;
  dayNameEn: string;
  dateStr?: string;
  breakfast?: MealSlot;
  lunch?: MealSlot;
  dinner?: MealSlot;
  snack?: MealSlot;
}

export interface Expense {
  id: string;
  date: string; // YYYY-MM-DD
  supermarket: string;
  amount: number;
  category: string;
  note?: string;
}

export interface UserProfile {
  name: string;
  householdSize: number;
  budgetTarget: number;
  budgetFrequency: 'weekly' | 'monthly';
  currency: string;
  supermarkets: string[];
  dietaryPreferences: string[];
  dislikes: string[];
  allergies: string[];
  mainGoal: string;
  recipeStyle: string;
  language: Language;
  hasCompletedOnboarding: boolean;
  totalMoneySaved: number;
}

export type MascotMood =
  | 'waving'
  | 'chef'
  | 'thinking'
  | 'celebrating'
  | 'shopping'
  | 'warning'
  | 'sleeping'
  | 'pointing';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'nutria';
  text: string;
  timestamp: string;
  mood?: MascotMood;
  suggestedActions?: {
    label: string;
    actionType: 'navigate' | 'add_to_list' | 'view_recipe';
    payload?: any;
  }[];
}
