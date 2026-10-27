import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize GoogleGenAI
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;

if (apiKey) {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// Common Spanish supermarket barcode sample database
interface BarcodeItem {
  barcode: string;
  name: string;
  nameEn: string;
  category: string;
  defaultLocation: 'fridge' | 'pantry' | 'freezer';
  shelfLifeDays: number;
  estimatedPrice: number;
  unit: string;
  defaultQuantity: number;
  brand?: string;
}

const BARCODE_DATABASE: Record<string, BarcodeItem> = {
  '8480000100012': {
    barcode: '8480000100012',
    name: 'Leche Entera Hacendado (1L)',
    nameEn: 'Whole Milk Hacendado (1L)',
    category: 'Lácteos',
    defaultLocation: 'fridge',
    shelfLifeDays: 7,
    estimatedPrice: 0.96,
    unit: 'L',
    defaultQuantity: 1,
    brand: 'Hacendado',
  },
  '8480000200021': {
    barcode: '8480000200021',
    name: 'Huevos Camperos Clase M/L (12 uds)',
    nameEn: 'Free-Range Eggs M/L (12 pcs)',
    category: 'Lácteos y Huevos',
    defaultLocation: 'fridge',
    shelfLifeDays: 21,
    estimatedPrice: 2.35,
    unit: 'ud',
    defaultQuantity: 12,
    brand: 'Hacendado',
  },
  '8480000300038': {
    barcode: '8480000300038',
    name: 'Arroz Redondo Extra (1 kg)',
    nameEn: 'Round Rice Extra (1 kg)',
    category: 'Cereales y Pasta',
    defaultLocation: 'pantry',
    shelfLifeDays: 365,
    estimatedPrice: 1.35,
    unit: 'kg',
    defaultQuantity: 1,
    brand: 'Hacendado',
  },
  '8480000400045': {
    barcode: '8480000400045',
    name: 'Tomate Frito Estilo Casero (350 g)',
    nameEn: 'Fried Tomato Sauce (350 g)',
    category: 'Conservas',
    defaultLocation: 'pantry',
    shelfLifeDays: 180,
    estimatedPrice: 1.15,
    unit: 'ud',
    defaultQuantity: 1,
    brand: 'Hacendado',
  },
  '8480000500052': {
    barcode: '8480000500052',
    name: 'Pechuga de Pollo Fileteada (500 g)',
    nameEn: 'Sliced Chicken Breast (500 g)',
    category: 'Carnicería',
    defaultLocation: 'fridge',
    shelfLifeDays: 4,
    estimatedPrice: 3.85,
    unit: 'g',
    defaultQuantity: 500,
    brand: 'Mercadona',
  },
  '8480000600069': {
    barcode: '8480000600069',
    name: 'Yogur Griego Natural (Pack 4x125g)',
    nameEn: 'Natural Greek Yogurt (4x125g)',
    category: 'Lácteos',
    defaultLocation: 'fridge',
    shelfLifeDays: 14,
    estimatedPrice: 1.60,
    unit: 'pack',
    defaultQuantity: 1,
    brand: 'Hacendado',
  },
  '8480000700076': {
    barcode: '8480000700076',
    name: 'Aceite de Oliva Virgen Extra (1L)',
    nameEn: 'Extra Virgin Olive Oil (1L)',
    category: 'Aceites y Condimentos',
    defaultLocation: 'pantry',
    shelfLifeDays: 360,
    estimatedPrice: 7.95,
    unit: 'L',
    defaultQuantity: 1,
    brand: 'Hacendado',
  },
  '8480000800083': {
    barcode: '8480000800083',
    name: 'Atún Claro en Aceite de Oliva (Pack 3x80g)',
    nameEn: 'Light Tuna in Olive Oil (3x80g)',
    category: 'Conservas',
    defaultLocation: 'pantry',
    shelfLifeDays: 730,
    estimatedPrice: 2.75,
    unit: 'pack',
    defaultQuantity: 1,
    brand: 'Hacendado',
  },
  '8480000900090': {
    barcode: '8480000900090',
    name: 'Lentejas Pardinas Secas (1 kg)',
    nameEn: 'Brown Lentils (1 kg)',
    category: 'Legumbres',
    defaultLocation: 'pantry',
    shelfLifeDays: 540,
    estimatedPrice: 1.85,
    unit: 'kg',
    defaultQuantity: 1,
    brand: 'Hacendado',
  },
  '8480001000103': {
    barcode: '8480001000103',
    name: 'Espinacas Frescas Lavadas (300 g)',
    nameEn: 'Fresh Washed Spinach (300 g)',
    category: 'Verduras',
    defaultLocation: 'fridge',
    shelfLifeDays: 5,
    estimatedPrice: 1.29,
    unit: 'g',
    defaultQuantity: 300,
    brand: 'Florette',
  },
  '8480001100110': {
    barcode: '8480001100110',
    name: 'Guisantes Finos Congelados (1 kg)',
    nameEn: 'Fine Frozen Peas (1 kg)',
    category: 'Congelados',
    defaultLocation: 'freezer',
    shelfLifeDays: 365,
    estimatedPrice: 1.55,
    unit: 'kg',
    defaultQuantity: 1,
    brand: 'Hacendado',
  },
  '8480001200127': {
    barcode: '8480001200127',
    name: 'Queso Gouda en Lonchas (200 g)',
    nameEn: 'Sliced Gouda Cheese (200 g)',
    category: 'Lácteos',
    defaultLocation: 'fridge',
    shelfLifeDays: 20,
    estimatedPrice: 1.75,
    unit: 'g',
    defaultQuantity: 200,
    brand: 'Hacendado',
  },
};

// API Route: Barcode lookup
app.post('/api/barcode-lookup', (req: Request, res: Response) => {
  const { barcode } = req.body;
  if (!barcode) {
    res.status(400).json({ error: 'Barcode is required' });
    return;
  }

  const cleanBarcode = String(barcode).trim();
  const matched = BARCODE_DATABASE[cleanBarcode];

  if (matched) {
    res.json({ found: true, item: matched });
    return;
  }

  // Fallback heuristic for unknown barcode
  const sampleNames = [
    { name: 'Alimento Escaneado', nameEn: 'Scanned Food Item', category: 'Despensa', loc: 'pantry', days: 30, price: 1.50 },
    { name: 'Producto Fresco', nameEn: 'Fresh Produce', category: 'Verduras', loc: 'fridge', days: 6, price: 1.80 },
    { name: 'Lácteo Escaneado', nameEn: 'Scanned Dairy', category: 'Lácteos', loc: 'fridge', days: 12, price: 1.65 },
  ];
  const hash = cleanBarcode.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const picked = sampleNames[hash % sampleNames.length];

  res.json({
    found: true,
    item: {
      barcode: cleanBarcode,
      name: `${picked.name} (#${cleanBarcode.slice(-4)})`,
      nameEn: `${picked.nameEn} (#${cleanBarcode.slice(-4)})`,
      category: picked.category,
      defaultLocation: picked.loc,
      shelfLifeDays: picked.days,
      estimatedPrice: picked.price,
      unit: 'ud',
      defaultQuantity: 1,
    },
    isSimulated: true,
  });
});

// API Route: Nutria Chat Assistant with Gemini
app.post('/api/chat', async (req: Request, res: Response) => {
  const { message, history = [], context = {} } = req.body;

  const language = context.language || 'es';
  const isSpanish = language === 'es';

  // Build system context
  const systemInstruction = `You are Nutria, an adorable, enthusiastic, practical, and caring otter mascot for a modern grocery planning and anti-food-waste app called Nutria.
Personality: Warm, friendly, encouraging, smart with money, loves good food, hates food waste, speaks warmly (like a caring friend and culinary companion).
Use otter touches naturally without being annoying (e.g. 🦦 emoji occasionally).
Language: You MUST respond in ${isSpanish ? 'Spanish (Español)' : 'English'}.
Currency: Always use euros (€) and Spanish supermarket context (Mercadona, Carrefour, Lidl, Dia, Alcampo).

User's Current Context:
- Household size: ${context.householdSize || 1} people
- Current Budget: ${context.budgetTarget || 200} € (${context.budgetFrequency || 'monthly'})
- Remaining Budget: ${context.budgetRemaining !== undefined ? context.budgetRemaining : 150} €
- Diet: ${context.dietaryPreferences?.join(', ') || 'Variada'}
- Dislikes/Allergies: ${context.allergies?.join(', ') || 'Ninguna'}
- Expiring Pantry Items: ${JSON.stringify(context.expiringItems || [])}
- Other Pantry Items count: ${context.totalPantryItems || 10}
- Supermarket preference: ${context.supermarkets?.join(', ') || 'Mercadona, Lidl'}

Core Responsibilities:
1. When asked what to cook with their fridge/pantry, prioritize using their EXPIRING items!
2. When asked for budget shopping lists, give affordable, balanced Spanish market estimates.
3. Keep answers practical, structured, easy to read with bullet points or step numbers.
4. If suggesting ingredients, mention approximate € cost.`;

  if (ai) {
    try {
      const formattedHistory = (history || []).map((h: any) => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.content || h.text || '' }],
      }));

      const contents = [
        ...formattedHistory,
        { role: 'user', parts: [{ text: message }] },
      ];

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        },
      });

      const reply = response.text || (isSpanish
        ? '¡Hola! 🦦 Parece que he tenido un chapuzón mental, pero aquí estoy para ayudarte a planificar tu compra y cocinar rico.'
        : 'Hello! 🦦 Looks like I had a quick dip, but I am right here to help you plan your groceries and cook tasty meals.');

      res.json({ reply });
      return;
    } catch (err: any) {
      console.error('Gemini API call failed, falling back to smart simulated response:', err);
    }
  }

  // Graceful fallback response when no API key is available or on error
  let fallbackReply = '';
  const lowerMsg = (message || '').toLowerCase();

  if (isSpanish) {
    if (lowerMsg.includes('nevera') || lowerMsg.includes('cocinar') || lowerMsg.includes('ingrediente') || lowerMsg.includes('despensa')) {
      const expiringNames = (context.expiringItems || []).map((i: any) => i.name).slice(0, 3).join(', ');
      fallbackReply = `¡Hola! 🦦 He echado un vistazo a tu despensa y nevera. 

${expiringNames ? `Lo más urgente es aprovechar: **${expiringNames}** antes de que se echen a perder.` : 'Tienes buenos básicos en tu inventario.'}

Te propongo estas 2 ideas súper económicas:
1. **Tortilla paisana o revuelto cremoso** con los huevos y las verduras que tienes a punto de caducar (Coste aprox: ~1,10 €/ración).
2. **Salteado exprés con legumbres o arroz** aprovechando cualquier resto de verdura o proteína (Coste aprox: ~1,30 €/ración).

¿Quieres que te detalle los pasos de alguna o prefieres añadir los ingredientes que falten a tu lista de la compra?`;
    } else if (lowerMsg.includes('presupuesto') || lowerMsg.includes('ahorr') || lowerMsg.includes('semana') || lowerMsg.includes('gasto')) {
      fallbackReply = `¡Vamos a cuidar esos euritos! 🦦 

Tu presupuesto restante es de **${context.budgetRemaining !== undefined ? context.budgetRemaining : '145'} €**. 

Mis 3 consejos de oro para esta semana:
- **Básicos de temporada:** El calabacín, zanahorias y legumbres secas te dan comidas saciantes por menos de 1 € la ración.
- **Marcas blancas del súper:** Comprar marcas como Hacendado o Milbona en Lidl suele ahorrar un 25-30% frente a marcas líderes.
- **Planifica antes de ir:** Ir con la lista de Nutria evita esas compras por impulso que suman 15 € de más.

¿Quieres que armemos una lista de la compra para 3-4 días por menos de 20 €?`;
    } else {
      fallbackReply = `¡Holaaa! 🦦 Soy Nutria, tu compañera de compra y cocina. 

Puedo ayudarte con:
- 🍲 **Cocinar con lo que tienes:** Dime qué hay en tu nevera o déjame revisar los que caducan pronto.
- 🛒 **Planificar tu compra:** Hacemos listas optimizadas por pasillos de Mercadona, Lidl o Carrefour.
- 💰 **Ahorrar en el presupuesto:** Te propongo menús semanales equilibrados por menos de 35-40 €.

¿Por dónde empezamos hoy?`;
    }
  } else {
    if (lowerMsg.includes('fridge') || lowerMsg.includes('cook') || lowerMsg.includes('ingredient') || lowerMsg.includes('pantry')) {
      fallbackReply = `Hello! 🦦 I took a peek at your pantry and fridge.

${context.expiringItems?.length ? `The most urgent items to rescue are: **${context.expiringItems.map((i: any) => i.name).slice(0, 3).join(', ')}**.` : 'You have great staples ready to use!'}

Here are 2 smart, budget-friendly ideas:
1. **Quick Veggie Frittata or Scramble** using your expiring produce and eggs (~€1.10 per serving).
2. **Pantry Grain Bowl** with rice, canned beans/tuna and sauteed veggies (~€1.35 per serving).

Would you like the full recipe steps, or shall we add any missing items to your shopping list?`;
    } else {
      fallbackReply = `Hellooo! 🦦 I am Nutria, your friendly grocery and kitchen companion.

I can help you:
- 🍲 **Cook from your fridge:** Turn expiring food into delicious, zero-waste meals.
- 🛒 **Plan your shopping:** Generate aisle-organized grocery lists with price estimates.
- 💰 **Stay within budget:** Design weekly meal plans for under €35-40.

What would you like to tackle first?`;
    }
  }

  res.json({ reply: fallbackReply });
});

// API Route: AI Recipe Generation based on pantry items
app.post('/api/generate-recipe', async (req: Request, res: Response) => {
  const { ingredients = [], mealType = 'dinner', language = 'es', preferences = {} } = req.body;
  const isSpanish = language === 'es';

  if (ai) {
    try {
      const prompt = `Create an affordable, delicious, easy recipe to reduce food waste using these specific available ingredients: ${ingredients.join(', ')}.
Meal type: ${mealType}.
Language: ${isSpanish ? 'Spanish' : 'English'}.
Dietary preferences: ${JSON.stringify(preferences)}.
Return JSON format with the following keys:
- title: string (catchy, appetizing name)
- description: string (short description highlighting anti-waste and taste)
- prepTimeMinutes: number
- servings: number
- costPerServing: number (in euros, e.g. 1.25)
- totalCost: number (in euros)
- difficulty: string ("Fácil" or "Easy")
- ingredients: array of objects { name: string, amount: string, unit: string, isFromPantry: boolean }
- instructions: array of strings (clear, numbered cooking steps)
- savingsTip: string (why this recipe saves money)`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      if (parsed.title) {
        res.json({ recipe: parsed });
        return;
      }
    } catch (err) {
      console.error('Gemini recipe generation failed, using fallback recipe:', err);
    }
  }

  // Fallback recipe
  const primaryIng = ingredients[0] || (isSpanish ? 'Huevos y verduras' : 'Eggs and veggies');
  const fallbackRecipe = isSpanish
    ? {
        title: `Salteado Sabroso de ${primaryIng} y Especias`,
        description: 'Una receta rápida, deliciosa y anti-desperdicio para darle una segunda vida a lo que tienes en la nevera.',
        prepTimeMinutes: 20,
        servings: 2,
        costPerServing: 1.15,
        totalCost: 2.30,
        difficulty: 'Fácil',
        ingredients: [
          ...ingredients.map((ing: string) => ({ name: ing, amount: '1', unit: 'porción', isFromPantry: true })),
          { name: 'Aceite de oliva virgen extra', amount: '2', unit: 'cucharadas', isFromPantry: true },
          { name: 'Ajo y especias al gusto', amount: '1', unit: 'pizca', isFromPantry: true },
        ],
        instructions: [
          'Lava y pica los ingredientes en trozos regulares para que se cocinen al mismo tiempo.',
          'Calienta un fondo de aceite de oliva en una sartén grande a fuego medio.',
          'Saltea primero las verduras más duras y luego añade las proteínas o ingredientes más tiernos.',
          'Sazona con sal, pimienta y tus hierbas favoritas. Sirve caliente y disfruta de tu plato sin desperdicio.',
        ],
        savingsTip: 'Aprovechar estos ingredientes antes de que caduquen evita tirar comida y te ahorra entre 3 € y 5 € en la compra.',
      }
    : {
        title: `Savory Sauté of ${primaryIng} & Herbs`,
        description: 'A quick, delicious zero-waste meal turning your expiring fridge items into an appetizing dinner.',
        prepTimeMinutes: 20,
        servings: 2,
        costPerServing: 1.15,
        totalCost: 2.30,
        difficulty: 'Easy',
        ingredients: [
          ...ingredients.map((ing: string) => ({ name: ing, amount: '1', unit: 'portion', isFromPantry: true })),
          { name: 'Extra virgin olive oil', amount: '2', unit: 'tbsp', isFromPantry: true },
          { name: 'Garlic & seasoning', amount: '1', unit: 'pinch', isFromPantry: true },
        ],
        instructions: [
          'Chop the ingredients into bite-sized pieces so they cook evenly.',
          'Heat olive oil in a wide pan over medium heat.',
          'Sauté tougher vegetables first, then fold in lighter ingredients and seasonings.',
          'Cook until tender, adjust seasoning, and serve immediately.',
        ],
        savingsTip: 'Using these pantry items saves an estimated €3 to €5 compared to ordering out or buying new groceries.',
      };

  res.json({ recipe: fallbackRecipe });
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', app: 'Nutria', timestamp: new Date().toISOString() });
});

// Vite middleware for frontend development & static file serving
async function startServer() {
  const distPath = path.resolve(__dirname, 'dist');
  const hasDist = fs.existsSync(path.join(distPath, 'index.html'));

  if (process.env.NODE_ENV === 'production' && hasDist) {
    console.log('📦 Serving production build from dist/');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    console.log('⚡ Starting Vite development server middleware...');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    // Fallback for SPA routing in dev mode
    app.use('*', async (req: Request, res: Response, next) => {
      if (req.originalUrl.startsWith('/api')) {
        return next();
      }
      try {
        const url = req.originalUrl;
        const indexPath = path.resolve(__dirname, 'index.html');
        if (fs.existsSync(indexPath)) {
          let template = fs.readFileSync(indexPath, 'utf-8');
          template = await vite.transformIndexHtml(url, template);
          res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
        } else {
          next();
        }
      } catch (e) {
        next(e);
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🦦 Nutria App running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
