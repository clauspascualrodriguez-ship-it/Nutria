# 🌐 GUIA PER PUBLICAR NUTRIA COM A WEB APP (PÚBLICA I GRATUÏTA)

Aquesta guia t'explica pas a pas com tenir **Nutria** publicada a Internet amb un enllaç públic (com `nutria-app.vercel.app`), accessible des de qualsevol mòbil, tauleta o ordinador i instal·lable a la pantalla d'inici del teu iPhone o Android.

---

## 🚀 OPCIÓ 1: Publicar a VERCEL (Recomanada, 2 minuts, 100% Gratuïta)

Vercel és la plataforma més ràpida i popular per a aplicacions React i Vite:

### Pas 1: Pujar el codi a GitHub
1. A la barra superior de Google AI Studio, fes clic a **"Export" / "GitHub"** per guardar el codi en un repositori del teu compte de GitHub (o descarrega el projecte en `.zip` i puja'l a GitHub).

### Pas 2: Connectar amb Vercel
1. Entra a [vercel.com](https://vercel.com) i crea un compte gratuït (pots iniciar sessió directament amb el teu GitHub).
2. Fes clic a **"Add New..." > "Project"**.
3. Selecciona el repositori de la teva app **Nutria**.
4. Vercel detectarà automàticament:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. (Opcional) Si vols activar la IA de Google Gemini al servidor, a la secció **Environment Variables** afegeix:
   - `GEMINI_API_KEY`: la teva clau de Gemini.
6. Fes clic a **"Deploy"**.

✨ En 30 segons tindràs un enllaç públic (per exemple: `https://nutria-app.vercel.app`).

---

## ⚡ OPCIÓ 2: Publicar a NETLIFY (Gratuïta, sense comandes)

1. Entra a [netlify.com](https://netlify.com) i inicia sessió amb GitHub.
2. Fes clic a **"Add new site" > "Import an existing project"**.
3. Tria el teu repositori de GitHub.
4. Fes clic a **"Deploy Nutria"**.
5. Netlify utilitzarà el fitxer `netlify.toml` que ja hem configurat i et donarà un enllaç públic immediatament.

---

## 📱 COM INSTAL·LAR LA WEB APP AL TEU MÒBIL COM UNA APP REAL

Un cop tinguis el teu enllaç públic de Vercel o Netlify:

### Al teu iPhone (iOS):
1. Obre el teu enllaç amb **Safari**.
2. Toca el botó de **Compartir** (la icona d'un quadrat amb una fletxa cap amunt al mig de la barra inferior).
3. Baixa una mica i toca **"Afegir a la pantalla d'inici"** (*Add to Home Screen*).
4. Toca **"Afegeix"**.
5. Apareixerà la icona oficial de la **Nutria amb el carretó** a la teva pantalla d'inici!
6. Quan la toquis, s'obrirà a pantalla completa, sense la barra del navegador, exactament com una app descarregada de l'App Store.

### A Android:
1. Obre el teu enllaç amb **Google Chrome**.
2. Veuràs una barra inferior o missatge que diu **"Afegeix Nutria a la pantalla d'inici"** o toca els 3 punts de dalt a la dreta > **"Instal·la l'aplicació"**.
3. L'aplicació s'instal·larà al teu mòbil amb la seva icona pròpia.

---

## 💡 Què hem deixat preparat al projecte:
- ✅ `vercel.json` configurat per a rutes netes SPA.
- ✅ `netlify.toml` configurat per a redireccions.
- ✅ PWA Manifest (`manifest.webmanifest`) amb la imatge de la nutria amb el carretó.
- ✅ Service Worker registrat per a funcionament ultra ràpid i memòria cau.
- ✅ Base de dades de codis de barres i respostes integrades al client perquè funcioni fins i tot sense connexió.
